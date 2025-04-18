
import { compareResumeToJob } from "../analysis/ai-comparison.ts";
import { validateComparisonInput } from "./validation.ts";
import type { ComparisonRequest } from "./types.ts";
import { UserRole } from "../ai/types.ts";
import { createErrorResponse, createSuccessResponse } from "./response-handler.ts";
import { initializeDatabaseHandler, processResumeAndJobData } from "./db-operations.ts";

/**
 * Main request handler for the compare-resume function
 */
export async function handleCompareResumeRequest(req: Request) {
  try {
    // Parse the request body
    let reqBody: ComparisonRequest;
    try {
      reqBody = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return createErrorResponse("Invalid request format: " + parseError.message, 400);
    }
    
    const { 
      resume_text, 
      job_description_text, 
      resume_file_path,
      resume_id,
      job_id,
      user_role,
      job_title,
      company_name
    } = reqBody;
    
    // Validate inputs
    const validation = validateComparisonInput(resume_text, job_description_text, user_role);
    if (!validation.valid) {
      return createErrorResponse(validation.error || "Invalid input", 400);
    }
    
    // Initialize database handler
    const dbHandler = initializeDatabaseHandler();
    if (!dbHandler) {
      return createErrorResponse("Server configuration error", 500);
    }
    
    try {
      // Process resume and job data
      const { resumeData, jobData } = await processResumeAndJobData(
        dbHandler, 
        resume_text, 
        job_description_text, 
        resume_id, 
        job_id, 
        resume_file_path
      );
      
      // Perform comparison analysis
      console.log("Calling compareResumeToJob with Google Generative AI integration");
      console.log("Using user role:", user_role || "not specified");
      console.log("Job title:", job_title || "not specified");
      console.log("Company name:", company_name || "not specified");
      
      const comparisonResult = await compareResumeToJob(
        resume_text, 
        job_description_text, 
        user_role as UserRole,
        job_title,
        company_name
      );
      
      try {
        // Store comparison result
        const comparisonData = await dbHandler.storeComparison(
          resumeData.id,
          jobData.id,
          comparisonResult.match_score,
          comparisonResult.analysis
        );
        
        return createSuccessResponse({
          resume_id: resumeData.id,
          job_description_id: jobData.id,
          comparison_id: comparisonData.id,
          match_score: comparisonResult.match_score,
          report: comparisonResult.analysis,
          resume_file_path,
          user_role: user_role || null,
          job_title: job_title || null,
          company_name: company_name || null
        });
      } catch (dbError) {
        console.error("Database error in compare-resume function:", dbError);
        return createSuccessResponse({
          resume_id: resumeData.id,
          job_description_id: jobData.id,
          match_score: comparisonResult.match_score,
          report: comparisonResult.analysis,
          resume_file_path,
          user_role: user_role || null,
          job_title: job_title || null,
          company_name: company_name || null,
          warning: "Existing comparison was retrieved"
        });
      }
    } catch (dbConnError) {
      console.error("Database connection error:", dbConnError);
      return createErrorResponse("Database connection error: " + dbConnError.message, 500);
    }
  } catch (error) {
    console.error("Error in compare-resume function:", error);
    return createErrorResponse(error.message, 500);
  }
}
