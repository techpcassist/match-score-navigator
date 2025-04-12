
import { parseWorkExperience } from './work-experience-parser';
import { parseEducation } from './education-parser';
import { parseSections } from './sections-parser';
import { generateSuggestions } from './suggestions-generator';

/**
 * Parse a resume text into structured data
 */
export async function parseResume(resumeText: string) {
  try {
    // Get resume sections
    const sections = parseSections(resumeText);
    
    // Parse work experience
    const experiences = await parseWorkExperience(resumeText, sections.workExperience);
    
    // Parse education
    const education = parseEducation(resumeText, sections.education);
    
    // Generate suggestions based on the parsed data
    const suggestions = generateSuggestions(resumeText, { experiences, education, sections });
    
    return {
      sections,
      experiences,
      education,
      suggestions,
      success: true
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    return {
      error: 'Failed to parse resume',
      success: false
    };
  }
}
