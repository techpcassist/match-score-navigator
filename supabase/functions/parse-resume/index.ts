
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

    // Construct the prompt for the parsing task
    const prompt = `
    Parse the following resume text into a structured JSON object. Extract information for the following categories and fields precisely as listed below. If information for a field is not found, represent it as null or an empty string/array.
    
    * summary (string): Generate a concise 3-5 line summary based only on the overall content of the resume, highlighting key experiences, skills, and projects mentioned.
    * experiences (array of objects): For each distinct job/role identified:
      * company_name (string)
      * state (string - geographical state/region)
      * country (string)
      * start_date (string - attempt MM/YYYY format, state if unclear)
      * end_date (string - attempt MM/YYYY format or 'Present'/'Till Date' if current, state if unclear)
      * job_title (string)
      * responsibilities_text (string - capture the full description block for this role)
      * skills_tools_used (string - list skills/tools specifically mentioned within this role's description, comma-separated)
    * education (array of objects): For each distinct educational qualification or certification identified:
      * course_certification_name (string)
      * institute_name (string)
      * university_name (string - if distinct from institute)
      * state (string - geographical state/region)
      * country (string)
      * is_certification (boolean - infer if true/false)
      * certificate_authority (string - if certification, extract authority)
      * certificate_number (string - if certification, extract number)
      * validity (string - if certification, extract validity/expiry info)
    * contact_details (object):
      * full_name (string)
      * email (string)
      * phone (string)
      * whatsapp (string - attempt extraction if distinct from phone)
      * linkedin (string - URL or ID)
    
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
