
import { extractBasicKeywords } from "../utils/text-utils.ts";

/**
 * Interface for basic analysis results
 */
export interface BasicAnalysisResult {
  match_score: number;
  analysis: {
    keywords: {
      hard_skills: Array<{term: string, matched: boolean}>;
      soft_skills: Array<{term: string, matched: boolean}>;
    };
    ats_checks: Array<{
      check_name: string;
      status: string;
      message: string;
    }>;
    suggestions: string[];
    job_title_analysis?: {
      job_title: string;
      company_name: string;
    };
  };
}

/**
 * Performs a simple keyword-based comparison when AI analysis fails
 */
export const performBasicComparison = (resumeText: string, jobDescriptionText: string, jobTitle?: string, companyName?: string): BasicAnalysisResult => {
  console.log("Using fallback basic analysis method");
  
  // Extract keywords from both texts
  const jobKeywords = extractBasicKeywords(jobDescriptionText);
  const resumeKeywords = extractBasicKeywords(resumeText);
  
  // Calculate simple matching score
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword)
  );
  
  const matchScore = Math.round((matchedKeywords.length / (jobKeywords.length || 1)) * 100);
  
  // Create a minimal analysis structure
  const basicAnalysis = {
    keywords: {
      hard_skills: jobKeywords.slice(0, 10).map(term => ({
        term,
        matched: resumeText.toLowerCase().includes(term)
      })),
      soft_skills: []
    },
    ats_checks: [
      { 
        check_name: "Basic Keywords", 
        status: matchScore > 60 ? "pass" : "warning", 
        message: `Resume contains ${matchScore}% of job keywords` 
      },
      {
        check_name: "AI Analysis",
        status: "warning",
        message: "Advanced AI analysis unavailable - using simplified comparison"
      }
    ],
    suggestions: [
      "This is a basic fallback analysis as the AI service could not be reached.",
      "Try adding more keywords from the job description to your resume.",
      "Consider trying again later when AI services are available for more detailed analysis."
    ],
    job_title_analysis: {
      job_title: jobTitle || "Unknown Position",
      company_name: companyName || "Unknown Company"
    }
  };

  return { 
    match_score: matchScore, 
    analysis: basicAnalysis
  };
};
