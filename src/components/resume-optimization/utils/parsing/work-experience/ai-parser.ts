
import { WorkExperienceEntry } from '../../../types';

// Parse experience data from AI analysis result
export const parseFromAI = (analysisReport?: any): WorkExperienceEntry[] => {
  if (analysisReport?.parsed_data?.work_experience && 
      Array.isArray(analysisReport.parsed_data.work_experience) && 
      analysisReport.parsed_data.work_experience.length > 0) {
    
    // Map the AI parsed data to our WorkExperienceEntry type
    return analysisReport.parsed_data.work_experience.map((entry: any, index: number) => ({
      id: entry.id || `job-${index}`,
      company: entry.company || '',
      title: entry.title || '',
      startDate: entry.startDate || '',
      endDate: entry.endDate || '',
      description: entry.description || '',
      companyLocation: {
        country: entry.companyLocation?.country || '',
        state: entry.companyLocation?.state || '',
        city: entry.companyLocation?.city || ''
      },
      teamName: entry.teamName || '',
      teamSize: entry.teamSize || 0,
      projectName: entry.projectName || ''
    }));
  }
  
  return [];
};
