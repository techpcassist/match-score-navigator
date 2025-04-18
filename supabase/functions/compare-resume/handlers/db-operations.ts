
import { DatabaseHandler } from "../database.ts";

export function initializeDatabaseHandler(): DatabaseHandler | null {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase configuration");
    return null;
  }
  
  return new DatabaseHandler(supabaseUrl, supabaseKey);
}

export async function processResumeAndJobData(
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
