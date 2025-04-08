
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Basic utility functions for text processing
const cleanText = (text: string) => {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
};

// Make an API call to Google Generative AI for enhanced analysis
const callGenerativeAI = async (resumeText: string, jobText: string): Promise<any> => {
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
    
    // Prepare the prompt for the API
    const prompt = `
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
    
    The analysis should be specific to the job type mentioned in the job description, identifying appropriate skills and requirements for that particular industry.`;
    
    // Generate content using the model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // The response should be a valid JSON string
      const parsedData = JSON.parse(text);
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

// Fallback function for keyword extraction
const extractBasicKeywords = (text: string) => {
  // Convert to lowercase and remove special characters
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split by whitespace and filter out common stop words and short terms
  const stopWords = new Set(['and', 'the', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 
    'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'have', 
    'more', 'has', 'an', 'was', 'we', 'will', 'can', 'all', 'use']);
  
  // Extract words, filter stop words and short words
  const words = cleanText.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  // Count frequency of each word
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedWords.slice(0, 50); // Return top 50 keywords
};

// Main function to compare resume to job description
export const compareResumeToJob = async (resumeText: string, jobDescriptionText: string) => {
  if (!resumeText || !jobDescriptionText) return { match_score: 0, analysis: {} };

  try {
    // Try to use Google's Generative AI for enhanced analysis
    console.log("Attempting to use Google Generative AI for resume analysis...");
    
    // Make an asynchronous call to the AI API
    const aiResponse = await callGenerativeAI(resumeText, jobDescriptionText);
    
    // Check if AI call was successful
    if (aiResponse.success) {
      console.log("Successfully got analysis from Google Generative AI");
      
      // The aiResponse.data should already contain our entire analysis structure
      return { 
        match_score: aiResponse.data.match_score, 
        analysis: aiResponse.data
      };
    } else {
      console.log("Google Generative AI call failed, falling back to basic analysis");
      throw new Error("AI API call failed: " + aiResponse.error);
    }
  } catch (error) {
    // Fall back to a very basic keyword matching approach
    console.error("Error with Google Generative AI, using fallback analysis:", error);
    
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
  }
};
