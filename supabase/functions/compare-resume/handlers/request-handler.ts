
import { compareResumeToJob } from "../analysis/ai-comparison.ts";
import { DatabaseHandler } from "../database.ts";
import { UserRole } from "../ai/types.ts";
import { createAnalysisPrompt } from "../ai/prompt-builder.ts";

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
    const { 
      resume_text, 
      job_description_text, 
      resume_file_path,
      resume_id,
      job_id,
      user_role,
      job_title,
      company_name
    } = await req.json();
    
    // Validate inputs
    if (!resume_text || !job_description_text) {
      return createErrorResponse(
        "Both resume_text and job_description_text are required", 
        400
      );
    }
    
    // Validate user_role if provided
    if (user_role && !['job_seeker', 'recruiter'].includes(user_role)) {
      return createErrorResponse(
        "user_role must be either 'job_seeker' or 'recruiter'", 
        400
      );
    }
    
    // Create Supabase client through database handler
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return createErrorResponse("Server configuration error", 500);
    }
    
    const dbHandler = new DatabaseHandler(supabaseUrl, supabaseKey);
    
    // Process the resume and job description data
    const { resumeData, jobData } = await processResumeAndJobData(
      dbHandler, 
      resume_text, 
      job_description_text, 
      resume_id, 
      job_id, 
      resume_file_path
    );
    
    // Perform the comparison using the Google Generative AI approach
    console.log("Calling compareResumeToJob with Google Generative AI integration");
    console.log("Using user role:", user_role || "not specified");
    console.log("Job title:", job_title || "not specified");
    console.log("Company name:", company_name || "not specified");
    
    const comparisonResult = await compareResumeToJob(resume_text, job_description_text, user_role as UserRole, job_title, company_name);
    
    try {
      // Store the comparison result - handle potential duplicate key errors
      const comparisonData = await dbHandler.storeComparison(
        resumeData.id,
        jobData.id,
        comparisonResult.match_score,
        comparisonResult.analysis
      );
      
      // Return the comparison result along with the stored IDs
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
      
      // If it's a duplicate key error, we can still return the analysis
      // without creating a new comparison record
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
  } catch (error) {
    console.error("Error in compare-resume function:", error);
    return createErrorResponse(error.message, 500);
  }
}

/**
 * Process resume and job description data
 */
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
    // Check if provided resume_id exists and use it
    if (resumeId) {
      resumeData = await dbHandler.getResumeById(resumeId);
      console.log("Using existing resume ID:", resumeId);
    }
    
    // If resume_id was not provided or not found, check if same text exists
    if (!resumeData) {
      resumeData = await dbHandler.findResumeByText(resumeText);
      if (resumeData) {
        console.log("Found resume with matching text");
      }
    }
    
    // If still no match, store as new resume
    if (!resumeData) {
      resumeData = await dbHandler.storeResume(resumeText, resumeFilePath || null);
      console.log("Created new resume with ID:", resumeData.id);
    }
    
    // Same process for job description
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

/**
 * Create a standardized error response
 */
function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status
    }
  );
}

/**
 * Create a standardized success response
 */
function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    }
  );
}
