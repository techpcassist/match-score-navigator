
import { UserRole } from "./types.ts";

/**
 * Creates a structured prompt for the AI to analyze the resume and job description
 */
export function createAnalysisPrompt(resumeText: string, jobText: string, userRole?: UserRole): string {
  // Base analysis prompt
  let prompt = `
  Analyze this resume and job description for a match:
  
  RESUME:
  ${resumeText}
  
  JOB DESCRIPTION:
  ${jobText}
  `;
  
  // Add role-specific instructions
  if (userRole === "job_seeker") {
    prompt += `
  PERSPECTIVE: JOB SEEKER
  Analyze this from the perspective of the Job Seeker trying to improve their resume for this specific job. 
  Focus heavily on identifying missing keywords they should add, providing actionable ATS formatting advice, 
  and phrasing suggestions for self-improvement. Emphasize specific changes the candidate can make to improve 
  their chances. De-emphasize comparative evaluation unless relevant for improvement.
    `;
  } else if (userRole === "recruiter") {
    prompt += `
  PERSPECTIVE: RECRUITER
  Analyze this from the perspective of a Recruiter evaluating this candidate's resume against the job description. 
  Focus on highlighting the degree of alignment with key requirements, clearly stating critical skill gaps, 
  providing concise justifications for advanced criteria assessments, and summarizing overall suitability. 
  Emphasize qualitative evaluation of the candidate's fit for the role. Less detail needed on generic ATS advice.
    `;
  }
  
  // Add detailed structured parsing instructions
  prompt += `
  ADDITIONAL TASK: STRUCTURED RESUME PARSING
  In addition to the analysis, extract structured data from the resume:
  1. Work Experience: For each position, identify:
     - Company name
     - Job title
     - Start and end dates (or "Present" if current)
     - Location information (country, state/province, city if available)
     - Description/responsibilities
  
  2. Education: For each entry, identify:
     - Degree/certificate name
     - Field of study
     - University/institution name
     - Location
     - Start and end dates
     
  3. Job Title Analysis:
     - Extract the job title from the job description
     - Extract the company name from the job description
     - Analyze how well the candidate's experience matches this specific job title at this specific company
     - If unable to determine job title or company name, mark these fields as "unknown" in your analysis
     
  Additionally, when analyzing the job title, consider the following parameters:
  - Core technical skills required for this role at this company
  - Relevant experience needed for this position
  - Educational requirements for this role
  - Essential soft skills for success in this position
  - Industry-specific knowledge relevant to this company
  - Key responsibilities for this role
  - Performance indicators that would measure success
  - Work culture fit considerations for this specific company
  - Career growth opportunities within this company

  Include this structured data in your response JSON.
  `;
  
  // Add the required JSON structure for output
  prompt += `
  Respond with a JSON object containing the following structure:
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
      "quantified_metrics": ["metric 1", "metric 2", ...],
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
      "job_title": "extracted title or unknown",
      "company_name": "extracted company or unknown",
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
    },
    "parsed_data": {
      "work_experience": [
        {
          "id": "string",
          "company": "string",
          "title": "string",
          "startDate": "string",
          "endDate": "string",
          "companyLocation": {
            "country": "string",
            "state": "string",
            "city": "string"
          },
          "description": "string"
        },
        ...
      ],
      "education": [
        {
          "id": "string",
          "degree": "string",
          "fieldOfStudy": "string",
          "university": "string",
          "country": "string",
          "state": "string",
          "startDate": "string",
          "endDate": "string"
        },
        ...
      ]
    }
  }
  
  Return ONLY valid JSON without any markdown formatting or explanations. The analysis should be specific to the job type mentioned in the job description, identifying appropriate skills and requirements for that particular industry.`;

  return prompt;
}
