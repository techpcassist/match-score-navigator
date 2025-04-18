
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "npm:@google/generative-ai";

/**
 * Initializes and configures the Gemini AI client
 */
export function initializeGeminiClient(apiKey: string) {
  // Initialize the Gemini AI client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Configure the model - using the most capable model for this parsing task
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // Use a more consistent and faster model
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  return model;
}

/**
 * Builds the prompt for resume parsing
 */
export function buildResumeParsingPrompt(resumeText: string): string {
  return `
    You are an expert resume parser that can handle ANY resume format (traditional, creative, academic, etc.) with high accuracy. Parse the following resume text STRICTLY based on its content into a structured JSON object. 
    
    CRITICAL INSTRUCTION: You MUST NOT invent, assume, or generate ANY information that is not explicitly present in the resume. If information is not clearly stated in the resume, mark it as null or omit it entirely. DO NOT HALLUCINATE COMPANIES, POSITIONS, OR ANY OTHER DETAILS.

    1. Identify Sections: Recognize both standard and non-standard section headers like 'Contact Information', 'Summary'/'Objective', 'Skills', 'Work Experience'/'Employment History'/'Professional Experience', 'Education', 'Certifications', 'Projects', 'Publications', 'Patents', 'Volunteer Work', etc.
    
    2. Parse Contact Details: Extract full_name, email, phone, whatsapp? (if distinct and clearly identifiable), linkedin? (URL/ID), website? (portfolio or personal site) into a contact_details object. Only include fields that are EXPLICITLY present in the text.
    
    3. Generate Summary: Create a summary (string): Generate a concise 3-5 line summary based ONLY on the actual content and key terms found throughout the resume. Do not invent new information.
    
    4. Parse Skills: Extract skills from both dedicated 'Skills' sections AND skills mentioned throughout the document. Return as a skills array (array of strings).
    
    5. Parse Work Experience (CRITICAL INSTRUCTION):
       - Extract ONLY work experiences that are EXPLICITLY listed in the resume
       - DO NOT generate or invent any companies, positions, or details that are not clearly stated
       - If a section or certain details within a job entry are ambiguous, mark them as null or omit them
       - Never assume information or "fill in gaps" with reasonable guesses
       - Handle Various Formats: Identify job entries regardless of format (bullet points, paragraphs, tables, etc.). Look for patterns that indicate new jobs like changes in company names, dates, titles, or formatting.
       - Extract for EACH Entry: For every distinct job entry CLEARLY identified:
         - Extract company_name (string) ONLY if clearly stated. If not found or ambiguous, return null.
         - Extract location: state (string), country (string), city (string if available), ONLY if clearly stated.
         - Extract start_date and end_date (strings). Normalize date formats to MM/YYYY or Month YYYY format when possible. Identify 'Present'/'Till Date'/'Current' for ongoing roles. If dates are ambiguous or missing, return null.
         - Locate job_title (string): Look for job titles in various positions. If no clear title is found, return null.
         - Extract responsibilities_text (string): Capture text describing this role, including bullet points, paragraphs, and achievements.
         - Extract skills_tools_used (array): Identify technical skills, tools, frameworks, methodologies mentioned specifically within THIS job description.
       - Maintain Chronology: Ensure entries are ordered by date, typically newest to oldest.
    
    6. Parse Education & Certifications:
       - Detect ONLY formal degrees and professional certifications that are EXPLICITLY mentioned
       - For each entry, extract course_certification_name, institute_name, university_name?, state, country, start_date?, end_date?, gpa? (if mentioned), and determine is_certification (boolean).
       - If is_certification is true, extract certificate_authority?, certificate_number?, validity?. Return null for fields not found.
       - Collate into an education array.
    
    7. Handle Formatting Variations:
       - Account for different resume styles (chronological, functional, combined, etc.)
       - Parse both bullet-point and paragraph formats
       - Handle various date formats (MM/YYYY, Month YYYY, Season YYYY, etc.)
       - Recognize section headers even if they use non-standard phrasing
    
    8. Handle Missing Information: If any field cannot be reliably found, return null for that specific field. DO NOT guess, infer, or pull information from unrelated parts of the resume. Your output must strictly reflect ONLY what is EXPLICITLY stated in the input text.
    
    9. Consistency Check: After parsing, review the extracted data and verify that ALL information corresponds to what is explicitly stated in the resume. Remove any entries or fields where you are not highly confident in their accuracy.
    
    10. Output Format: Return ONLY the structured JSON object containing the extracted data. Do not include any explanations or text outside the JSON.
    
    Example output format:
    {
      "summary": "...",
      "experiences": [
        {
          "company_name": "COMPANY A",
          "state": "CA",
          "country": "USA",
          "city": "San Francisco",
          "start_date": "JUNE 2019",
          "end_date": "PRESENT",
          "job_title": "Software Engineer",
          "responsibilities_text": "...",
          "skills_tools_used": ["JavaScript", "React"]
        }
      ],
      "education": [
        {
          "course_certification_name": "Bachelor of Science in Computer Science",
          "institute_name": "University of California",
          "university_name": null,
          "state": "CA",
          "country": "USA",
          "start_date": "2015",
          "end_date": "2019",
          "gpa": "3.8",
          "is_certification": false
        },
        {
          "course_certification_name": "AWS Certified Solutions Architect",
          "institute_name": "Amazon Web Services",
          "university_name": null,
          "state": null,
          "country": null,
          "start_date": null,
          "end_date": "2022",
          "is_certification": true,
          "certificate_authority": "AWS",
          "certificate_number": "ABC123456",
          "validity": "3 years"
        }
      ],
      "contact_details": {
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "whatsapp": null,
        "linkedin": "linkedin.com/in/johndoe",
        "website": "johndoe.dev"
      },
      "skills": ["JavaScript", "React", "Node.js", "AWS", "Python"]
    }
    
    RESUME TEXT:
    ${resumeText}
    
    FINAL REMINDER: DO NOT INVENT OR ASSUME ANY INFORMATION. Only include information that is EXPLICITLY stated in the resume. If you're unsure about any information, mark it as null or omit it entirely.
    
    Respond with ONLY valid JSON without any markdown formatting or explanations.
  `;
}

/**
 * Generates content using the Gemini model
 */
export async function generateResumeAnalysis(model: any, prompt: string) {
  // Generate content using the model with lower temperature for more factual responses
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1, // Lower temperature for more deterministic, factual responses
      topP: 0.85,       // Controlled diversity for reliability
      topK: 30,         // More focused responses
      maxOutputTokens: 8192, // Allow for long outputs to handle complex resumes
    }
  });
  
  const response = await result.response;
  return response.text();
}
