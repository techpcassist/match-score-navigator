
import { 
  MissingSection,
  WorkExperienceEntry,
  Education,
} from '../types';
import { 
  parseResumeForWorkExperience,
  parseResumeForEducation,
  identifyMissingSections,
  extractKeywordSuggestions,
  extractFormatSuggestions,
  createSectionSuggestions,
} from '../utils/resume-parsing';

export const initializeWorkExperience = (resumeText: string, analysisReport: any): WorkExperienceEntry[] => {
  return parseResumeForWorkExperience(resumeText, analysisReport);
};

export const initializeEducation = (resumeText: string, analysisReport: any): Education[] => {
  return parseResumeForEducation(resumeText, analysisReport);
};

export const initializeMissingSections = (
  resumeText: string, 
  jobDescriptionText: string, 
  analysisReport: any
): MissingSection[] => {
  return identifyMissingSections(resumeText, jobDescriptionText, analysisReport);
};

export const initializeKeywordSuggestions = (analysisReport: any): any[] => {
  return extractKeywordSuggestions(analysisReport);
};

export const initializeFormatSuggestions = (analysisReport: any): any[] => {
  return extractFormatSuggestions(analysisReport);
};

export const initializeSectionSuggestions = (missingSections: MissingSection[]): any[] => {
  return createSectionSuggestions(missingSections);
};

export const checkAIParsing = (analysisReport: any): boolean => {
  const hasAIWorkExperience = analysisReport?.parsed_data?.work_experience?.length > 0;
  const hasAIEducation = analysisReport?.parsed_data?.education?.length > 0;
  
  return hasAIWorkExperience || hasAIEducation;
};
