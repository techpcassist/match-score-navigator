
import { WorkExperienceEntry } from '../../../types';

// Common experience section headers to look for
export const experienceHeaders = [
  'experience', 'work experience', 'employment', 'work history', 
  'professional experience', 'career history', 'professional background',
  'relevant experience', 'work', 'job experience'
];

// Helper function to detect the experience section in a resume
export const detectExperienceSection = (lines: string[]): { inExperienceSection: boolean, startIndex: number } => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    
    // Check if this line looks like an experience section header
    if (experienceHeaders.some(header => line.includes(header))) {
      return { inExperienceSection: true, startIndex: i };
    }
  }
  
  return { inExperienceSection: false, startIndex: -1 };
};

// Helper function to parse dates from a string into start and end dates
export const parseDates = (datesString: string): { startDate: string, endDate: string } => {
  // Default values
  let startDate = '';
  let endDate = '';
  
  // Check if there's a date range separator
  if (datesString.includes(' - ') || datesString.includes('–') || datesString.includes('to')) {
    const separator = datesString.includes(' - ') ? ' - ' : 
                     datesString.includes('–') ? '–' : ' to ';
    const parts = datesString.split(separator);
    
    if (parts.length >= 2) {
      startDate = parts[0].trim();
      endDate = parts[1].trim();
    }
  } else {
    // If no separator is found, the whole string might be a single date
    startDate = datesString.trim();
  }
  
  return { startDate, endDate };
};

// Helper function to create a work experience entry from parsed data
export const parseEntry = (
  company: string, 
  title: string, 
  datesString: string, 
  description: string
): WorkExperienceEntry => {
  const { startDate, endDate } = parseDates(datesString);
  
  return {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    company,
    title,
    startDate,
    endDate,
    description,
    companyLocation: { country: '', state: '', city: '' },
    teamName: '',
    teamSize: 0,
    projectName: ''
  };
};
