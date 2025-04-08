
// Import using Deno-compatible syntax for npm packages
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "npm:@google/generative-ai";

/**
 * Generic interface for AI analysis response
 */
export interface AIAnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Makes an API call to Google Generative AI for enhanced resume analysis
 */
export const callGenerativeAI = async (
  resumeText: string, 
  jobText: string
): Promise<AIAnalysisResponse> => {
  try {
    console.log("Making API call to Google Generative AI...");
    
    // Get API key from environment variable
    const apiKey = Deno.env.get("GOOGLE_GENERATIVE_AI_KEY");
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_KEY environment variable");
    }
    
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    // Create the prompt for the analysis
    const prompt = createAnalysisPrompt(resumeText, jobText);
    
    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response - now with support for markdown-formatted JSON
    try {
      console.log("Raw response from Google Generative AI:", text);
      
      // Remove markdown code block formatting if present
      const jsonContent = text.replace(/```(json)?\n/g, '').replace(/\n```$/g, '');
      
      // The response should now be a valid JSON string
      const parsedData = JSON.parse(jsonContent);
      console.log("Successfully received and parsed response from Google Generative AI");
      
      return {
        success: true,
        data: parsedData
      };
    } catch (parseError) {
      console.error("Failed to parse JSON from Google Generative AI response:", parseError);
      console.log("Raw response:", text);
      throw new Error("Invalid response format from Generative AI");
    }
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates a structured prompt for the AI to analyze the resume and job description
 */
function createAnalysisPrompt(resumeText: string, jobText: string): string {
  return `
  Analyze this resume and job description for a match:
  
  RESUME:
  ${resumeText}
  
  JOB DESCRIPTION:
  ${jobText}
  
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
    }
  }
  
  Return ONLY valid JSON without any markdown formatting or explanations. The analysis should be specific to the job type mentioned in the job description, identifying appropriate skills and requirements for that particular industry.`;
}
