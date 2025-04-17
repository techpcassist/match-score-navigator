
import { UserRole } from "./types.ts";

interface News {
  title: string;
  content: string;
}

export function createAnalysisPrompt(resumeText: string, jobText: string, userRole?: UserRole, jobTitle?: string, companyName?: string): string {
  // Base company info if none provided
  const defaultCompanyInfo = {
    description: "A platform/community focused on empowering developers, fostering a positive environment, and providing developer tools and resources.",
    culture: "Friendly, inclusive, developer-centric, collaborative, and valuing learning and growth.",
    goals: "To empower developers, build a strong and supportive community, and create valuable resources and tools for the development ecosystem."
  };

  // Build prompt based on the company info and job details
  const prompt = `
  Analyze the following:
  
  JOB DESCRIPTION:
  ${jobText}
  
  RESUME:
  ${resumeText}
  
  CONTEXT:
  ${jobTitle ? `Job Title: "${jobTitle}"` : 'Job title not provided'}
  ${companyName ? `Company: "${companyName}"` : 'Company not specified'}
  
  Company Description: ${defaultCompanyInfo.description}
  Company Culture: ${defaultCompanyInfo.culture}
  Company Goals: ${defaultCompanyInfo.goals}
  
  Identify and list the key parameters based on the job description and resume match, considering:

  1. Core Technical Skills: List specific technical skills, software, tools, and technologies required
  2. Relevant Experience: Describe type and level of experience needed
  3. Educational Requirements: List required degrees, certifications, or specialized training
  4. Essential Soft Skills: List crucial soft skills like communication, empathy, collaboration
  5. Industry-Specific Knowledge: Identify specialized knowledge requirements
  6. Key Responsibilities: Summarize core responsibilities
  7. Performance Indicators: Key metrics for success
  8. Work Culture Fit: Describe optimal cultural alignment
  9. Career Growth: Potential career growth opportunities

  ${userRole === "job_seeker" ? 
    `PERSPECTIVE: JOB SEEKER
    Analyze this from the perspective of the Job Seeker trying to improve their resume for this specific job. 
    Focus heavily on identifying missing keywords they should add, providing actionable ATS formatting advice, 
    and phrasing suggestions for self-improvement.` 
    : 
    `PERSPECTIVE: RECRUITER
    Analyze this from the perspective of a Recruiter evaluating this candidate's resume against the job description. 
    Focus on highlighting the degree of alignment with key requirements, clearly stating critical skill gaps, 
    and summarizing overall suitability.`
  }

  Return a JSON object with your analysis using this structure:
  {
    "match_score": number (0-100),
    "keywords": {
      "hard_skills": [{"term": "skill name", "matched": boolean}, ...],
      "soft_skills": [{"term": "skill name", "matched": boolean}, ...]
    },
    "ats_checks": [
      {"check_name": "string", "status": "pass"|"fail"|"warning", "message": "string"}, ...
    ],
    "ats_score": number (0-100),
    "suggestions": ["suggestion 1", "suggestion 2", ...],
    "advanced_criteria": [
      {"name": "string", "status": "matched"|"partial"|"missing", "description": "string"}, ...
    ],
    "performance_indicators": {
      "job_kpis": ["kpi 1", "kpi 2", ...],
      "resume_kpis": ["kpi 1", "kpi 2", ...],
      "match_percentage": number (0-100)
    },
    "section_analysis": {
      "education": "string",
      "experience": "string",
      "skills": "string",
      "projects": "string"
    },
    "improvement_potential": {
      "keyword_optimization": {
        "level": "high"|"medium"|"low",
        "details": {
          "missing_technical": ["skill 1", "skill 2", ...],
          "missing_soft": ["skill 1", "skill 2", ...]
        }
      },
      "structure_optimization": {
        "level": "high"|"medium"|"low",
        "issues": ["issue 1", "issue 2", ...]
      },
      "achievement_emphasis": {
        "level": "high"|"medium"|"low",
        "issues": ["issue 1", "issue 2", ...]
      }
    },
    "job_title_analysis": {
      "job_title": "string",
      "company_name": "string",
      "key_parameters": {
        "core_technical_skills": ["skill1", "skill2", ...],
        "relevant_experience": "description",
        "educational_requirements": "description",
        "essential_soft_skills": ["skill1", "skill2", ...],
        "industry_specific_knowledge": "description",
        "key_responsibilities": "description",
        "performance_indicators": ["metric1", "metric2", ...],
        "work_culture_fit": "description",
        "career_growth": "description"
      }
    }
  }
  
  Return ONLY valid JSON without any markdown formatting or explanations.`; 

  return prompt;
}
