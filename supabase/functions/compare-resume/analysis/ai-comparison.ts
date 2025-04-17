
import { callGenerativeAI } from "../ai/gemini-client.ts";
import { performBasicComparison } from "./basic-comparison.ts";
import { UserRole } from "../ai/types.ts";

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
export const compareResumeToJob = async (
  resumeText: string, 
  jobDescriptionText: string,
  userRole?: UserRole,
  jobTitle?: string,
  companyName?: string
): Promise<ComparisonResult> => {
  if (!resumeText || !jobDescriptionText) {
    return { match_score: 0, analysis: {} };
  }

  try {
    // Attempt to use Google's Generative AI for enhanced analysis
    console.log("Attempting to use Google Generative AI for resume analysis...");
    console.log("User role for analysis:", userRole || "not specified");
    console.log("Job title for analysis:", jobTitle || "not specified");
    console.log("Company name for analysis:", companyName || "not specified");
    
    // Make an asynchronous call to the AI API with the user role, job title, and company name
    const aiResponse = await callGenerativeAI(resumeText, jobDescriptionText, userRole, jobTitle, companyName);
    
    // Check if AI call was successful
    if (aiResponse.success) {
      console.log("Successfully got analysis from Google Generative AI");
      
      // Extract work experience and education from AI-parsed data
      const parsedWorkExperience = aiResponse.data.parsed_data?.work_experience || [];
      const parsedEducation = aiResponse.data.parsed_data?.education || [];
      
      // Add IDs to entries if they don't have them
      const workExperienceWithIds = parsedWorkExperience.map((entry: any, index: number) => ({
        ...entry,
        id: entry.id || `job-${index}`,
        teamSize: 0,
        teamName: '',
        projectName: ''
      }));
      
      const educationWithIds = parsedEducation.map((entry: any, index: number) => ({
        ...entry,
        id: entry.id || `edu-${index}`,
        customUniversity: false
      }));
      
      console.log(`AI parsed ${workExperienceWithIds.length} work experience entries and ${educationWithIds.length} education entries`);
      
      // Make sure job title analysis is properly included
      let jobTitleAnalysis = aiResponse.data.job_title_analysis || {};
      
      // If we have job title and company name from the request, use them
      if (jobTitle || companyName) {
        jobTitleAnalysis = {
          ...jobTitleAnalysis,
          job_title: jobTitle || jobTitleAnalysis.job_title || "Unknown Position",
          company_name: companyName || jobTitleAnalysis.company_name || "Unknown Company"
        };
      }
      
      // Add the parsed data to the analysis result
      const enhancedData = {
        ...aiResponse.data,
        job_title_analysis: jobTitleAnalysis,
        parsed_data: {
          work_experience: workExperienceWithIds,
          education: educationWithIds
        }
      };
      
      return { 
        match_score: aiResponse.data.match_score, 
        analysis: enhancedData
      };
    } else {
      console.log("Google Generative AI call failed, falling back to basic analysis");
      console.error("Error details:", aiResponse.error);
      throw new Error("AI API call failed: " + aiResponse.error);
    }
  } catch (error) {
    // Fall back to a basic keyword matching approach
    console.error("Error with Google Generative AI, using fallback analysis:", error);
    const basicResult = performBasicComparison(resumeText, jobDescriptionText, jobTitle, companyName);
    
    return basicResult;
  }
};
