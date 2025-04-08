
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
    const { resume_text, job_description_text, resume_file_path } = await req.json();
    
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

    // Store data in database
    const resumeData = await dbHandler.storeResume(resume_text, resume_file_path);
    const jobData = await dbHandler.storeJobDescription(job_description_text);
    
    // Perform the comparison
    const comparisonResult = compareResumeToJob(resume_text, job_description_text);
    
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
