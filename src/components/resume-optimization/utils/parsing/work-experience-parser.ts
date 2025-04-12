
import { WorkExperienceEntry } from '../../types';

// Parse the resume text to extract work experience entries
export const parseResumeForWorkExperience = (resumeText: string, analysisReport?: any): WorkExperienceEntry[] => {
  // If we have AI-parsed data from the analysis report, use it first
  if (analysisReport?.parsed_data?.work_experience && 
      Array.isArray(analysisReport.parsed_data.work_experience) && 
      analysisReport.parsed_data.work_experience.length > 0) {
    console.log("Using AI-parsed work experience data:", analysisReport.parsed_data.work_experience);
    
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
  
  // Fallback to traditional parsing if no AI data is available
  const lines = resumeText.split('\n');
  const entries: WorkExperienceEntry[] = [];
  let currentEntry: Partial<WorkExperienceEntry> = {};
  let isInExperienceSection = false;
  let experienceBlock = '';
  
  // First pass: Identify if there's an experience section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect experience section headers using more flexible matching
    if (
      line.toLowerCase().includes('experience') || 
      line.toLowerCase().includes('employment') || 
      line.toLowerCase().includes('work history') ||
      (line.toLowerCase().includes('work') && line.length < 30)
    ) {
      isInExperienceSection = true;
      experienceBlock = lines.slice(i).join('\n');
      break;
    }
  }

  // If we couldn't find an explicit experience section, try to infer from content
  if (!isInExperienceSection && resumeText.length > 0) {
    // Look for date patterns that typically appear in work experience
    const datePatterns = resumeText.match(/\d{4}\s*[-–—]\s*(present|current|\d{4})/gi);
    if (datePatterns && datePatterns.length > 0) {
      isInExperienceSection = true;
      experienceBlock = resumeText;
    }
  }
  
  // If we found an experience section, extract entries
  if (isInExperienceSection && experienceBlock) {
    const lines = experienceBlock.split('\n');
    let companyLine = -1;
    let titleLine = -1;
    let dateLine = -1;
    let descriptionStartLine = -1;
    
    // Process the experience block
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length === 0) continue;
      
      // Detect patterns for company, title, and dates
      const hasDatePattern = line.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/i);
      const isPossibleCompany = line.length > 0 && line.length < 60 && !line.startsWith('-') && !line.startsWith('•');
      const isPossibleTitle = line.length > 0 && line.length < 60 && 
        (line.toLowerCase().includes('manager') || 
         line.toLowerCase().includes('engineer') || 
         line.toLowerCase().includes('developer') ||
         line.toLowerCase().includes('analyst') ||
         line.toLowerCase().includes('specialist') ||
         line.toLowerCase().includes('director') ||
         line.toLowerCase().includes('assistant') ||
         line.toLowerCase().includes('coordinator'));
      
      // Prioritize extraction based on line content
      if (hasDatePattern) {
        // If we have a date pattern, it's likely a date line
        if (currentEntry.company || currentEntry.title) {
          // If we already have some entry data, this is the date for the current entry
          dateLine = i;
          const dates = line.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/gi);
          if (dates && dates.length > 0) {
            currentEntry.startDate = dates[0];
            currentEntry.endDate = dates.length > 1 ? dates[1] : 'Present';
          }
          
          // The next lines will be description
          descriptionStartLine = i + 1;
        } else {
          // If we don't have company/title yet, we might be starting a new entry
          // This could be a date line for a new entry
          dateLine = i;
        }
      } else if (isPossibleCompany && !currentEntry.company) {
        // If no company yet and this line looks like a company name
        if (currentEntry.title || currentEntry.startDate) {
          // If we already have other entry data, save it and start a new one
          if (Object.keys(currentEntry).length > 0) {
            entries.push({
              id: `job-${entries.length}`,
              company: currentEntry.company || '',
              title: currentEntry.title || '',
              startDate: currentEntry.startDate || '',
              endDate: currentEntry.endDate || '',
              description: currentEntry.description || '',
              companyLocation: { country: '', state: '', city: '' },
              teamName: '',
              teamSize: 0,
              projectName: ''
            });
          }
          
          // Start a new entry
          currentEntry = { company: line };
          companyLine = i;
        } else {
          // This is the company for the current entry
          currentEntry.company = line;
          companyLine = i;
        }
      } else if (isPossibleTitle && !currentEntry.title && currentEntry.company) {
        // If we have a company but no title, and this looks like a title
        currentEntry.title = line;
        titleLine = i;
      } else if (descriptionStartLine >= 0 && i >= descriptionStartLine) {
        // This is part of the description
        currentEntry.description = (currentEntry.description || '') + line + '\n';
      } else if (Object.keys(currentEntry).length > 0 && 
                 line.startsWith('-') || line.startsWith('•') || 
                 line.startsWith('*') || /^\d+\./.test(line)) {
        // This is likely a bullet point for the description
        currentEntry.description = (currentEntry.description || '') + line + '\n';
      }
      
      // If we've collected enough data for an entry and we hit what seems like a new entry,
      // save the current entry and start a new one
      if (Object.keys(currentEntry).length > 0 && 
          (i > titleLine + 5 || i > dateLine + 10) && 
          isPossibleCompany && line !== currentEntry.company && !line.startsWith('-') && !line.startsWith('•')) {
        
        // Check if we have enough data to consider this a complete entry
        if (currentEntry.company || currentEntry.title) {
          entries.push({
            id: `job-${entries.length}`,
            company: currentEntry.company || '',
            title: currentEntry.title || '',
            startDate: currentEntry.startDate || '',
            endDate: currentEntry.endDate || '',
            description: currentEntry.description || '',
            companyLocation: { country: '', state: '', city: '' },
            teamName: '',
            teamSize: 0,
            projectName: ''
          });
        }
        
        // Start a new entry
        currentEntry = { company: line };
        companyLine = i;
        titleLine = -1;
        dateLine = -1;
        descriptionStartLine = -1;
      }
    }
    
    // Add the last entry if it exists
    if ((currentEntry.company || currentEntry.title) && Object.keys(currentEntry).length > 0) {
      entries.push({
        id: `job-${entries.length}`,
        company: currentEntry.company || '',
        title: currentEntry.title || '',
        startDate: currentEntry.startDate || '',
        endDate: currentEntry.endDate || '',
        description: currentEntry.description || '',
        companyLocation: { country: '', state: '', city: '' },
        teamName: '',
        teamSize: 0,
        projectName: ''
      });
    }
  }
  
  // Fallback: If we still couldn't extract any entries but we found an experience section
  if (entries.length === 0 && isInExperienceSection) {
    // Create a default entry to allow the user to fill in details
    entries.push({
      id: `job-0`,
      company: 'Company Name',
      title: 'Job Title',
      startDate: '',
      endDate: '',
      description: '',
      companyLocation: { country: '', state: '', city: '' },
      teamName: '',
      teamSize: 0,
      projectName: ''
    });
  }
  
  return entries;
};
