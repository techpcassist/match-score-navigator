
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
    
    // Configure the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
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

    // Construct the prompt for the parsing task using the detailed instructions
    const prompt = `
    Parse the following resume text STRICTLY based on its content into a structured JSON object. Do NOT invent information or assume details not present. Your primary task is accurate extraction.

    1. Identify Sections: Locate standard resume sections like 'Contact Information', 'Summary'/'Objective', 'Skills', 'Work Experience'/'Employment History'/'Professional Experience', 'Education', 'Certifications', 'Projects'.
    
    2. Parse Contact Details: Extract full_name, email, phone, whatsapp? (if distinct), linkedin? (URL/ID) into a contact_details object.
    
    3. Generate Summary: Create a summary (string): Generate a concise 3-5 line summary based ONLY on the actual content and key terms found throughout the resume.
    
    4. Parse Skills: Extract skills listed in a dedicated 'Skills' section into a skills array (array of strings).
    
    5. Parse Work Experience (CRITICAL DETAIL):
       - Segment Entries: Carefully identify distinct job entries within the 'Work Experience' section. Entries might be separated by multiple line breaks, horizontal rules, or patterns like COMPANY, CITY, STATE START_DATE to END_DATE. Pay attention to both vertical and horizontal layouts.
       - Extract for EACH Entry:
         - Extract company_name (string).
         - Extract location: state (string), country (string).
         - Extract start_date and end_date (strings). Attempt to standardize to MM/YYYY or Month YYYY. Identify 'Present'/'Till Date' for current job.
         - Locate job_title (string): Search for the job title associated with this company/date block. It is typically located directly above the company name, immediately following the date range on the same line, or as the first line of the descriptive text for that role. If no specific job title is clearly associated with this entry in the text, return null for this field.
         - Extract responsibilities_text (string): Capture the complete block of text (paragraphs or bullet points) describing roles and responsibilities specifically associated with this company/title/date entry.
         - Extract skills_tools_used (string or array): Identify and list skills or tools mentioned explicitly within the responsibilities_text for this specific job. If none are mentioned in this block, return null or an empty array.
       - Output Structure: Collate these into an array of objects under the experiences key. Ensure the order reflects the resume's chronology (usually reverse-chronological).
    
    6. Parse Education & Certifications:
       - Segment into distinct entries.
       - For each entry, extract course_certification_name, institute_name, university_name?, state, country, and attempt to infer is_certification (boolean).
       - If is_certification is true, attempt to extract certificate_authority?, certificate_number?, validity?. Return null for fields not found.
       - Collate into an education array.
    
    7. Handle Missing Information: If any field within an entry cannot be reliably found in the text associated with that specific entry, return null for that specific field. Do not guess, infer widely, or pull information from unrelated parts of the resume. Your output must strictly reflect the input text structure and content.
    
    8. Output Format: Return ONLY the structured JSON object containing the extracted data (summary, experiences, education, contact_details, skills). Do not include any explanations, apologies, or introductory text before or after the JSON.

    Example output format:
    {
      "summary": "...",
      "experiences": [
        {
          "company_name": "COMPANY A",
          "state": "CA",
          "country": "USA",
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
          "is_certification": false
        }
      ],
      "contact_details": {
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "whatsapp": null,
        "linkedin": "linkedin.com/in/johndoe"
      },
      "skills": ["JavaScript", "React", "Node.js"]
    }
    
    RESUME TEXT:
    ${resume_text}
    
    Respond with ONLY valid JSON without any markdown formatting or explanations.
    `;

    // Generate content using the model
    const result = await model.generateContent(prompt);
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
      
      return new Response(JSON.stringify({ success: true, data: parsedData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Failed to parse JSON from AI response:", parseError);
      console.log("Raw response:", text);
      throw new Error("Invalid response format from AI model");
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
