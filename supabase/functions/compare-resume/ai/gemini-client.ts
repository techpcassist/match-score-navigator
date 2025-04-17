
import { VertexAI } from "npm:@google-cloud/vertexai";
import { UserRole } from "./types.ts";
import { createAnalysisPrompt } from "./prompt-builder.ts";

interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
}

/**
 * Call Google Generative AI to analyze resume against job description
 */
export async function callGenerativeAI(
  resumeText: string, 
  jobDescriptionText: string, 
  userRole?: UserRole,
  jobTitle?: string,
  companyName?: string
): Promise<AIResponse> {
  try {
    // Get API key from environment variables
    const apiKey = Deno.env.get("GOOGLE_GENERATIVE_AI_KEY");
    
    if (!apiKey) {
      throw new Error("Google Generative AI API key is not configured");
    }
    
    console.log("Creating AI prompt for analysis...");
    const prompt = createAnalysisPrompt(resumeText, jobDescriptionText, userRole, jobTitle, companyName);
    
    // Make API call with better error handling
    console.log("Calling Google Generative AI using Gemini 1.5...");
    
    try {
      // Try the primary model (Gemini 1.5 Flash)
      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        }),
      });
      
      // Check for HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Primary model failed with status: ${response.status}. Error: ${errorText}`);
        throw new Error("Primary model failed");
      }
      
      // Parse the response
      const result = await response.json();
      const textContent = result.candidates[0].content.parts[0].text;
      
      try {
        // Parse the JSON content from the text
        const jsonContent = JSON.parse(textContent);
        return {
          success: true,
          data: jsonContent,
        };
      } catch (jsonError) {
        console.error("Failed to parse JSON from primary model response:", jsonError);
        console.log("Raw response text:", textContent);
        throw new Error("Failed to parse results from primary model");
      }
    } catch (primaryError) {
      console.log("Primary model failed, trying fallback model...");
      
      // Fall back to Gemini Pro
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 8192,
            },
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Fallback model failed with status: ${response.status}. Error: ${errorText}`);
          throw new Error("Fallback model failed");
        }
        
        const result = await response.json();
        const textContent = result.candidates[0].content.parts[0].text;
        
        try {
          const jsonContent = JSON.parse(textContent);
          return {
            success: true,
            data: jsonContent,
          };
        } catch (jsonError) {
          console.error("Failed to parse JSON from fallback model response:", jsonError);
          console.log("Raw response text:", textContent);
          throw new Error("Failed to parse results from fallback model");
        }
      } catch (fallbackError) {
        console.error("All models failed:", fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error("Google Generative AI error:", error);
    
    // Return error response
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
