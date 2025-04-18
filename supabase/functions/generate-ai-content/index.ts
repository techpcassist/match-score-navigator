
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_GENERATIVE_AI_KEY");

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
    const { prompt } = await req.json();
    
    if (!prompt) {
      throw new Error("Missing required parameter: prompt");
    }
    
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_GENERATIVE_AI_KEY is not configured");
    }
    
    console.log("Generating AI content with prompt:", prompt.substring(0, 50) + "...");
    
    // Set a timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      // Try Gemini 1.5 Flash first (faster model)
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
            topP: 0.8,
            topK: 40,
          },
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Primary model failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from primary model");
      }
      
      const generatedText = result.candidates[0].content.parts[0].text;
      
      return new Response(
        JSON.stringify({ generatedText, source: "gemini-1.5-flash" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (primaryError) {
      console.error("Primary model failed, trying fallback:", primaryError);
      
      // Create a new timeout for the fallback request
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 15000);
      
      // Try Gemini Pro as fallback
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GOOGLE_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
              topP: 0.8,
              topK: 40,
            },
          }),
          signal: fallbackController.signal,
        });
        
        clearTimeout(fallbackTimeoutId);
        
        if (!response.ok) {
          throw new Error(`Fallback model failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("Invalid response structure from fallback model");
        }
        
        const generatedText = result.candidates[0].content.parts[0].text;
        
        return new Response(
          JSON.stringify({ generatedText, source: "gemini-pro" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (fallbackError) {
        clearTimeout(fallbackTimeoutId);
        console.error("All models failed:", fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error("Error generating AI content:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate AI content", 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
