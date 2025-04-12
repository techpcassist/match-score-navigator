
// Import using Deno-compatible syntax for npm packages
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "npm:@google/generative-ai";
import { AIAnalysisResponse, UserRole } from "./types.ts";
import { createAnalysisPrompt } from "./prompt-builder.ts";

/**
 * Makes an API call to Google Generative AI for enhanced resume analysis
 */
export const callGenerativeAI = async (
  resumeText: string, 
  jobText: string,
  userRole?: UserRole
): Promise<AIAnalysisResponse> => {
  try {
    console.log("Making API call to Google Generative AI...");
    console.log("User role:", userRole || "not specified");
    
    // Get API key from environment variable
    const apiKey = Deno.env.get("GOOGLE_GENERATIVE_AI_KEY");
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_KEY environment variable");
    }
    
    // Initialize the Google Generative AI client
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
    
    // Create the prompt for the analysis with role-specific instructions
    const prompt = createAnalysisPrompt(resumeText, jobText, userRole);
    
    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response - now with support for markdown-formatted JSON
    try {
      console.log("Raw response from Google Generative AI:", text);
      
      // Remove markdown code block formatting if present
      const jsonContent = text.replace(/```(json)?\n/g, '').replace(/\n```$/g, '');
      
      // The response should now be a valid JSON string
      const parsedData = JSON.parse(jsonContent);
      console.log("Successfully received and parsed response from Google Generative AI");
      
      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      console.error("Failed to parse JSON from Google Generative AI response:", parseError);
      console.log("Raw response:", text);
      throw new Error("Invalid response format from Generative AI");
    }
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    return { success: false, error: error.message };
  }
};
