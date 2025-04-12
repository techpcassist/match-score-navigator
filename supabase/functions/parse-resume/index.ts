
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  initializeGeminiClient, 
  buildResumeParsingPrompt, 
  generateResumeAnalysis 
} from "./gemini-client.ts";
import { validateParsedData } from "./validation.ts";
import { postProcessResumeData } from "./data-processor.ts";
import { attemptDataRecovery } from "./text-utils.ts";

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

    // Initialize the Gemini model
    const model = initializeGeminiClient(apiKey);
    
    // Build the prompt
    const prompt = buildResumeParsingPrompt(resume_text);
    
    // Generate analysis
    const text = await generateResumeAnalysis(model, prompt);
    
    console.log("Received response from Gemini");
    
    // Parse the JSON response and clean it
    try {
      // Remove markdown code block formatting if present
      const jsonContent = text.replace(/```(json)?\n/g, '').replace(/\n```$/g, '');
      
      // Parse the cleaned JSON content
      const parsedData = JSON.parse(jsonContent);
      
      // Enhanced validation to catch potential hallucinations
      const validatedData = validateParsedData(parsedData, resume_text);
      
      console.log("Successfully parsed and validated resume data");
      
      // Apply post-processing to normalize data and handle edge cases
      const processedData = postProcessResumeData(validatedData);
      
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
