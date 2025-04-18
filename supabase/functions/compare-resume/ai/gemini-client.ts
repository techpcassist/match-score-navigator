
import { UserRole } from "./types.ts";
import { createAnalysisPrompt } from "./prompt-builder.ts";

interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
}

/**
 * Call Google Generative AI to analyze resume against job description
 * with improved error handling and fallbacks
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
      console.error("Google Generative AI API key is not configured");
      throw new Error("Google Generative AI API key is not configured");
    }
    
    console.log("Creating AI prompt for analysis...");
    const prompt = createAnalysisPrompt(resumeText, jobDescriptionText, userRole, jobTitle, companyName);
    
    // Make API call with better error handling
    console.log("Calling Google Generative AI using Gemini 1.5...");
    console.log("API Key exists and length:", apiKey ? apiKey.length : "not found");
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 28000); // 28 second timeout
    
    try {
      // Try the primary model (Gemini 1.5 Flash)
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
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
        signal: controller.signal,
      });
      
      // Clear timeout if the request completes
      clearTimeout(timeoutId);
      
      // Check for HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Primary model failed with status: ${response.status}. Error: ${errorText}`);
        throw new Error(`Primary model failed: ${response.status} - ${errorText}`);
      }
      
      // Parse the response
      const result = await response.json();
      
      // Validate response structure
      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
        console.error("Invalid response structure from primary model:", JSON.stringify(result));
        throw new Error("Invalid response structure from primary model");
      }
      
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
      // Clear timeout if it's still active
      clearTimeout(timeoutId);
      console.log("Primary model failed, trying fallback model...", primaryError);
      
      // Create a new controller for the fallback request
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 28000); // 28 second timeout
      
      // Fall back to Gemini Pro
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
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
          signal: fallbackController.signal,
        });
        
        // Clear timeout if the request completes
        clearTimeout(fallbackTimeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Fallback model failed with status: ${response.status}. Error: ${errorText}`);
          throw new Error(`Fallback model failed: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        
        // Validate response structure
        if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
          console.error("Invalid response structure from fallback model:", JSON.stringify(result));
          throw new Error("Invalid response structure from fallback model");
        }
        
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
        // Clear timeout if it's still active
        clearTimeout(fallbackTimeoutId);
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
