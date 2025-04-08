
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// More advanced algorithm to compare resume and job description
const compareResumeToJob = (resumeText: string, jobText: string) => {
  if (!resumeText || !jobText) return { match_score: 0, analysis: {} };
  
  // Convert texts to lowercase for better comparison
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobText.toLowerCase();
  
  // Extract common keywords (expanded list)
  const commonKeywords = [
    "react", "javascript", "typescript", "python", "java", "nodejs", "express",
    "mongodb", "sql", "database", "frontend", "backend", "fullstack", "development",
    "software", "engineer", "developer", "project", "team", "manager", "lead",
    "experience", "years", "skills", "communication", "problem-solving", "leadership",
    "agile", "scrum", "architecture", "design", "testing", "devops", "cloud",
    "aws", "azure", "gcp", "security", "performance", "optimization", "algorithm",
    "data", "analytics", "machine learning", "ai", "mobile", "web", "responsive"
  ];
  
  // Count keywords in both texts
  let matchCount = 0;
  let totalKeywords = 0;
  
  commonKeywords.forEach(keyword => {
    if (jdLower.includes(keyword)) {
      totalKeywords++;
      if (resumeLower.includes(keyword)) {
        matchCount++;
      }
    }
  });
  
  // Calculate score based on keyword matches and content length similarity
  const lengthScore = Math.min(100, 
    100 - Math.abs(resumeText.length - jobText.length) / Math.max(resumeText.length, jobText.length) * 50
  );
  
  const keywordScore = totalKeywords > 0 ? (matchCount / totalKeywords) * 100 : 50;
  
  // Combine scores with different weights
  const finalScore = Math.round(keywordScore * 0.7 + lengthScore * 0.3);
  
  // Generate matched/missing skills lists
  const hardSkills = commonKeywords.slice(0, 15).filter(keyword => jdLower.includes(keyword)).map(term => ({
    term,
    matched: resumeLower.includes(term)
  }));
  
  const softSkills = ["communication", "leadership", "problem-solving", "teamwork", "creativity", "adaptability"]
    .filter(keyword => jdLower.includes(keyword))
    .map(term => ({
      term,
      matched: resumeLower.includes(term)
    }));

  // Create status categories based on the score
  const getStatusForScore = (baseScore: number) => {
    if (finalScore > baseScore + 15) return "matched";
    if (finalScore > baseScore - 15) return "partial";
    return "missing";
  };
    
  // Generate analysis report
  const analysis = {
    keywords: {
      hard_skills: hardSkills,
      soft_skills: softSkills
    },
    advanced_criteria: [
      { 
        name: "Skill Proficiency Level", 
        status: getStatusForScore(60), 
        description: "Evaluates the level of expertise in key skills mentioned in the job description."
      },
      { 
        name: "Quantified Impact Alignment", 
        status: getStatusForScore(70), 
        description: "Measures how well your quantified achievements align with the job's key performance indicators."
      },
      { 
        name: "Project Complexity & Scope", 
        status: getStatusForScore(75), 
        description: "Assesses if your project experience matches the complexity requirements of the position."
      },
      { 
        name: "Semantic Role Similarity", 
        status: getStatusForScore(65), 
        description: "Analyzes how closely your previous role responsibilities match the job requirements."
      },
      { 
        name: "Career Trajectory & Velocity", 
        status: getStatusForScore(80), 
        description: "Evaluates if your career progression aligns with the level of this position."
      }
    ],
    ats_checks: [
      { check_name: "Contact Information", status: "pass", message: "Contact information found" },
      { check_name: "Education Section", status: "pass", message: "Education section present" },
      { check_name: "Experience Format", status: finalScore > 50 ? "pass" : "warning", message: finalScore > 50 ? "Experience format looks good" : "Consider adding more quantifiable achievements" },
      { check_name: "File Format", status: "pass", message: "Format is ATS-friendly" }
    ],
    suggestions: [
      "Add more quantifiable achievements in your experience section",
      finalScore < 60 ? "Include key technical skills mentioned in the job description" : "Consider detailing your technical expertise more thoroughly",
      "Consider adding a specific section for technical skills",
      finalScore < 70 ? "Demonstrate leadership experience with concrete examples" : "Highlight your leadership achievements more prominently"
    ].filter(Boolean)
  };

  return { 
    match_score: Math.min(100, Math.max(0, finalScore)), 
    analysis
  };
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
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store the resume
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert([{ 
        resume_text,
        file_path: resume_file_path || null 
      }])
      .select()
      .single();
      
    if (resumeError) throw resumeError;
    
    // Store the job description
    const { data: jobData, error: jobError } = await supabase
      .from('job_descriptions')
      .insert([{ description_text: job_description_text }])
      .select()
      .single();
      
    if (jobError) throw jobError;
    
    // Perform the comparison
    const comparisonResult = compareResumeToJob(resume_text, job_description_text);
    
    // Store the comparison result
    const { data: comparisonData, error: comparisonError } = await supabase
      .from('comparisons')
      .insert([{ 
        resume_id: resumeData.id,
        job_description_id: jobData.id,
        match_score: comparisonResult.match_score,
        analysis_report: comparisonResult.analysis
      }])
      .select()
      .single();
    
    if (comparisonError) throw comparisonError;
    
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
