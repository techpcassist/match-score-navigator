
import { compareResumeToJob } from "../analysis/ai-comparison.ts";
import { DatabaseHandler } from "../database.ts";
import { validateComparisonInput } from "./validation.ts";
import type { ComparisonRequest, ComparisonResponse } from "./types.ts";
import { UserRole } from "../ai/types.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

function initializeDatabaseHandler(): DatabaseHandler | null {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase configuration");
    return null;
  }
  
  return new DatabaseHandler(supabaseUrl, supabaseKey);
}

function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status
    }
  );
}

function createSuccessResponse(data: ComparisonResponse): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    }
  );
}

async function processResumeAndJobData(
  dbHandler: DatabaseHandler,
  resumeText: string,
  jobDescriptionText: string,
  resumeId?: string,
  jobId?: string,
  resumeFilePath?: string
) {
  let resumeData;
  let jobData;
  
  try {
    // Handle resume data
    if (resumeId) {
      resumeData = await dbHandler.getResumeById(resumeId);
      console.log("Using existing resume ID:", resumeId);
    }
    
    if (!resumeData) {
      resumeData = await dbHandler.findResumeByText(resumeText);
      if (resumeData) {
        console.log("Found resume with matching text");
      }
    }
    
    if (!resumeData) {
      resumeData = await dbHandler.storeResume(resumeText, resumeFilePath || null);
      console.log("Created new resume with ID:", resumeData.id);
    }
    
    // Handle job description data
    if (jobId) {
      jobData = await dbHandler.getJobById(jobId);
      console.log("Using existing job ID:", jobId);
    }
    
    if (!jobData) {
      jobData = await dbHandler.findJobByText(jobDescriptionText);
      if (jobData) {
        console.log("Found job description with matching text");
      }
    }
    
    if (!jobData) {
      jobData = await dbHandler.storeJobDescription(jobDescriptionText);
      console.log("Created new job description with ID:", jobData.id);
    }
    
    return { resumeData, jobData };
  } catch (dbError) {
    console.error("Database operation error:", dbError);
    throw new Error("Failed to process resume and job data: " + dbError.message);
  }
}
