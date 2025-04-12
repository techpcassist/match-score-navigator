
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment variable
    const apiKey = Deno.env.get("GOOGLE_GENERATIVE_AI_KEY");
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_KEY environment variable");
    }

    // Parse request body
    const { resume_text } = await req.json();
    
    if (!resume_text || typeof resume_text !== 'string') {
      throw new Error("Missing or invalid resume_text in request body");
    }

    console.log("Parsing resume with Gemini...");

    // Initialize the Gemini AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure the model - using the most capable model for this parsing task
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // Using the most capable model for complex parsing
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

    // Construct the comprehensive prompt for parsing any resume format
    const prompt = `
    You are an expert resume parser that can handle ANY resume format (traditional, creative, academic, etc.) with high accuracy. Parse the following resume text STRICTLY based on its content into a structured JSON object. Do NOT invent information or assume details not present.

    1. Identify Sections: Recognize both standard and non-standard section headers like 'Contact Information', 'Summary'/'Objective', 'Skills', 'Work Experience'/'Employment History'/'Professional Experience', 'Education', 'Certifications', 'Projects', 'Publications', 'Patents', 'Volunteer Work', etc.
    
    2. Parse Contact Details: Extract full_name, email, phone, whatsapp? (if distinct and clearly identifiable), linkedin? (URL/ID), website? (portfolio or personal site) into a contact_details object.
    
    3. Generate Summary: Create a summary (string): Generate a concise 3-5 line summary based ONLY on the actual content and key terms found throughout the resume.
    
    4. Parse Skills: Extract skills from both dedicated 'Skills' sections AND skills mentioned throughout the document. Return as a skills array (array of strings).
    
    5. Parse Work Experience (CRITICAL DETAIL):
       - Handle Various Formats: Identify job entries regardless of format (bullet points, paragraphs, tables, etc.). Look for patterns that indicate new jobs like changes in company names, dates, titles, or formatting.
       - Extract for EACH Entry: For every distinct job entry identified:
         - Extract company_name (string).
         - Extract location: state (string), country (string), city (string if available).
         - Extract start_date and end_date (strings). Normalize date formats to MM/YYYY or Month YYYY format when possible. Identify 'Present'/'Till Date'/'Current' for ongoing roles. If dates are ambiguous or missing, return null or the text as found.
         - Locate job_title (string): Look for job titles in various positions - above company name, after company name, before dates, or in the first sentence of descriptions. If no clear title is found, return null.
         - Extract responsibilities_text (string): Capture ALL text describing this role, including bullet points, paragraphs, and achievements.
         - Extract skills_tools_used (array): Identify technical skills, tools, frameworks, methodologies mentioned specifically within THIS job description.
       - Maintain Chronology: Ensure entries are ordered by date, typically newest to oldest.
    
    6. Parse Education & Certifications:
       - Detect both formal degrees and professional certifications.
       - For each entry, extract course_certification_name, institute_name, university_name?, state, country, start_date?, end_date?, gpa? (if mentioned), and determine is_certification (boolean).
       - If is_certification is true, extract certificate_authority?, certificate_number?, validity?. Return null for fields not found.
       - Collate into an education array.
    
    7. Handle Formatting Variations:
       - Account for different resume styles (chronological, functional, combined, etc.)
       - Parse both bullet-point and paragraph formats
       - Handle various date formats (MM/YYYY, Month YYYY, Season YYYY, etc.)
       - Recognize section headers even if they use non-standard phrasing
    
    8. Handle Missing Information: If any field cannot be reliably found, return null for that specific field. Do not guess, infer widely, or pull information from unrelated parts of the resume. Your output must strictly reflect the input text structure and content.
    
    9. Output Format: Return ONLY the structured JSON object containing the extracted data. Do not include any explanations or text outside the JSON.
    
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
    ${resume_text}
    
    Respond with ONLY valid JSON without any markdown formatting or explanations.
    `;

    // Generate content using the model with increased temperature for better parsing adaptability
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Low temperature for more deterministic, factual responses
        topP: 0.95,       // High top-p for some controlled diversity in responses
        topK: 40,         // Reasonable top-k value for diverse yet focused responses
        maxOutputTokens: 8192, // Allow for long outputs to handle complex resumes
      }
    });
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from Gemini");
    
    // Parse the JSON response and clean it
    try {
      // Remove markdown code block formatting if present
      const jsonContent = text.replace(/```(json)?\n/g, '').replace(/\n```$/g, '');
      
      // Parse the cleaned JSON content
      const parsedData = JSON.parse(jsonContent);
      
      // Basic validation of the structure
      if (!parsedData.summary || !Array.isArray(parsedData.experiences) || 
          !Array.isArray(parsedData.education) || !parsedData.contact_details) {
        throw new Error("Invalid response structure from AI model");
      }
      
      console.log("Successfully parsed resume data");
      
      // Apply post-processing to normalize data and handle edge cases
      const processedData = postProcessResumeData(parsedData);
      
      return new Response(JSON.stringify({ success: true, data: processedData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response:", parseError);
      console.log("Raw response:", text);
      
      // Attempt to recover data using fallback parsing methods
      try {
        const recoveredData = attemptDataRecovery(text, resume_text);
        return new Response(JSON.stringify({ 
          success: true, 
          data: recoveredData,
          warning: "Used fallback parsing method" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (recoveryError) {
        throw new Error("Failed to parse resume data after recovery attempt");
      }
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Post-processes the parsed resume data to handle edge cases and normalize formats
 */
function postProcessResumeData(data: any): any {
  // Create a deep copy to avoid modifying the original
  const processed = JSON.parse(JSON.stringify(data));
  
  // Normalize experiences array
  if (processed.experiences && Array.isArray(processed.experiences)) {
    processed.experiences = processed.experiences.map((exp: any) => {
      // Ensure job title is never an empty string, convert to null
      if (exp.job_title === "") exp.job_title = null;
      
      // Normalize date formats when possible
      if (exp.start_date) exp.start_date = normalizeDate(exp.start_date);
      if (exp.end_date) exp.end_date = normalizeDate(exp.end_date);
      
      // Ensure skills_tools_used is always an array
      if (exp.skills_tools_used && !Array.isArray(exp.skills_tools_used)) {
        if (typeof exp.skills_tools_used === 'string') {
          exp.skills_tools_used = exp.skills_tools_used.split(/,\s*/).filter(Boolean);
        } else {
          exp.skills_tools_used = [];
        }
      }
      
      return exp;
    });
  }
  
  // Normalize education array
  if (processed.education && Array.isArray(processed.education)) {
    processed.education = processed.education.map((edu: any) => {
      // Normalize date formats when possible
      if (edu.start_date) edu.start_date = normalizeDate(edu.start_date);
      if (edu.end_date) edu.end_date = normalizeDate(edu.end_date);
      
      return edu;
    });
  }
  
  // Ensure skills is always an array of strings
  if (processed.skills) {
    if (!Array.isArray(processed.skills)) {
      if (typeof processed.skills === 'string') {
        processed.skills = processed.skills.split(/,\s*/).filter(Boolean);
      } else {
        processed.skills = [];
      }
    }
    
    // Remove duplicates and normalize casing
    const skillsMap = new Map();
    processed.skills.forEach((skill: string) => {
      const normalizedSkill = skill.trim();
      if (normalizedSkill) {
        skillsMap.set(normalizedSkill.toLowerCase(), normalizedSkill);
      }
    });
    processed.skills = Array.from(skillsMap.values());
  }
  
  return processed;
}

/**
 * Normalizes date strings to a consistent format when possible
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  
  // If it already looks standardized, return it
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(dateStr)) {
    return dateStr;
  }
  
  // If it's present/current
  if (/present|current|now|till date/i.test(dateStr)) {
    return "Present";
  }
  
  // Attempt to parse more complex date formats
  // This is a simplistic approach - a more robust solution would use a library like date-fns
  
  // For now, just return the original if we can't easily normalize it
  return dateStr;
}

/**
 * Attempts to recover data when JSON parsing fails
 */
function attemptDataRecovery(rawText: string, originalResumeText: string): any {
  // Basic fallback object
  const fallbackData = {
    summary: "Failed to extract summary from resume.",
    experiences: [],
    education: [],
    contact_details: {
      full_name: null,
      email: extractEmail(originalResumeText),
      phone: extractPhone(originalResumeText),
      linkedin: null,
      whatsapp: null
    },
    skills: []
  };
  
  // Try to extract any JSON-like structures from the text
  const jsonMatch = rawText.match(/{[\s\S]*}/);
  if (jsonMatch) {
    try {
      const extractedJson = jsonMatch[0];
      return JSON.parse(extractedJson);
    } catch (error) {
      console.error("Failed to extract JSON from matched pattern:", error);
    }
  }
  
  // Look for individual data points in the original resume
  // Extract skills
  const skillsSection = extractSection(originalResumeText, ["skills", "technical skills", "competencies"]);
  if (skillsSection) {
    // Simple extraction of bullet points or comma-separated skills
    const skillsList = skillsSection.match(/[•\-*]?\s*([A-Za-z0-9#\+\s]+)(?:,|\n|$)/g);
    if (skillsList) {
      fallbackData.skills = skillsList
        .map(s => s.replace(/[•\-*]\s*/, '').trim())
        .filter(s => s.length > 0 && s.length < 50); // Filter out likely non-skills
    }
  }
  
  // Extremely basic extraction of what might be job experiences
  const experienceSection = extractSection(originalResumeText, 
    ["experience", "employment", "work history", "professional experience"]);
  
  if (experienceSection) {
    // Look for patterns that might indicate company names
    const possibleCompanies = experienceSection.match(/[A-Z][A-Za-z0-9\s,\.]+(?:Inc\.?|LLC|Ltd\.?|Corporation|Company|Co\.)/g);
    if (possibleCompanies && possibleCompanies.length > 0) {
      fallbackData.experiences = possibleCompanies.map(company => ({
        company_name: company.trim(),
        state: null,
        country: null,
        start_date: null,
        end_date: null,
        job_title: null,
        responsibilities_text: "",
        skills_tools_used: []
      }));
    }
  }
  
  return fallbackData;
}

/**
 * Extracts an email address from text
 */
function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

/**
 * Extracts a phone number from text
 */
function extractPhone(text: string): string | null {
  // Simple regex to match common phone formats
  const phoneRegex = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

/**
 * Extracts a specific section from resume text
 */
function extractSection(text: string, sectionHeaders: string[]): string | null {
  const lines = text.split('\n');
  let inSection = false;
  let sectionContent = "";
  let sectionEndPatterns: RegExp[] = [];
  
  // Common section headers that would indicate the end of the current section
  const commonSectionHeaders = [
    "education", "experience", "skills", "projects", "certifications", 
    "awards", "publications", "languages", "interests", "references"
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    
    // Check if this line starts a section we're looking for
    if (!inSection) {
      for (const header of sectionHeaders) {
        if (line.includes(header.toLowerCase()) && line.length < 50) {
          inSection = true;
          
          // Create patterns for section endings (other major sections)
          sectionEndPatterns = commonSectionHeaders
            .filter(h => !sectionHeaders.includes(h))
            .map(h => new RegExp(`^\\s*${h}\\s*:?$`, 'i'));
            
          break;
        }
      }
    } 
    // If we're in the target section, collect content until we hit another section
    else {
      // Check if we've reached the end of this section (start of another section)
      const isSectionEnd = sectionEndPatterns.some(pattern => pattern.test(line));
      
      if (isSectionEnd) {
        break;
      }
      
      sectionContent += line + '\n';
    }
  }
  
  return inSection ? sectionContent.trim() : null;
}
