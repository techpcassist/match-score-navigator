
// This file exists to maintain backward compatibility
// Import and re-export from the new modular parsing utilities
import {
  parseResumeForWorkExperience,
  parseResumeForEducation,
  identifyMissingSections,
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions,
  generateMissingInfo
} from './parsing';

export {
  parseResumeForWorkExperience,
  parseResumeForEducation,
  identifyMissingSections,
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions,
  generateMissingInfo
};
