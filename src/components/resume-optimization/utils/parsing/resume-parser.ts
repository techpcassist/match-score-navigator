
import { parseResumeForWorkExperience as parseWorkExperience } from './work-experience-parser';
import { parseResumeForEducation as parseEducation } from './education-parser';
import { identifyMissingSections as parseSections } from './sections-parser';
import { 
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions,
  generateMissingInfo
} from './suggestions-generator';

/**
 * Parse a resume text into structured data
 */
export async function parseResume(resumeText: string) {
  try {
    // Get resume sections
    const sections = { 
      workExperience: '',
      education: ''
    };
    
    // Parse work experience
    const experiences = await parseWorkExperience(resumeText);
    
    // Parse education
    const education = parseEducation(resumeText);
    
    // Generate suggestions based on the parsed data
    const suggestions = {
      keywords: extractKeywordSuggestions({}),
      formatting: extractFormatSuggestions({}),
      sections: createSectionSuggestions([]),
      missingInfo: generateMissingInfo(experiences, {}, resumeText)
    };
    
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
