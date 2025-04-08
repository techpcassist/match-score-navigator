
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { compareResumeToJob } from "./comparison.ts";
import { DatabaseHandler } from "./database.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { 
      resume_text, 
      job_description_text, 
      resume_file_path,
      resume_id,
      job_id
    } = await req.json();
    
    // Validate inputs
    if (!resume_text || !job_description_text) {
      return new Response(
        JSON.stringify({ 
          error: "Both resume_text and job_description_text are required" 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Create Supabase client through database handler
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const dbHandler = new DatabaseHandler(supabaseUrl, supabaseKey);
    
    let resumeData;
    let jobData;
    
    // Check if provided resume_id exists and use it
    if (resume_id) {
      resumeData = await dbHandler.getResumeById(resume_id);
      console.log("Using existing resume ID:", resume_id);
    }
    
    // If resume_id was not provided or not found, check if same text exists
    if (!resumeData) {
      resumeData = await dbHandler.findResumeByText(resume_text);
      if (resumeData) {
        console.log("Found resume with matching text");
      }
    }
    
    // If still no match, store as new resume
    if (!resumeData) {
      resumeData = await dbHandler.storeResume(resume_text, resume_file_path);
      console.log("Created new resume with ID:", resumeData.id);
    }
    
    // Same process for job description
    if (job_id) {
      jobData = await dbHandler.getJobById(job_id);
      console.log("Using existing job ID:", job_id);
    }
    
    if (!jobData) {
      jobData = await dbHandler.findJobByText(job_description_text);
      if (jobData) {
        console.log("Found job description with matching text");
      }
    }
    
    if (!jobData) {
      jobData = await dbHandler.storeJobDescription(job_description_text);
      console.log("Created new job description with ID:", jobData.id);
    }
    
    // Perform the comparison using the Google Generative AI approach
    console.log("Calling compareResumeToJob with Google Generative AI integration");
    const comparisonResult = await compareResumeToJob(resume_text, job_description_text);
    
    // Store the comparison result
    const comparisonData = await dbHandler.storeComparison(
      resumeData.id,
      jobData.id,
      comparisonResult.match_score,
      comparisonResult.analysis
    );
    
    // Return the comparison result along with the stored IDs
    return new Response(
      JSON.stringify({
        resume_id: resumeData.id,
        job_description_id: jobData.id,
        comparison_id: comparisonData.id,
        match_score: comparisonResult.match_score,
        report: comparisonResult.analysis,
        resume_file_path
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in compare-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
