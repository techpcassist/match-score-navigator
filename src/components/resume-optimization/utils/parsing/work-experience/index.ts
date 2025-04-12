
import { WorkExperienceEntry } from '../../../types';
import { parseFromAI } from './ai-parser';
import { parseFromExperienceSection } from './section-parser';
import { parseFromPatterns } from './pattern-parser';

// Main function that orchestrates the parsing process
export const parseResumeForWorkExperience = (resumeText: string, analysisReport?: any): WorkExperienceEntry[] => {
  // First try to use AI-parsed data if available
  const aiParsedEntries = parseFromAI(analysisReport);
  if (aiParsedEntries.length > 0) {
    console.log("Using AI-parsed work experience data:", aiParsedEntries);
    return aiParsedEntries;
  }
  
  // Next try to find and parse the experience section
  const sectionParsedEntries = parseFromExperienceSection(resumeText);
  if (sectionParsedEntries.length > 0) {
    console.log("Found and parsed experience section with entries:", sectionParsedEntries.length);
    return sectionParsedEntries;
  }
  
  // Finally, try to parse based on common patterns if no section was found
  const patternParsedEntries = parseFromPatterns(resumeText);
  if (patternParsedEntries.length > 0) {
    console.log("Found work experience entries from patterns:", patternParsedEntries.length);
    return patternParsedEntries;
  }
  
  // If still no entries and the resume isn't empty, provide a template entry
  if (resumeText.trim()) {
    console.log("Could not automatically detect work experience, providing a template entry");
    return [{
      id: `job-0`,
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      companyLocation: { country: '', state: '', city: '' },
      teamName: '',
      teamSize: 0,
      projectName: ''
    }];
  }
  
  return [];
};
