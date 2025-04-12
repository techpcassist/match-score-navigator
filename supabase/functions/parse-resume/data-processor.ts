
/**
 * Post-processes the parsed resume data to handle edge cases and normalize formats
 */
export function postProcessResumeData(data: any): any {
  // Create a deep copy to avoid modifying the original
  const processed = JSON.parse(JSON.stringify(data));
  
  // Normalize experiences array
  if (processed.experiences && Array.isArray(processed.experiences)) {
    processed.experiences = processed.experiences.map((exp: any) => {
      // Ensure job title is never an empty string, convert to null
      if (exp.job_title === "") exp.job_title = null;
      
      // Normalize date formats when possible
      if (exp.start_date) exp.start_date = normalizeDate(exp.start_date);
      if (exp.end_date) exp.end_date = normalizeDate(exp.end_date);
      
      // Ensure skills_tools_used is always an array
      if (exp.skills_tools_used && !Array.isArray(exp.skills_tools_used)) {
        if (typeof exp.skills_tools_used === 'string') {
          exp.skills_tools_used = exp.skills_tools_used.split(/,\s*/).filter(Boolean);
        } else {
          exp.skills_tools_used = [];
        }
      }
      
      return exp;
    });
  }
  
  // Normalize education array
  if (processed.education && Array.isArray(processed.education)) {
    processed.education = processed.education.map((edu: any) => {
      // Normalize date formats when possible
      if (edu.start_date) edu.start_date = normalizeDate(edu.start_date);
      if (edu.end_date) edu.end_date = normalizeDate(edu.end_date);
      
      return edu;
    });
  }
  
  // Ensure skills is always an array of strings
  if (processed.skills) {
    if (!Array.isArray(processed.skills)) {
      if (typeof processed.skills === 'string') {
        processed.skills = processed.skills.split(/,\s*/).filter(Boolean);
      } else {
        processed.skills = [];
      }
    }
    
    // Remove duplicates and normalize casing
    const skillsMap = new Map();
    processed.skills.forEach((skill: string) => {
      const normalizedSkill = skill.trim();
      if (normalizedSkill) {
        skillsMap.set(normalizedSkill.toLowerCase(), normalizedSkill);
      }
    });
    processed.skills = Array.from(skillsMap.values());
  }
  
  return processed;
}

/**
 * Normalizes date strings to a consistent format when possible
 */
export function normalizeDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  
  // If it already looks standardized, return it
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i.test(dateStr)) {
    return dateStr;
  }
  
  // If it's present/current
  if (/present|current|now|till date/i.test(dateStr)) {
    return "Present";
  }
  
  // Attempt to parse more complex date formats
  // This is a simplistic approach - a more robust solution would use a library like date-fns
  
  // For now, just return the original if we can't easily normalize it
  return dateStr;
}
