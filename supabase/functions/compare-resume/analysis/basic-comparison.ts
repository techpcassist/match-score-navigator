
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
    section_analysis?: {
      education?: string;
      experience?: string;
      skills?: string;
      summary?: string;
    };
    parsed_data?: {
      work_experience: any[];
      education: any[];
    };
  };
}

// Common skills to check for in resumes
const commonHardSkills = [
  "javascript", "python", "java", "c++", "c#", "typescript", 
  "react", "angular", "vue", "node.js", "express", "django", 
  "mongodb", "sql", "postgresql", "mysql", "aws", "azure", 
  "google cloud", "docker", "kubernetes", "github", "git", 
  "machine learning", "data science", "ai", "blockchain"
];

const commonSoftSkills = [
  "leadership", "communication", "teamwork", "problem solving", 
  "critical thinking", "time management", "project management", 
  "adaptability", "creativity", "attention to detail"
];

/**
 * Function to extract keywords from text
 */
export const extractBasicKeywords = (text: string): string[] => {
  if (!text) return [];
  
  // Simple keyword extraction logic
  const lowercaseText = text.toLowerCase();
  
  // Check for hard skills
  const matchedHardSkills = commonHardSkills.filter(skill => 
    lowercaseText.includes(skill.toLowerCase())
  );
  
  // Check for soft skills
  const matchedSoftSkills = commonSoftSkills.filter(skill => 
    lowercaseText.includes(skill.toLowerCase())
  );
  
  // Combine both skill types
  return [...new Set([...matchedHardSkills, ...matchedSoftSkills])];
};

/**
 * Performs a simple keyword-based comparison when AI analysis fails
 * with enhanced fallback data
 */
export const performBasicComparison = (resumeText: string, jobDescriptionText: string, jobTitle?: string, companyName?: string): BasicAnalysisResult => {
  console.log("Using fallback basic analysis method");
  
  if (!resumeText || !jobDescriptionText) {
    console.log("Empty resume or job description, returning minimal score");
    return {
      match_score: 30, // Default minimum score instead of 0
      analysis: {
        keywords: {
          hard_skills: [],
          soft_skills: []
        },
        ats_checks: [
          { 
            check_name: "Basic Analysis", 
            status: "warning", 
            message: "Limited text provided for analysis" 
          }
        ],
        suggestions: ["Provide more detailed resume and job description for better analysis"],
        job_title_analysis: {
          job_title: jobTitle || "Unknown Position",
          company_name: companyName || "Unknown Company"
        },
        section_analysis: {
          experience: "Limited text for analysis",
          education: "Limited text for analysis",
          skills: "Limited text for analysis",
          summary: "Limited text for analysis"
        },
        parsed_data: {
          work_experience: [],
          education: []
        }
      }
    };
  }
  
  // Extract keywords from both texts
  const jobKeywords = extractBasicKeywords(jobDescriptionText);
  const resumeKeywords = extractBasicKeywords(resumeText);
  
  // Calculate simple matching score
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword)
  );
  
  let matchScore = jobKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 40; // Default score if no keywords found
  
  // Ensure valid score between 0-100
  matchScore = Math.min(100, Math.max(30, matchScore)); // Minimum score of 30
  
  console.log(`Basic comparison: Found ${matchedKeywords.length}/${jobKeywords.length} matches. Score: ${matchScore}%`);
  
  // Identify hard skills
  const hardSkills = commonHardSkills.filter(skill => 
    jobDescriptionText.toLowerCase().includes(skill)
  ).map(term => ({
    term,
    matched: resumeText.toLowerCase().includes(term)
  }));
  
  // Identify soft skills
  const softSkills = commonSoftSkills.filter(skill => 
    jobDescriptionText.toLowerCase().includes(skill)
  ).map(term => ({
    term,
    matched: resumeText.toLowerCase().includes(term)
  }));
  
  // Create a comprehensive fallback analysis
  const basicAnalysis = {
    keywords: {
      hard_skills: hardSkills,
      soft_skills: softSkills
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
      "Add more keywords from the job description to your resume to improve matching.",
      "Ensure your resume includes specific skills mentioned in the job description.",
      "Consider formatting your resume to be more ATS-friendly with clear section headings.",
      "Try again later when AI services are available for more detailed analysis."
    ],
    job_title_analysis: {
      job_title: jobTitle || "Unknown Position",
      company_name: companyName || "Unknown Company"
    },
    section_analysis: {
      experience: "Basic analysis performed. Add relevant experience that matches the job description.",
      education: "Ensure your education section highlights relevant qualifications.",
      skills: `Your resume matches ${matchScore}% of the required skills. Consider adding more of the missing skills.`,
      summary: "A strong summary highlighting your fit for this position is recommended."
    },
    parsed_data: {
      work_experience: [],
      education: []
    }
  };

  return { 
    match_score: matchScore, 
    analysis: basicAnalysis
  };
};
