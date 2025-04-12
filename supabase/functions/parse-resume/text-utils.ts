
/**
 * Attempts to recover data when JSON parsing fails
 */
export function attemptDataRecovery(rawText: string, originalResumeText: string): any {
  // Basic fallback object
  const fallbackData = {
    summary: "Failed to extract summary from resume.",
    experiences: [],
    education: [],
    contact_details: {
      full_name: null,
      email: extractEmail(originalResumeText),
      phone: extractPhone(originalResumeText),
      linkedin: null,
      whatsapp: null
    },
    skills: []
  };
  
  // Try to extract any JSON-like structures from the text
  const jsonMatch = rawText.match(/{[\s\S]*}/);
  if (jsonMatch) {
    try {
      const extractedJson = jsonMatch[0];
      return JSON.parse(extractedJson);
    } catch (error) {
      console.error("Failed to extract JSON from matched pattern:", error);
    }
  }
  
  // Look for individual data points in the original resume
  // Extract skills
  const skillsSection = extractSection(originalResumeText, ["skills", "technical skills", "competencies"]);
  if (skillsSection) {
    // Simple extraction of bullet points or comma-separated skills
    const skillsList = skillsSection.match(/[•\-*]?\s*([A-Za-z0-9#\+\s]+)(?:,|\n|$)/g);
    if (skillsList) {
      fallbackData.skills = skillsList
        .map(s => s.replace(/[•\-*]\s*/, '').trim())
        .filter(s => s.length > 0 && s.length < 50); // Filter out likely non-skills
    }
  }
  
  // Extremely basic extraction of what might be job experiences
  const experienceSection = extractSection(originalResumeText, 
    ["experience", "employment", "work history", "professional experience"]);
  
  if (experienceSection) {
    // Look for patterns that might indicate company names
    const possibleCompanies = experienceSection.match(/[A-Z][A-Za-z0-9\s,\.]+(?:Inc\.?|LLC|Ltd\.?|Corporation|Company|Co\.)/g);
    if (possibleCompanies && possibleCompanies.length > 0) {
      fallbackData.experiences = possibleCompanies.map(company => ({
        company_name: company.trim(),
        state: null,
        country: null,
        start_date: null,
        end_date: null,
        job_title: null,
        responsibilities_text: "",
        skills_tools_used: []
      }));
    }
  }
  
  return fallbackData;
}

/**
 * Extracts an email address from text
 */
export function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

/**
 * Extracts a phone number from text
 */
export function extractPhone(text: string): string | null {
  // Simple regex to match common phone formats
  const phoneRegex = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

/**
 * Extracts a specific section from resume text
 */
export function extractSection(text: string, sectionHeaders: string[]): string | null {
  const lines = text.split('\n');
  let inSection = false;
  let sectionContent = "";
  let sectionEndPatterns: RegExp[] = [];
  
  // Common section headers that would indicate the end of the current section
  const commonSectionHeaders = [
    "education", "experience", "skills", "projects", "certifications", 
    "awards", "publications", "languages", "interests", "references"
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    
    // Check if this line starts a section we're looking for
    if (!inSection) {
      for (const header of sectionHeaders) {
        if (line.includes(header.toLowerCase()) && line.length < 50) {
          inSection = true;
          
          // Create patterns for section endings (other major sections)
          sectionEndPatterns = commonSectionHeaders
            .filter(h => !sectionHeaders.includes(h))
            .map(h => new RegExp(`^\\s*${h}\\s*:?$`, 'i'));
            
          break;
        }
      }
    } 
    // If we're in the target section, collect content until we hit another section
    else {
      // Check if we've reached the end of this section (start of another section)
      const isSectionEnd = sectionEndPatterns.some(pattern => pattern.test(line));
      
      if (isSectionEnd) {
        break;
      }
      
      sectionContent += line + '\n';
    }
  }
  
  return inSection ? sectionContent.trim() : null;
}
