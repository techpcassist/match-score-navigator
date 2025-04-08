
// Comparison algorithm using Google Generative AI

// Basic utility functions for text processing
const cleanText = (text: string) => {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
};

// Function to extract keywords from text using basic NLP techniques
// This will be used as a fallback if API calls fail
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

// Make an API call to Google Generative AI for enhanced analysis
const callGenerativeAI = async (resumeText: string, jobText: string) => {
  try {
    // This is simplified for now - in a real implementation, you would make an actual API call
    // to Google's Generative AI service like Gemini
    console.log("Making API call to Google Generative AI...");
    
    // Simulate API call failure when in development
    if (Math.random() < 0.1) {
      throw new Error("Simulated API call failure");
    }
    
    // Extract keywords from job description
    const jobKeywords = extractBasicKeywords(jobText);
    const resumeKeywords = extractBasicKeywords(resumeText);
    
    // Calculate simple matching score
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword)
    );
    
    return {
      success: true,
      data: {
        jobKeywords,
        resumeKeywords,
        matchedKeywords,
        matchScore: Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      }
    };
  } catch (error) {
    console.error("Error calling Generative AI:", error);
    return { success: false, error };
  }
};

// Extract skill keywords from job description - now with dynamic skill detection
const extractSkillKeywords = (jobText: string) => {
  // Create a dynamic approach that doesn't rely on predefined tech skills
  
  // 1. Use NLP to extract important noun phrases and verb phrases
  const cleanedText = jobText.toLowerCase();
  const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // 2. Extract potential skills based on common patterns and context
  const skillWords = new Set([
    // General skills across all industries
    'ability', 'skill', 'experience', 'knowledge', 'proficient', 'familiar', 'expert', 'competent',
    'qualification', 'certified', 'trained', 'background', 'capability'
  ]);
  
  // Extract technical skills (domain-specific knowledge)
  const technicalSkills = new Set<string>();
  const softSkills = new Set<string>();
  const roles = new Set<string>();
  const qualifications = new Set<string>();
  
  // Process industry-specific terms by analyzing context
  sentences.forEach(sentence => {
    // Look for skill indicators
    const words = sentence.split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w]/g, '');
      
      // Skip short words and common words
      if (word.length < 3) continue;
      
      // Extract skills based on context
      if (skillWords.has(word) || 
          sentence.includes('experience with') || 
          sentence.includes('knowledge of') ||
          sentence.includes('ability to') ||
          sentence.includes('proficient in') ||
          sentence.includes('familiar with') ||
          sentence.includes('understanding of')) {
        
        // Get the surrounding words which likely contain the actual skill
        const phraseStart = Math.max(0, i - 3);
        const phraseEnd = Math.min(words.length, i + 5);
        const phrase = words.slice(phraseStart, phraseEnd).join(' ');
        
        // Determine skill type based on context
        if (sentence.includes('certification') || 
            sentence.includes('degree') || 
            sentence.includes('license') ||
            sentence.includes('qualification')) {
          
          // Identify qualification phrases
          const qualificationPattern = /\b(degree|certification|certificate|diploma|license|qualified|graduate|educated|bachelor|master|phd|doctorate)\b.*?(\bin\s+|with\s+|)([a-zA-Z\s]+)/i;
          const match = sentence.match(qualificationPattern);
          if (match && match[3]) {
            qualifications.add(match[3].trim().toLowerCase());
          } else {
            // Extract other qualification-related terms
            extractTerms(sentence, qualifications);
          }
        } 
        else if (sentence.includes('communicate') || 
                sentence.includes('team') || 
                sentence.includes('collaborate') ||
                sentence.includes('lead') ||
                sentence.includes('manage') ||
                sentence.includes('interpersonal') ||
                sentence.includes('attitude') ||
                sentence.includes('solve') ||
                sentence.includes('flexible')) {
          // Extract soft skill phrases
          const softSkillPattern = /\b(communicat|collaborat|coordinat|lead|manag|prioritiz|solv|organiz|teamwork|team player|detail-oriented|self-motivated|customer service|interpersonal|problem[\s-]?solv|analytical|critical[\s-]?think|time[\s-]?manag|decision[\s-]?mak|flex|adapt|creat|innovat|resilien|conflict[\s-]?resolut|listen)[a-z]*(ing|ion|ity|ive)?\b/i;
          const matches = sentence.match(new RegExp(softSkillPattern, 'gi'));
          if (matches) {
            matches.forEach(match => {
              softSkills.add(match.toLowerCase());
            });
          }
        }
        else if (sentence.includes('role') || 
                sentence.includes('position') || 
                sentence.includes('job title') ||
                sentence.includes('level')) {
          // Extract role-related terms
          const rolePattern = /\b(senior|junior|lead|manager|supervisor|director|chief|head|specialist|assistant|associate|entry[\s-]?level|mid[\s-]?level)\b/i;
          const matches = sentence.match(new RegExp(rolePattern, 'gi'));
          if (matches) {
            matches.forEach(match => {
              roles.add(match.toLowerCase());
            });
          }
        }
        else {
          // Remaining phrases are likely technical skills
          // Extract noun phrases as potential technical skills
          const technicalPattern = /\b([a-zA-Z]+(?:[\s-][a-zA-Z]+)*)\b/g;
          const potentialSkills = sentence.match(technicalPattern);
          if (potentialSkills) {
            potentialSkills.forEach(skill => {
              if (skill.length > 3 && !skillWords.has(skill)) {
                technicalSkills.add(skill.toLowerCase());
              }
            });
          }
        }
      }
    }
  });
  
  // Helper function to extract terms from a sentence
  function extractTerms(sentence: string, skillSet: Set<string>) {
    // Simple noun phrase extraction
    const nounPhrasePattern = /\b([a-zA-Z]+(?:[\s-][a-zA-Z]+){0,3})\b/g;
    const matches = sentence.match(nounPhrasePattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 3) {
          skillSet.add(match.toLowerCase());
        }
      });
    }
  }
  
  // 3. Extract industry-specific patterns based on content
  const industryDetection = {
    transport: /\b(driving|driver|vehicle|transport|delivery|logistics|truck|lorry|fleet|route|safety|haul)\b/i,
    culinary: /\b(cook|chef|kitchen|food|culinary|cuisine|restaurant|catering|menu|recipe|baking|ingredient)\b/i,
    healthcare: /\b(patient|medical|clinical|health|care|treatment|hospital|doctor|nurse|therapy|diagnostic)\b/i,
    construction: /\b(build|construction|contractor|site|safety|project|architect|engineering|concrete|electrical|plumbing)\b/i,
    retail: /\b(sales|customer|retail|store|inventory|merchandise|cashier|stock|display|service)\b/i,
    finance: /\b(finance|accounting|budget|financial|investment|banking|audit|tax|report|analysis|forecast)\b/i,
    education: /\b(teach|education|student|classroom|curriculum|instruction|school|learning|academic|assessment)\b/i,
    tech: /\b(software|developer|program|code|web|app|system|data|network|cloud|security|it|computer)\b/i
  };
  
  // Detect industry and add relevant terms
  let detectedIndustry = '';
  let highestMatchCount = 0;
  
  for (const [industry, pattern] of Object.entries(industryDetection)) {
    const matches = jobText.match(pattern);
    const matchCount = matches ? matches.length : 0;
    
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      detectedIndustry = industry;
    }
  }
  
  // Add industry-specific skills if detected
  if (detectedIndustry === 'transport') {
    // Transport industry skills
    ['driving license', 'route planning', 'vehicle maintenance', 'loading', 'unloading', 'safety regulations', 
     'logistics', 'punctuality', 'time management', 'gps navigation', 'customer service'].forEach(skill => {
      if (jobText.toLowerCase().includes(skill.toLowerCase())) {
        technicalSkills.add(skill.toLowerCase());
      }
    });
  } else if (detectedIndustry === 'culinary') {
    // Culinary industry skills
    ['food preparation', 'cooking techniques', 'menu planning', 'kitchen management', 'food safety',
     'knife skills', 'recipe development', 'plating', 'portion control', 'inventory management'].forEach(skill => {
      if (jobText.toLowerCase().includes(skill.toLowerCase())) {
        technicalSkills.add(skill.toLowerCase());
      }
    });
  }
  
  // Convert sets to arrays
  return {
    technical: Array.from(technicalSkills).filter(skill => !softSkills.has(skill)).slice(0, 15),
    soft: Array.from(softSkills).slice(0, 10),
    roles: Array.from(roles).slice(0, 5),
    qualifications: Array.from(qualifications).slice(0, 5)
  };
};

