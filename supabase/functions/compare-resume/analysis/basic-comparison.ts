
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
  };
}

/**
 * Performs a simple keyword-based comparison when AI analysis fails
 */
export const performBasicComparison = (resumeText: string, jobDescriptionText: string): BasicAnalysisResult => {
  console.log("Using fallback basic analysis method");
  
  // Extract keywords from both texts
  const jobKeywords = extractBasicKeywords(jobDescriptionText);
  const resumeKeywords = extractBasicKeywords(resumeText);
  
  // Calculate simple matching score
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword)
  );
  
  const matchScore = Math.round((matchedKeywords.length / jobKeywords.length) * 100);
  
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
      }
    ],
    suggestions: [
      "This is a basic fallback analysis as the AI service could not be reached.",
      "Try adding more keywords from the job description to your resume."
    ]
  };

  return { 
    match_score: matchScore, 
    analysis: basicAnalysis
  };
};
