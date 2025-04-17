
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
    
    // Make API call - using the correct model endpoint
    console.log("Calling Google Generative AI using Gemini Pro...");
    
    // First try the newer endpoint
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
      });
      
      // Check for HTTP errors
      if (!response.ok) {
        console.log(`Beta endpoint failed with status: ${response.status}. Falling back to v1 endpoint.`);
        throw new Error("Beta endpoint failed");
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
        console.error("Failed to parse JSON from beta API response:", jsonError);
        throw new Error("Failed to parse results from beta endpoint");
      }
    } catch (betaError) {
      console.log("Trying v1 endpoint as fallback...");
      
      // Fall back to the v1 endpoint
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
      
      // Check for HTTP errors with detailed logging
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google AI API error:", errorText);
        throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the response
      const result = await response.json();
      
      // Extract the text content from the response - handle different response formats
      let textContent;
      try {
        textContent = result.candidates[0].content.parts[0].text;
      } catch (formatError) {
        console.error("Unexpected response format:", JSON.stringify(result));
        throw new Error("Unexpected API response format");
      }
      
      try {
        // Parse the JSON content from the text
        const jsonContent = JSON.parse(textContent);
        
        // Return success response with parsed data
        return {
          success: true,
          data: jsonContent,
        };
      } catch (jsonError) {
        console.error("Failed to parse JSON from API response:", jsonError);
        console.log("Raw response text:", textContent);
        throw new Error("Failed to parse analysis results");
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
