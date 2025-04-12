
import { WorkExperienceEntry } from '../../../types';
import { parseEntry } from './parser-utils';

// Parse the resume based on common text patterns for work experience
export const parseFromPatterns = (resumeText: string): WorkExperienceEntry[] => {
  const lines = resumeText.split('\n');
  const entries: WorkExperienceEntry[] = [];
  
  // Look for patterns like "Company Name (dates)" or "Job Title at Company"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') continue;
    
    // Match patterns like "Company Name (2018-2020)" or "Job Title at Company Name"
    const companyDatePattern = /^([A-Za-z0-9\s&.,']+)\s*(\(|\|)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{4}|Present)/i;
    const jobAtCompanyPattern = /^([A-Za-z\s]+)\s+(at|@|with)\s+([A-Za-z0-9\s&.,']+)/i;
    const professionalExperiencePattern = /^(professional experience|experience|work experience)/i;
    
    // Skip if this is a section header
    if (professionalExperiencePattern.test(line)) {
      continue;
    }
    
    if (companyDatePattern.test(line) || jobAtCompanyPattern.test(line)) {
      let company = '';
      let title = '';
      let startDate = '';
      let endDate = '';
      let description = '';
      
      // Extract company and dates
      const companyDateMatch = line.match(companyDatePattern);
      if (companyDateMatch) {
        company = companyDateMatch[1].trim();
        // Extract dates from the pattern
        const datesPart = line.substring(line.indexOf(companyDateMatch[2]));
        const dateMatch = datesPart.match(/(\w+\s*\d{4})\s*(-|–|to)\s*(\w+\s*\d{4}|Present)/i);
        if (dateMatch) {
          startDate = dateMatch[1];
          endDate = dateMatch[3];
        }
      }
      
      // Extract job title and company
      const jobAtCompanyMatch = line.match(jobAtCompanyPattern);
      if (jobAtCompanyMatch) {
        title = jobAtCompanyMatch[1].trim();
        company = jobAtCompanyMatch[3].trim();
      }
      
      // Look for description in the lines that follow
      let j = i + 1;
      while (j < lines.length && 
             lines[j].trim() !== '' && 
             !companyDatePattern.test(lines[j]) && 
             !jobAtCompanyPattern.test(lines[j]) &&
             !professionalExperiencePattern.test(lines[j])) {
        const bulletLine = lines[j].trim();
        if (bulletLine.startsWith('•') || bulletLine.startsWith('-') || bulletLine.startsWith('*') || /^\d+\./.test(bulletLine)) {
          description += bulletLine + '\n';
        }
        j++;
      }
      
      // Add this entry if we found enough information
      if (company) {
        entries.push(parseEntry(company, title, `${startDate} - ${endDate}`, description));
      }
      
      // Skip ahead to where we left off
      i = j - 1;
    }
  }
  
  return entries;
};
