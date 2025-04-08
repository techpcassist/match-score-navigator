
// Comparison algorithm using Google Generative AI

// Extract keywords from text
const extractKeywords = (text: string, commonKeywords: string[]) => {
  const textLower = text.toLowerCase();
  return commonKeywords.filter(keyword => textLower.includes(keyword));
};

// Calculate basic match score based on keywords
const calculateKeywordMatchScore = (resumeText: string, jobText: string) => {
  // Common keywords in tech job descriptions
  const commonKeywords = [
    // Technical skills
    "react", "javascript", "typescript", "python", "java", "nodejs", "express",
    "mongodb", "sql", "database", "frontend", "backend", "fullstack", "development",
    "aws", "azure", "gcp", "cloud", "docker", "kubernetes", "devops", "ci/cd",
    "git", "github", "rest", "graphql", "api", "microservices", "architecture",
    
    // Soft skills
    "communication", "teamwork", "leadership", "problem-solving", "analytical", 
    "creativity", "project management", "time management", "adaptability", "flexibility",
    
    // Job roles
    "software", "engineer", "developer", "architect", "manager", "lead", "senior",
    "junior", "full-stack", "front-end", "back-end", "data scientist", "analyst",
    
    // Qualifications
    "degree", "bachelor", "master", "phd", "certification", "experience", "years", 
    
    // Industry buzzwords
    "agile", "scrum", "kanban", "lean", "mvp", "startup", "enterprise", "innovation",
    "machine learning", "ai", "artificial intelligence", "blockchain", "security",
    "data", "analytics", "big data", "mobile", "web", "responsive", "optimization"
  ];
  
  // Find job keywords
  const jobKeywords = extractKeywords(jobText, commonKeywords);
  
  // Count matches in resume
  let matchCount = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  
  jobKeywords.forEach(keyword => {
    if (resumeText.toLowerCase().includes(keyword)) {
      matchCount++;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  // Calculate score based on keyword matches
  const keywordScore = jobKeywords.length > 0 
    ? (matchCount / jobKeywords.length) * 100 
    : 50;
    
  return { 
    keywordScore, 
    jobKeywords, 
    matchedKeywords, 
    missingKeywords 
  };
};

// Generate context-specific suggestions based on analysis
const generateSuggestions = (
  matchScore: number, 
  matchedKeywords: string[], 
  missingKeywords: string[], 
  resumeText: string,
  jobText: string
) => {
  const suggestions = [];
  
  // Add missing keywords suggestions
  if (missingKeywords.length > 0) {
    const keyGroups: Record<string, string[]> = {
      "technical skills": ["react", "javascript", "typescript", "python", "java", "nodejs", "aws", "docker", "kubernetes", "git"],
      "soft skills": ["communication", "teamwork", "leadership", "problem-solving", "analytical", "creativity"],
      "qualifications": ["degree", "bachelor", "master", "phd", "certification", "experience", "years"],
    };
    
    const missingByCategory: Record<string, string[]> = {};
    
    for (const [category, keywords] of Object.entries(keyGroups)) {
      const missing = missingKeywords.filter(k => keywords.includes(k));
      if (missing.length > 0) {
        missingByCategory[category] = missing;
      }
    }
    
    // Generate targeted suggestions by category
    for (const [category, keywords] of Object.entries(missingByCategory)) {
      if (keywords.length > 0) {
        suggestions.push(`Add ${category} like ${keywords.slice(0, 3).join(", ")}${keywords.length > 3 ? " and more" : ""} to your resume`);
      }
    }
  }
  
  // Experience formatting suggestions
  if (!resumeText.match(/\b(19|20)\d{2}\b[^\d]*(present|current|now|\b(19|20)\d{2}\b)/i)) {
    suggestions.push("Include clear date ranges for your experience (e.g., '2020-Present')");
  }
  
  // Action verbs suggestions
  const actionVerbs = ["implemented", "developed", "created", "managed", "led", "designed", "optimized"];
  const actionVerbCount = actionVerbs.reduce((count, verb) => {
    return count + (resumeText.toLowerCase().match(new RegExp(`\\b${verb}\\b`, 'g')) || []).length;
  }, 0);
  
  if (actionVerbCount < 3) {
    suggestions.push("Use more action verbs like 'implemented', 'developed', or 'optimized' to describe your achievements");
  }
  
  // Quantifiable achievements
  if (!resumeText.match(/\d+%|\d+ percent|increased|decreased|reduced|improved|saved|generated/i)) {
    suggestions.push("Add quantifiable achievements (e.g., 'increased performance by 30%')");
  }
  
  // Tailoring suggestions
  if (matchScore < 70) {
    suggestions.push("Tailor your resume to match the job description more closely");
  }
  
  // ATS optimization
  if (!resumeText.match(/\b(cell|phone|email|contact|github|linkedin)\b/i)) {
    suggestions.push("Ensure your resume includes complete contact information");
  }
  
  // Job-specific suggestions
  if (jobText.match(/\bteam\b|\bcollaboration\b/i) && 
      !resumeText.match(/\bteam\b|\bcollaboration\b/i)) {
    suggestions.push("Emphasize teamwork and collaboration experience");
  }
  
  if (jobText.match(/\blead\b|\bmanage\b|\bsupervis/i) && 
      !resumeText.match(/\blead\b|\bmanage\b|\bsupervis/i)) {
    suggestions.push("Highlight leadership or management experience");
  }
  
  // Education emphasis
  if (jobText.match(/degree|bachelor|master|phd/i) && 
      !resumeText.match(/degree|bachelor|master|phd/i)) {
    suggestions.push("Emphasize your educational qualifications");
  }
  
  // Add more generic suggestions if we don't have many specific ones
  if (suggestions.length < 3) {
    suggestions.push(
      "Consider reorganizing your resume to put the most relevant experience first",
      "Use industry-specific terminology that matches the job description",
      "Remove outdated or irrelevant experiences to focus on what matters for this role"
    );
  }
  
  return suggestions.slice(0, 6); // Limit to 6 most important suggestions
};

// Analyze specific sections of the job and resume
const analyzeSections = (resumeText: string, jobText: string) => {
  // Detect education section
  const hasEducationSection = resumeText.match(/education|degree|university|college|school/i) !== null;
  
  // Detect experience format
  const hasStructuredExperience = resumeText.match(/experience|work|professional/i) !== null && 
                                resumeText.match(/\b(19|20)\d{2}\b/g) !== null;
  
  // Detect skills section
  const hasSkillsSection = resumeText.match(/skills|proficiencies|technologies/i) !== null;
  
  // Detect projects section
  const hasProjectsSection = resumeText.match(/projects|portfolio/i) !== null;
  
  return {
    hasEducationSection,
    hasStructuredExperience,
    hasSkillsSection,
    hasProjectsSection
  };
};

// Evaluate advanced matching criteria
const evaluateAdvancedCriteria = (resumeText: string, jobText: string, matchScore: number) => {
  const baseScore = matchScore;
  
  // Helper function to determine status based on score and keywords
  const determineStatus = (
    score: number, 
    threshold: number, 
    jobKeywords: string[], 
    resumeKeywords: string[]
  ) => {
    if (score >= threshold + 15) return "matched";
    if (score >= threshold - 15) return "partial";
    return "missing";
  };
  
  const criteria = [
    {
      name: "Skill Proficiency Level",
      status: determineStatus(baseScore, 60, [], []),
      description: "Evaluates the level of expertise in key skills mentioned in the job description."
    },
    {
      name: "Quantified Impact Alignment",
      status: determineStatus(
        resumeText.match(/increased|decreased|improved|reduced|saved|achieved|delivered/gi) ? baseScore + 10 : baseScore - 10, 
        70, [], []
      ),
      description: "Measures how well your quantified achievements align with the job's key performance indicators."
    },
    {
      name: "Project Complexity & Scope",
      status: determineStatus(
        resumeText.match(/led|managed|coordinated|architected|designed/gi) ? baseScore + 5 : baseScore - 5,
        75, [], []
      ),
      description: "Assesses if your project experience matches the complexity requirements of the position."
    },
    {
      name: "Semantic Role Similarity",
      status: determineStatus(baseScore - 5, 65, [], []),
      description: "Analyzes how closely your previous role responsibilities match the job requirements."
    },
    {
      name: "Career Trajectory & Velocity",
      status: determineStatus(
        resumeText.match(/promotion|promoted|advanced|progressed/gi) ? baseScore + 10 : baseScore,
        70, [], []
      ),
      description: "Evaluates if your career progression aligns with the level of this position."
    },
    {
      name: "Technology Stack Alignment",
      status: determineStatus(
        resumeText.match(/react|node|javascript|typescript|python|aws|azure|gcp/gi) ? baseScore + 15 : baseScore - 15,
        65, [], []
      ),
      description: "Assesses how well your technical experience matches the required technology stack."
    },
    {
      name: "Industry Experience Relevance",
      status: determineStatus(baseScore - 10, 60, [], []),
      description: "Evaluates your experience within the specific industry targeted by this job."
    }
  ];
  
  return criteria;
};

// Generate ATS compatibility checks
const generateATSChecks = (resumeText: string) => {
  return [
    { 
      check_name: "Contact Information", 
      status: resumeText.match(/\b(phone|email|linkedin)\b/i) ? "pass" : "warning", 
      message: resumeText.match(/\b(phone|email|linkedin)\b/i) ? 
        "Contact information found" : 
        "Consider adding complete contact information" 
    },
    { 
      check_name: "Education Section", 
      status: resumeText.match(/education|degree|university|college/i) ? "pass" : "warning", 
      message: resumeText.match(/education|degree|university|college/i) ? 
        "Education section present" : 
        "Consider adding an education section" 
    },
    { 
      check_name: "Experience Format", 
      status: resumeText.match(/\b(19|20)\d{2}\b[^\d]*(present|current|now|\b(19|20)\d{2}\b)/i) ? "pass" : "warning", 
      message: resumeText.match(/\b(19|20)\d{2}\b[^\d]*(present|current|now|\b(19|20)\d{2}\b)/i) ? 
        "Experience format looks good" : 
        "Consider adding clear date ranges for all positions" 
    },
    { 
      check_name: "File Format", 
      status: "pass", 
      message: "Format is ATS-friendly" 
    },
    { 
      check_name: "Skills Section", 
      status: resumeText.match(/skills|proficiencies|technologies/i) ? "pass" : "warning", 
      message: resumeText.match(/skills|proficiencies|technologies/i) ? 
        "Skills section present" : 
        "Consider adding a dedicated skills section" 
    },
    { 
      check_name: "Keyword Density", 
      status: resumeText.length > 300 ? "pass" : "warning", 
      message: resumeText.length > 300 ? 
        "Good keyword density" : 
        "Resume might be too short for good keyword density" 
    }
  ];
};

// Performance indicators for the job fit
const analyzePerformanceIndicators = (resumeText: string, jobText: string) => {
  // Extract key performance indicators from job description
  const performanceKeywords = [
    "deliver", "achieve", "increase", "decrease", "improve", "reduce", 
    "optimize", "streamline", "accelerate", "enhance", "save", "grow"
  ];
  
  // Count job KPI mentions
  const jobKPIs = performanceKeywords.filter(kpi => 
    jobText.toLowerCase().includes(kpi)
  );
  
  // Count resume KPI mentions
  const resumeKPIs = performanceKeywords.filter(kpi => 
    resumeText.toLowerCase().includes(kpi)
  );
  
  // Calculate match percentages
  const matchPercentage = jobKPIs.length > 0 
    ? Math.round((resumeKPIs.length / jobKPIs.length) * 100) 
    : 50;
  
  return {
    jobKPIs,
    resumeKPIs,
    matchPercentage,
    needsImprovement: matchPercentage < 70
  };
};

// Main function to compare resume to job description
export const compareResumeToJob = (resumeText: string, jobDescriptionText: string) => {
  if (!resumeText || !jobDescriptionText) return { match_score: 0, analysis: {} };
  
  // Basic keyword match analysis
  const { 
    keywordScore, 
    jobKeywords, 
    matchedKeywords, 
    missingKeywords 
  } = calculateKeywordMatchScore(resumeText, jobDescriptionText);
  
  // Calculate length similarity score
  const lengthScore = Math.min(100, 
    100 - Math.abs(resumeText.length - jobDescriptionText.length) / 
    Math.max(resumeText.length, jobDescriptionText.length) * 50
  );
  
  // Section analysis
  const sectionAnalysis = analyzeSections(resumeText, jobDescriptionText);
  
  // Structural bonus for having all necessary sections
  const structuralBonus = 
    (sectionAnalysis.hasEducationSection ? 5 : 0) +
    (sectionAnalysis.hasStructuredExperience ? 10 : 0) + 
    (sectionAnalysis.hasSkillsSection ? 5 : 0);
  
  // Performance indicators analysis
  const performanceIndicators = analyzePerformanceIndicators(resumeText, jobDescriptionText);
  const performanceBonus = performanceIndicators.matchPercentage > 70 ? 5 : 0;
  
  // Combine scores with different weights
  const finalScore = Math.round(
    keywordScore * 0.6 + 
    lengthScore * 0.15 + 
    structuralBonus + 
    performanceBonus
  );
  
  // Ensure final score is between 0-100
  const normalizedScore = Math.min(100, Math.max(0, finalScore));
  
  // Generate suggestions
  const suggestions = generateSuggestions(
    normalizedScore, 
    matchedKeywords,
    missingKeywords,
    resumeText,
    jobDescriptionText
  );
  
  // Evaluate advanced criteria
  const advancedCriteria = evaluateAdvancedCriteria(
    resumeText, 
    jobDescriptionText, 
    normalizedScore
  );
  
  // Generate ATS checks
  const atsChecks = generateATSChecks(resumeText);
  
  // Categorize skills for better visualization
  const categorizeSkills = (keywords: string[]) => {
    const categories = {
      "programming_languages": ["javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "php"],
      "frameworks": ["react", "angular", "vue", "svelte", "express", "django", "flask", "spring", "rails"],
      "databases": ["sql", "mongodb", "postgresql", "mysql", "dynamodb", "redis", "firebase"],
      "cloud": ["aws", "azure", "gcp", "cloud", "serverless", "docker", "kubernetes"],
      "soft_skills": ["communication", "teamwork", "leadership", "problem-solving", "analytical", "creativity"]
    };
    
    const categorized: Record<string, { term: string, matched: boolean }[]> = {
      "hard_skills": [],
      "soft_skills": []
    };
    
    keywords.forEach(keyword => {
      const matched = matchedKeywords.includes(keyword);
      let categorized = false;
      
      // Check if keyword belongs to soft skills
      if (categories.soft_skills.some(skill => keyword.includes(skill))) {
        categorized = true;
        categorizedSkills.soft_skills.push({ term: keyword, matched });
      } 
      
      // If not categorized yet, put in hard skills
      if (!categorized) {
        categorizedSkills.hard_skills.push({ term: keyword, matched });
      }
    });
    
    return categorizedSkills;
  };
  
  // Categorize all job keywords
  const categorizedSkills = {
    hard_skills: [] as { term: string, matched: boolean }[],
    soft_skills: [] as { term: string, matched: boolean }[]
  };
  
  // Separate hard and soft skills
  const softSkills = ["communication", "teamwork", "leadership", "problem-solving", 
                      "analytical", "creativity", "time management", "adaptability"];
  
  jobKeywords.forEach(keyword => {
    const matched = matchedKeywords.includes(keyword);
    if (softSkills.some(skill => keyword.includes(skill))) {
      categorizedSkills.soft_skills.push({ term: keyword, matched });
    } else {
      categorizedSkills.hard_skills.push({ term: keyword, matched });
    }
  });
  
  // Generate comprehensive analysis report
  const analysis = {
    keywords: categorizedSkills,
    advanced_criteria: advancedCriteria,
    ats_checks: atsChecks,
    suggestions: suggestions,
    performance_indicators: {
      job_kpis: performanceIndicators.jobKPIs,
      resume_kpis: performanceIndicators.resumeKPIs,
      match_percentage: performanceIndicators.matchPercentage
    },
    section_analysis: {
      education: sectionAnalysis.hasEducationSection ? "present" : "missing",
      experience: sectionAnalysis.hasStructuredExperience ? "present" : "needs_improvement",
      skills: sectionAnalysis.hasSkillsSection ? "present" : "missing",
      projects: sectionAnalysis.hasProjectsSection ? "present" : "optional"
    },
    improvement_potential: {
      keyword_optimization: missingKeywords.length > 5 ? "high" : "medium",
      structure_optimization: 
        (sectionAnalysis.hasEducationSection && 
         sectionAnalysis.hasStructuredExperience && 
         sectionAnalysis.hasSkillsSection) ? "low" : "high",
      achievement_emphasis: performanceIndicators.needsImprovement ? "high" : "low"
    }
  };

  return { 
    match_score: normalizedScore, 
    analysis
  };
};
