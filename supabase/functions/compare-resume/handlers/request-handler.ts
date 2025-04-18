
import { validateComparisonInput } from "./validation.ts";
import type { ComparisonRequest } from "./types.ts";
import { createErrorResponse, createSuccessResponse } from "./response-handler.ts";
import { initializeDatabaseHandler } from "./db-operations.ts";
import { ComparisonService } from "../services/comparison-service.ts";

/**
 * Main request handler for the compare-resume function
 * with improved error handling and timeouts
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
    
    // Wrap the entire operation in a timeout
    try {
      // Create a promise with timeout for the whole operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 50 seconds")), 50000);
      });
      
      // Create comparison service
      const comparisonService = new ComparisonService(dbHandler);
      
      // Execute the comparison with timeout
      const resultPromise = comparisonService.performComparison({
        resumeText: resume_text,
        jobDescriptionText: job_description_text,
        resumeFilePath: resume_file_path,
        resumeId: resume_id,
        jobId: job_id,
        userRole: user_role,
        jobTitle: job_title,
        companyName: company_name
      });
      
      // Race the comparison with the timeout
      const result = await Promise.race([resultPromise, timeoutPromise]);
      
      return createSuccessResponse(result);
    } catch (error) {
      console.error("Error in compare-resume function:", error);
      const isTimeout = error.message && error.message.includes("timed out");
      
      // Special handling for timeouts
      if (isTimeout) {
        return createErrorResponse(
          "Request timed out. The analysis is taking longer than expected. Please try again with a shorter resume and job description.",
          504 // Gateway Timeout
        );
      }
      
      return createErrorResponse(error.message || "Unknown error", 500);
    }
  } catch (error) {
    console.error("Unhandled error in compare-resume function:", error);
    return createErrorResponse(error.message || "Server error", 500);
  }
}
