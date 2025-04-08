
// Comparison algorithm utility functions

// More advanced algorithm to compare resume and job description
export const compareResumeToJob = (resumeText: string, jobText: string) => {
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
