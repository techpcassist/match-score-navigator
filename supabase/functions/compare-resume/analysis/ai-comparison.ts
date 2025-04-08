
import { callGenerativeAI } from "../ai/gemini-client.ts";
import { performBasicComparison } from "./basic-comparison.ts";

/**
 * Interface for the result of the resume comparison
 */
export interface ComparisonResult {
  match_score: number;
  analysis: any;
}

/**
 * Main function to compare resume to job description using AI
 * Falls back to basic comparison if AI analysis fails
 */
export const compareResumeToJob = async (resumeText: string, jobDescriptionText: string): Promise<ComparisonResult> => {
  if (!resumeText || !jobDescriptionText) {
    return { match_score: 0, analysis: {} };
  }

  try {
    // Attempt to use Google's Generative AI for enhanced analysis
    console.log("Attempting to use Google Generative AI for resume analysis...");
    
    // Make an asynchronous call to the AI API
    const aiResponse = await callGenerativeAI(resumeText, jobDescriptionText);
    
    // Check if AI call was successful
    if (aiResponse.success) {
      console.log("Successfully got analysis from Google Generative AI");
      
      // The aiResponse.data should already contain our entire analysis structure
      return { 
        match_score: aiResponse.data.match_score, 
        analysis: aiResponse.data
      };
    } else {
      console.log("Google Generative AI call failed, falling back to basic analysis");
      throw new Error("AI API call failed: " + aiResponse.error);
    }
  } catch (error) {
    // Fall back to a basic keyword matching approach
    console.error("Error with Google Generative AI, using fallback analysis:", error);
    return performBasicComparison(resumeText, jobDescriptionText);
  }
};