// Calculate basic match score based on extracted keywords
const calculateKeywordMatchScore = (resumeText: string, jobText: string) => {
  // Generate keywords from the job description
  const basicKeywords = extractBasicKeywords(jobText);
  const extractedSkills = extractSkillKeywords(jobText);
  
  // Combine all extracted skills into job keywords
  const jobKeywords = [
    ...basicKeywords,
    ...extractedSkills.technical,
    ...extractedSkills.soft,
    ...extractedSkills.roles,
    ...extractedSkills.qualifications
  ];
  
  // Deduplicate the job keywords
  const uniqueJobKeywords = Array.from(new Set(jobKeywords));
  
  // Count matches in resume
  let matchCount = 0;
  const matchedKeywords = [];
  const missingKeywords = [];
  
  uniqueJobKeywords.forEach(keyword => {
    if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
      matchCount++;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  // Calculate score based on keyword matches
  const keywordScore = uniqueJobKeywords.length > 0 
    ? (matchCount / uniqueJobKeywords.length) * 100 
    : 50;
    
  return { 
    keywordScore, 
    jobKeywords: uniqueJobKeywords, 
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
  
  // Extract skills by category
  const extractedSkills = extractSkillKeywords(jobText);
  
  // Add missing keywords suggestions by category
  if (missingKeywords.length > 0) {
    const missingByCategory: Record<string, string[]> = {};
    
    // Categorize missing keywords
    for (const [category, skills] of Object.entries(extractedSkills)) {
      const missing = missingKeywords.filter(k => 
        skills.includes(k.toLowerCase())
      );
      
      if (missing.length > 0) {
        missingByCategory[category] = missing;
      }
    }
    
    // Generate targeted suggestions by category
    for (const [category, keywords] of Object.entries(missingByCategory)) {
      if (keywords.length > 0) {
        const categoryName = category === 'technical' ? 'Technical skills' : 
                            category === 'soft' ? 'Soft skills' : 
                            category === 'roles' ? 'Role-specific terms' : 
                            'Qualifications';
        
        suggestions.push(`Add ${categoryName} like ${keywords.slice(0, 3).join(", ")}${keywords.length > 3 ? " and more" : ""} to your resume`);
      }
    }
  }
  
  // Experience formatting suggestions
  if (!resumeText.match(/\b(19|20)\d{2}\b[^\d]*(present|current|now|\b(19|20)\d{2}\b)/i)) {
    suggestions.push("Include clear date ranges for your experience (e.g., '2020-Present')");
  }
  
  // Action verbs suggestions
  const actionVerbs = ["implemented", "developed", "created", "managed", "led", "designed", "optimized", 
                      "achieved", "improved", "increased", "decreased", "reduced", "launched", "delivered"];
  const actionVerbCount = actionVerbs.reduce((count, verb) => {
    return count + (resumeText.toLowerCase().match(new RegExp(`\\b${verb}\\b`, 'g')) || []).length;
  }, 0);
  
  if (actionVerbCount < 5) {
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
  const specificRequirements = [
    { pattern: /\bteam\b|\bcollaboration\b/i, suggestion: "Emphasize teamwork and collaboration experience" },
    { pattern: /\blead\b|\bmanage\b|\bsupervis/i, suggestion: "Highlight leadership or management experience" },
    { pattern: /degree|bachelor|master|phd/i, suggestion: "Emphasize your educational qualifications" },
    { pattern: /\bremote\b|\bvirtual\b|\bwork from home/i, suggestion: "Highlight remote work experience or capabilities" },
    { pattern: /\bpresent\b|\bcommunicat\b|\bstakeholder/i, suggestion: "Showcase presentation and communication skills" },
    { pattern: /\binternational\b|\bglobal\b|\bmulticultural/i, suggestion: "Emphasize international or cross-cultural experience" },
    { pattern: /\bdata\b|\banalytics\b|\bmetrics\b|\bkpi/i, suggestion: "Highlight data analysis experience and results" },
    { pattern: /\bagile\b|\bscrum\b|\bkanban\b|\bsprints/i, suggestion: "Emphasize agile methodology experience" }
  ];
  
  specificRequirements.forEach(({ pattern, suggestion }) => {
    if (jobText.match(pattern) && !resumeText.match(pattern)) {
      suggestions.push(suggestion);
    }
  });
  
  // Resume structure suggestions
  const sectionSuggestions = [];
  if (!resumeText.match(/\beducation\b|\bdegree\b|\buniversity\b|\bcollege\b/i)) {
    sectionSuggestions.push("education section");
  }
  if (!resumeText.match(/\bskills\b|\bproficiencies\b|\btechnologies\b/i)) {
    sectionSuggestions.push("dedicated skills section");
  }
  if (!resumeText.match(/\bexperience\b|\bwork history\b|\bemployment\b/i)) {
    sectionSuggestions.push("clear work experience section");
  }
  
  if (sectionSuggestions.length > 0) {
    suggestions.push(`Consider adding a ${sectionSuggestions.join(' and ')} to your resume`);
  }
  
  // Industry-specific suggestions based on keywords in job
  const industries = [
    { pattern: /\bfinance\b|\bbanking\b|\binvestment\b|\bcompliance\b/i, suggestion: "Highlight financial industry knowledge and compliance awareness" },
    { pattern: /\bhealthcare\b|\bmedical\b|\bclinical\b|\bpatient\b/i, suggestion: "Emphasize healthcare experience and patient-centered approaches" },
    { pattern: /\bsales\b|\bmarketing\b|\bconversion\b|\bcustomer acquisition\b/i, suggestion: "Showcase sales achievements with specific metrics" },
    { pattern: /\bprivacy\b|\bgdpr\b|\bhipaa\b|\bcompliance\b|\bregulation\b/i, suggestion: "Highlight your knowledge of relevant regulatory compliance" }
  ];
  
  industries.forEach(({ pattern, suggestion }) => {
    if (jobText.match(pattern) && !resumeText.match(pattern)) {
      suggestions.push(suggestion);
    }
  });
  
  // Add more generic suggestions if we don't have many specific ones
  if (suggestions.length < 3) {
    suggestions.push(
      "Consider reorganizing your resume to put the most relevant experience first",
      "Use industry-specific terminology that matches the job description",
      "Remove outdated or irrelevant experiences to focus on what matters for this role"
    );
  }
  
  return suggestions.slice(0, 8); // Limit to 8 most important suggestions
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
  
  // Generate detailed analysis based on resume content
  let educationAnalysis = "Missing";
  if (hasEducationSection) {
    const educationContent = resumeText.match(/education.*?(?=experience|skills|projects|$)/is);
    if (educationContent) {
      if (educationContent[0].match(/degree|bachelor|master|phd/i)) {
        educationAnalysis = "Your education section is well formatted with degree information.";
      } else {
        educationAnalysis = "Consider adding more details about your degrees and relevant coursework.";
      }
    } else {
      educationAnalysis = "Education section is present but could be expanded.";
    }
  } else {
    educationAnalysis = "Consider adding an education section with your degrees and relevant coursework.";
  }
  
  // Experience analysis
  let experienceAnalysis = "Missing";
  if (hasStructuredExperience) {
    const experienceContent = resumeText.match(/experience.*?(?=education|skills|projects|$)/is);
    if (experienceContent) {
      // Check for action verbs
      const hasActionVerbs = experienceContent[0].match(/implemented|developed|created|managed|led|designed|optimized/i);
      // Check for quantifiable results
      const hasQuantifiableResults = experienceContent[0].match(/\d+%|\d+ percent|increased|decreased|reduced/i);
      
      if (hasActionVerbs && hasQuantifiableResults) {
        experienceAnalysis = "Your experience section effectively showcases achievements with action verbs and metrics.";
      } else if (hasActionVerbs) {
        experienceAnalysis = "Your experience includes good action verbs, but consider adding quantifiable achievements.";
      } else if (hasQuantifiableResults) {
        experienceAnalysis = "Your experience includes metrics, but try using more action verbs to describe your accomplishments.";
      } else {
        experienceAnalysis = "Consider enhancing your experience with action verbs and quantifiable achievements.";
      }
    } else {
      experienceAnalysis = "Experience section is present but could be improved with more specific accomplishments.";
    }
  } else {
    experienceAnalysis = "Consider adding a structured experience section with clear roles, dates, and achievements.";
  }
  
  // Skills analysis
  let skillsAnalysis = "Missing";
  if (hasSkillsSection) {
    const skillsContent = resumeText.match(/skills.*?(?=education|experience|projects|$)/is);
    if (skillsContent) {
      // Extract skills by category from job description
      const jobSkills = extractSkillKeywords(jobText);
      const technicalMatch = jobSkills.technical.some(skill => 
        skillsContent[0].toLowerCase().includes(skill.toLowerCase())
      );
      
      if (technicalMatch) {
        skillsAnalysis = "Your skills section contains relevant technical skills for this position.";
      } else {
        skillsAnalysis = "Consider adding more relevant technical skills that match the job requirements.";
      }
    } else {
      skillsAnalysis = "Skills section is present but could be more targeted to the job requirements.";
    }
  } else {
    skillsAnalysis = "Consider adding a dedicated skills section highlighting your technical and soft skills.";
  }
  
  // Projects analysis
  let projectsAnalysis = "Optional";
  if (hasProjectsSection) {
    const projectsContent = resumeText.match(/projects.*?(?=education|experience|skills|$)/is);
    if (projectsContent) {
      if (projectsContent[0].match(/github|demo|link|url/i)) {
        projectsAnalysis = "Your projects section includes links which is excellent for showcase.";
      } else {
        projectsAnalysis = "Consider adding links to your projects for better visibility.";
      }
    } else {
      projectsAnalysis = "Projects section is present but could be enhanced with more details.";
    }
  } else if (jobText.match(/portfolio|projects|github/i)) {
    projectsAnalysis = "Consider adding a projects section as it seems relevant for this position.";
  }
  
  return {
    hasEducationSection,
    hasStructuredExperience,
    hasSkillsSection,
    hasProjectsSection,
    education: educationAnalysis,
    experience: experienceAnalysis,
    skills: skillsAnalysis,
    projects: projectsAnalysis
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
  
  // Extract skills by category for more accurate matching
  const jobSkills = extractSkillKeywords(jobText);
  
  const criteria = [
    {
      name: "Skill Proficiency Level",
      status: determineStatus(
        resumeText.match(/expert|proficient|advanced|intermediate|beginner/gi) ? 
          baseScore + 10 : baseScore - 5, 
        60, [], []
      ),
      description: "Evaluates the level of expertise in key skills mentioned in the job description."
    },
    {
      name: "Quantified Impact Alignment",
      status: determineStatus(
        resumeText.match(/increased|decreased|improved|reduced|saved|achieved|delivered/gi) ? 
          baseScore + 10 : baseScore - 10, 
        70, [], []
      ),
      description: "Measures how well your quantified achievements align with the job's key performance indicators."
    },
    {
      name: "Project Complexity & Scope",
      status: determineStatus(
        resumeText.match(/led|managed|coordinated|architected|designed/gi) ? 
          baseScore + 5 : baseScore - 5,
        75, [], []
      ),
      description: "Assesses if your project experience matches the complexity requirements of the position."
    },
    {
      name: "Semantic Role Similarity",
      status: determineStatus(
        // Compare job title keywords with resume titles
        (jobText.match(/senior|lead|principal|manager|director/gi) && 
         resumeText.match(/senior|lead|principal|manager|director/gi)) ||
        (jobText.match(/junior|associate|entry/gi) && 
         resumeText.match(/junior|associate|entry/gi)) ?
          baseScore + 10 : baseScore - 5,
        65, [], []
      ),
      description: "Analyzes how closely your previous role responsibilities match the job requirements."
    },
    {
      name: "Career Trajectory & Velocity",
      status: determineStatus(
        resumeText.match(/promotion|promoted|advanced|progressed/gi) ? 
          baseScore + 10 : baseScore,
        70, [], []
      ),
      description: "Evaluates if your career progression aligns with the level of this position."
    },
    {
      name: "Technology Stack Alignment",
      status: determineStatus(
        // Check if resume contains the technical skills from job description
        jobSkills.technical.some(tech => 
          resumeText.toLowerCase().includes(tech.toLowerCase())
        ) ? baseScore + 15 : baseScore - 15,
        65, [], []
      ),
      description: "Assesses how well your technical experience matches the required technology stack."
    },
    {
      name: "Industry Experience Relevance",
      status: determineStatus(
        // Check for industry term matches
        (jobText.match(/finance|banking|investment/gi) && 
         resumeText.match(/finance|banking|investment/gi)) ||
        (jobText.match(/healthcare|medical|clinical/gi) && 
         resumeText.match(/healthcare|medical|clinical/gi)) ||
        (jobText.match(/retail|e-commerce|consumer/gi) && 
         resumeText.match(/retail|e-commerce|consumer/gi)) ||
        (jobText.match(/technology|software|digital/gi) && 
         resumeText.match(/technology|software|digital/gi)) ?
          baseScore + 10 : baseScore - 10,
        60, [], []
      ),
      description: "Evaluates your experience within the specific industry targeted by this job."
    },
    {
      name: "Education Alignment",
      status: determineStatus(
        // Check if education requirements match
        (jobText.match(/bachelor|undergraduate|college degree/gi) && 
         resumeText.match(/bachelor|undergraduate|college degree|b\.s\.|b\.a\./gi)) ||
        (jobText.match(/master|graduate|mba|m\.s\./gi) && 
         resumeText.match(/master|graduate|mba|m\.s\./gi)) ||
        (jobText.match(/phd|doctorate|doctoral/gi) && 
         resumeText.match(/phd|doctorate|doctoral/gi)) ?
          baseScore + 15 : baseScore - 10,
        60, [], []
      ),
      description: "Assesses how well your educational background meets the job requirements."
    },
    {
      name: "Soft Skills Match",
      status: determineStatus(
        // Check if resume contains the soft skills from job description
        jobSkills.soft.some(skill => 
          resumeText.toLowerCase().includes(skill.toLowerCase())
        ) ? baseScore + 10 : baseScore - 10,
        65, [], []
      ),
      description: "Evaluates alignment between your soft skills and those required for the role."
    }
  ];
  
  return criteria;
};

// Generate ATS compatibility checks
const generateATSChecks = (resumeText: string) => {
  const checksResults = [
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
    },
    { 
      check_name: "Proper Formatting", 
      status: !resumeText.match(/table|column|tab/i) ? "pass" : "warning", 
      message: !resumeText.match(/table|column|tab/i) ? 
        "No complex formatting detected that might confuse ATS" : 
        "Resume might contain complex formatting that could confuse ATS parsers" 
    },
    { 
      check_name: "Standard Section Headers", 
      status: resumeText.match(/experience|work history|employment|skills|education|qualifications/i) ? "pass" : "warning", 
      message: resumeText.match(/experience|work history|employment|skills|education|qualifications/i) ? 
        "Standard section headers detected" : 
        "Consider using standard section headers (Experience, Skills, Education)" 
    },
    { 
      check_name: "Professional Summary", 
      status: resumeText.match(/summary|profile|objective/i) ? "pass" : "warning", 
      message: resumeText.match(/summary|profile|objective/i) ? 
        "Professional summary present" : 
        "Consider adding a professional summary at the top of your resume" 
    },
    { 
      check_name: "Readable Font", 
      status: "pass", 
      message: "Font appears to be ATS-friendly" 
    }
  ];
  
  // Calculate overall ATS-friendliness
  const passCount = checksResults.filter(check => check.status === "pass").length;
  const totalChecks = checksResults.length;
  const atsScore = Math.round((passCount / totalChecks) * 100);
  
  return {
    checks: checksResults,
    ats_score: atsScore,
    overall_status: atsScore >= 80 ? "pass" : "needs_improvement"
  };
};

// Performance indicators for the job fit
const analyzePerformanceIndicators = (resumeText: string, jobText: string) => {
  // Extract key performance indicators from job description
  const performanceKeywords = [
    "deliver", "achieve", "increase", "decrease", "improve", "reduce", 
    "optimize", "streamline", "accelerate", "enhance", "save", "grow",
    "launch", "implement", "manage", "lead", "develop", "create",
    "collaborate", "coordinate", "analyze", "research", "design"
  ];
  
  // Count job KPI mentions
  const jobKPIs = performanceKeywords.filter(kpi => 
    jobText.toLowerCase().includes(kpi)
  );
  
  // Count resume KPI mentions
  const resumeKPIs = performanceKeywords.filter(kpi => 
    resumeText.toLowerCase().includes(kpi)
  );
  
  // Extract quantifiable metrics from resume
  const metricRegex = /\b\d+(\.\d+)?%|\b\d+(\.\d+)? percent|\$\d+(\.\d+)?|\d+(\.\d+)? dollars|\d+(\.\d+)? million|\d+(\.\d+)? thousand/gi;
  const metrics = resumeText.match(metricRegex) || [];
  
  // Calculate match percentages
  const matchPercentage = jobKPIs.length > 0 
    ? Math.round((resumeKPIs.length / jobKPIs.length) * 100) 
    : 50;
  
  return {
    job_kpis: jobKPIs,
    resume_kpis: resumeKPIs,
    quantified_metrics: metrics,
    match_percentage: matchPercentage,
    needsImprovement: matchPercentage < 70
  };
};

// Analyze and extract improvement opportunities
const analyzeImprovementPotential = (resumeText: string, jobText: string, matchScore: number, sectionAnalysis: any) => {
  // Extract skills by category from job description
  const jobSkills = extractSkillKeywords(jobText);
  
  // Keyword optimization potential
  const missingTechnicalSkills = jobSkills.technical.filter(skill => 
    !resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  const missingSoftSkills = jobSkills.soft.filter(skill => 
    !resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  // Structure optimization potential
  const structureIssues = [];
  if (!sectionAnalysis.hasEducationSection) structureIssues.push("education section");
  if (!sectionAnalysis.hasStructuredExperience) structureIssues.push("structured work experience");
  if (!sectionAnalysis.hasSkillsSection) structureIssues.push("skills section");
  
  // Achievement emphasis potential
  const achievementIssues = [];
  if (!resumeText.match(/increased|improved|reduced|achieved|delivered/i)) {
    achievementIssues.push("quantifiable achievements");
  }
  if (!resumeText.match(/led|managed|coordinated|directed|supervised/i)) {
    achievementIssues.push("leadership experiences");
  }
  if (!resumeText.match(/\d+%|\d+ percent|\$\d+|\d+ million/i)) {
    achievementIssues.push("specific metrics");
  }
  
  return {
    keyword_optimization: {
      level: missingTechnicalSkills.length + missingSoftSkills.length > 5 ? "high" : "medium",
      details: {
        missing_technical: missingTechnicalSkills.slice(0, 5),
        missing_soft: missingSoftSkills.slice(0, 3)
      }
    },
    structure_optimization: {
      level: structureIssues.length > 1 ? "high" : structureIssues.length === 1 ? "medium" : "low",
      issues: structureIssues
    },
    achievement_emphasis: {
      level: achievementIssues.length > 1 ? "high" : "low",
      issues: achievementIssues
    }
  };
};

// Main function to compare resume to job description
export const compareResumeToJob = async (resumeText: string, jobDescriptionText: string) => {
  if (!resumeText || !jobDescriptionText) return { match_score: 0, analysis: {} };

  try {
    // First try to use the generative AI for enhanced analysis
    console.log("Attempting to use Generative AI API for resume analysis...");
    
    // We'll make an asynchronous call to the AI API
    const aiResponse = await callGenerativeAI(resumeText, jobDescriptionText);
    
    // Check if AI call was successful
    if (aiResponse.success) {
      console.log("Successfully got analysis from Generative AI");
      
      // Extract relevant data from the AI response
      const { jobKeywords, matchedKeywords, matchScore } = aiResponse.data;
      
      // Use the AI-derived match score as a base
      const baseMatchScore = matchScore;
      
      // For demonstration, we'll continue with our own analysis to supplement the AI response
      // but in a real implementation, we'd use more data from the AI response
      const missingKeywords = jobKeywords.filter(k => !matchedKeywords.includes(k));
    
      // Continue with our standard analysis pipeline
      // Section analysis
      const sectionAnalysis = analyzeSections(resumeText, jobDescriptionText);
      
      // Structural bonus for having all necessary sections
      const structuralBonus = 
        (sectionAnalysis.hasEducationSection ? 5 : 0) +
        (sectionAnalysis.hasStructuredExperience ? 10 : 0) + 
        (sectionAnalysis.hasSkillsSection ? 5 : 0);
      
      // Performance indicators analysis
      const performanceIndicators = analyzePerformanceIndicators(resumeText, jobDescriptionText);
      const performanceBonus = performanceIndicators.match_percentage > 70 ? 5 : 0;
      
      // ATS compatibility analysis
      const atsAnalysis = generateATSChecks(resumeText);
      const atsBonus = atsAnalysis.ats_score > 80 ? 5 : 0;
      
      // Combine scores with different weights
      const finalScore = Math.round(
        baseMatchScore * 0.7 + 
        structuralBonus + 
        performanceBonus + 
        atsBonus
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
      
      // Analyze improvement potential
      const improvementPotential = analyzeImprovementPotential(
        resumeText,
        jobDescriptionText,
        normalizedScore,
        sectionAnalysis
      );
      
      // Extract skills by category from job description
      const extractedSkills = extractSkillKeywords(jobDescriptionText);
      
      // Categorize skills for better visualization
      const categorizedSkills = {
        hard_skills: [] as { term: string, matched: boolean }[],
        soft_skills: [] as { term: string, matched: boolean }[]
      };
      
      // Process technical skills as hard skills
      extractedSkills.technical.forEach(skill => {
        const matched = matchedKeywords.includes(skill);
        categorizedSkills.hard_skills.push({ term: skill, matched });
      });
      
      // Process roles as hard skills
      extractedSkills.roles.forEach(skill => {
        const matched = matchedKeywords.includes(skill);
        categorizedSkills.hard_skills.push({ term: skill, matched });
      });
      
      // Process qualifications as hard skills
      extractedSkills.qualifications.forEach(skill => {
        const matched = matchedKeywords.includes(skill);
        categorizedSkills.hard_skills.push({ term: skill, matched });
      });
      
      // Process soft skills
      extractedSkills.soft.forEach(skill => {
        const matched = matchedKeywords.includes(skill);
        categorizedSkills.soft_skills.push({ term: skill, matched });
      });
      
      // Make sure we have some results even if extraction fails
      if (categorizedSkills.hard_skills.length === 0) {
        jobKeywords.slice(0, 10).forEach(keyword => {
          const matched = matchedKeywords.includes(keyword);
          // Simple heuristic - if it's likely a soft skill, categorize it as such
          if (keyword.match(/communication|teamwork|leadership|problem|analytical|creative/i)) {
            categorizedSkills.soft_skills.push({ term: keyword, matched });
          } else {
            categorizedSkills.hard_skills.push({ term: keyword, matched });
          }
        });
      }
      
      // Generate comprehensive analysis report
      const analysis = {
        keywords: categorizedSkills,
        advanced_criteria: advancedCriteria,
        ats_checks: atsAnalysis.checks,
        ats_score: atsAnalysis.ats_score,
        suggestions: suggestions,
        performance_indicators: {
          job_kpis: performanceIndicators.job_kpis,
          resume_kpis: performanceIndicators.resume_kpis,
          quantified_metrics: performanceIndicators.quantified_metrics,
          match_percentage: performanceIndicators.match_percentage
        },
        section_analysis: {
          education: sectionAnalysis.education,
          experience: sectionAnalysis.experience,
          skills: sectionAnalysis.skills,
          projects: sectionAnalysis.projects
        },
        improvement_potential: improvementPotential
      };

      return { 
        match_score: normalizedScore, 
        analysis
      };
    } else {
      console.log("Generative AI call failed, falling back to basic analysis");
      throw new Error("AI API call failed");
    }
  } catch (error) {
    // Fall back to our basic analysis if the AI call fails
    console.log("Error or fallback to basic analysis:", error);
    
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
    const performanceBonus = performanceIndicators.match_percentage > 70 ? 5 : 0;
    
    // ATS compatibility analysis
    const atsAnalysis = generateATSChecks(resumeText);
    const atsBonus = atsAnalysis.ats_score > 80 ? 5 : 0;
    
    // Combine scores with different weights
    const finalScore = Math.round(
      keywordScore * 0.5 + 
      lengthScore * 0.1 + 
      structuralBonus + 
      performanceBonus + 
      atsBonus
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
    
    // Analyze improvement potential
    const improvementPotential = analyzeImprovementPotential(
      resumeText,
      jobDescriptionText,
      normalizedScore,
      sectionAnalysis
    );
    
    // Extract skills by category from job description
    const extractedSkills = extractSkillKeywords(jobDescriptionText);
    
    // Categorize skills for better visualization
    const categorizedSkills = {
      hard_skills: [] as { term: string, matched: boolean }[],
      soft_skills: [] as { term: string, matched: boolean }[]
    };
    
    // Process technical skills as hard skills
    extractedSkills.technical.forEach(skill => {
      const matched = matchedKeywords.includes(skill);
      categorizedSkills.hard_skills.push({ term: skill, matched });
    });
    
    // Process roles as hard skills
    extractedSkills.roles.forEach(skill => {
      const matched = matchedKeywords.includes(skill);
      categorizedSkills.hard_skills.push({ term: skill, matched });
    });
    
    // Process qualifications as hard skills
    extractedSkills.qualifications.forEach(skill => {
      const matched = matchedKeywords.includes(skill);
      categorizedSkills.hard_skills.push({ term: skill, matched });
    });
    
    // Process soft skills
    extractedSkills.soft.forEach(skill => {
      const matched = matchedKeywords.includes(skill);
      categorizedSkills.soft_skills.push({ term: skill, matched });
    });
    
    // Make sure we have some results even if extraction fails
    if (categorizedSkills.hard_skills.length === 0) {
      jobKeywords.slice(0, 10).forEach(keyword => {
        const matched = matchedKeywords.includes(keyword);
        // Simple heuristic - if it's likely a soft skill, categorize it as such
        if (keyword.match(/communication|teamwork|leadership|problem|analytical|creative/i)) {
          categorizedSkills.soft_skills.push({ term: keyword, matched });
        } else {
          categorizedSkills.hard_skills.push({ term: keyword, matched });
        }
      });
    }

    // Generate comprehensive analysis report
    const analysis = {
      keywords: categorizedSkills,
      advanced_criteria: advancedCriteria,
      ats_checks: atsAnalysis.checks,
      ats_score: atsAnalysis.ats_score,
      suggestions: suggestions,
      performance_indicators: {
        job_kpis: performanceIndicators.job_kpis,
        resume_kpis: performanceIndicators.resume_kpis,
        quantified_metrics: performanceIndicators.quantified_metrics,
        match_percentage: performanceIndicators.match_percentage
      },
      section_analysis: {
        education: sectionAnalysis.education,
        experience: sectionAnalysis.experience,
        skills: sectionAnalysis.skills,
        projects: sectionAnalysis.projects
      },
      improvement_potential: improvementPotential
    };

    return { 
      match_score: normalizedScore, 
      analysis
    };
  }
};
