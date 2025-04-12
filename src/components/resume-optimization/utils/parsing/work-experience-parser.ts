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
  
  // Enhanced fallback to traditional parsing if no AI data is available
  const lines = resumeText.split('\n');
  const entries: WorkExperienceEntry[] = [];
  let inExperienceSection = false;
  let currentEntry: Partial<WorkExperienceEntry> = {};
  let experienceHeaders = [
    'experience', 'work experience', 'employment', 'work history', 
    'professional experience', 'career history', 'professional background',
    'relevant experience', 'work', 'job experience'
  ];
  
  // First pass: Try to find an experience section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    
    // Check if this line looks like an experience section header
    if (experienceHeaders.some(header => line.includes(header))) {
      inExperienceSection = true;
      
      // Start processing from the next line
      let j = i + 1;
      let currentCompany = '';
      let currentTitle = '';
      let currentDates = '';
      let currentDescription = '';
      let parsingBullets = false;
      
      // Process lines after the experience header
      while (j < lines.length) {
        const currentLine = lines[j].trim();
        // Exit if we hit another major section
        if (currentLine.toLowerCase().match(/^(education|skills|projects|certifications|awards|languages|interests|references)/i) 
            && currentLine.length < 30) {
          break;
        }
        
        // Skip empty lines
        if (currentLine === '') {
          j++;
          continue;
        }
        
        // Look for company patterns - often all caps or followed by location
        const isCompanyLine = /[A-Z]{2,}/.test(currentLine) || 
                             /[A-Z][a-z]+ (Inc|LLC|Ltd|Corporation|Company)/.test(currentLine) ||
                             /[A-Z][a-z]+ [A-Z][a-z]+, [A-Z]{2}/.test(currentLine);
        
        // Look for job title patterns
        const isTitleLine = /^(Senior|Junior|Lead|Principal|Chief|Head|Manager|Director|Engineer|Developer|Designer|Analyst|Consultant|Coordinator|Specialist|Supervisor|Assistant|Associate)/i.test(currentLine);
        
        // Look for date ranges
        const hasDatePattern = currentLine.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/i);
        
        // Look for bullet points
        const isBulletPoint = currentLine.startsWith('•') || 
                             currentLine.startsWith('-') || 
                             currentLine.startsWith('*') ||
                             /^\d+\./.test(currentLine);
        
        // When we find what looks like a company, start a new entry
        if (isCompanyLine && !isBulletPoint && currentLine.length < 60) {
          // If we were working on an entry, save it first
          if (currentCompany) {
            entries.push({
              id: `job-${entries.length}`,
              company: currentCompany,
              title: currentTitle,
              startDate: currentDates.split(' - ')[0] || '',
              endDate: currentDates.includes(' - ') ? currentDates.split(' - ')[1] : '',
              description: currentDescription,
              companyLocation: { country: '', state: '', city: '' },
              teamName: '',
              teamSize: 0,
              projectName: ''
            });
          }
          
          // Start a new entry
          currentCompany = currentLine;
          currentTitle = '';
          currentDates = '';
          currentDescription = '';
          parsingBullets = false;
        }
        // Title usually comes after company
        else if (isTitleLine && currentCompany && !currentTitle) {
          currentTitle = currentLine;
        }
        // Dates usually follow company and title
        else if (hasDatePattern && currentCompany) {
          currentDates = currentLine;
        }
        // If we encounter a bullet point, we're in the description
        else if (isBulletPoint) {
          parsingBullets = true;
          currentDescription += currentLine + '\n';
        }
        // If we're already parsing bullets, continue with the description
        else if (parsingBullets) {
          currentDescription += currentLine + '\n';
        }
        // If we have a company but not a title yet, this might be the title
        else if (currentCompany && !currentTitle) {
          currentTitle = currentLine;
        }
        // Otherwise, add to description if we have a company
        else if (currentCompany) {
          currentDescription += currentLine + '\n';
        }
        
        j++;
      }
      
      // Don't forget to add the last entry
      if (currentCompany) {
        entries.push({
          id: `job-${entries.length}`,
          company: currentCompany,
          title: currentTitle,
          startDate: currentDates.split(' - ')[0] || '',
          endDate: currentDates.includes(' - ') ? currentDates.split(' - ')[1] : '',
          description: currentDescription,
          companyLocation: { country: '', state: '', city: '' },
          teamName: '',
          teamSize: 0,
          projectName: ''
        });
      }
      
      // We've processed the experience section, so break out of the loop
      break;
    }
  }
  
  // If we couldn't find an explicit experience section, try based on patterns
  if (entries.length === 0) {
    // Look for patterns like Company Name (dates) or Job Title at Company
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (line === '') continue;
      
      // Match patterns like "Company Name (2018-2020)" or "Job Title at Company Name"
      const companyDatePattern = /^([A-Za-z0-9\s&.,']+)\s*(\(|\|)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{4}|Present)/i;
      const jobAtCompanyPattern = /^([A-Za-z\s]+)\s+(at|@|with)\s+([A-Za-z0-9\s&.,']+)/i;
      
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
        while (j < lines.length && lines[j].trim() !== '' && !companyDatePattern.test(lines[j]) && !jobAtCompanyPattern.test(lines[j])) {
          const bulletLine = lines[j].trim();
          if (bulletLine.startsWith('•') || bulletLine.startsWith('-') || bulletLine.startsWith('*')) {
            description += bulletLine + '\n';
          }
          j++;
        }
        
        // Add this entry if we found enough information
        if (company) {
          entries.push({
            id: `job-${entries.length}`,
            company,
            title,
            startDate,
            endDate,
            description,
            companyLocation: { country: '', state: '', city: '' },
            teamName: '',
            teamSize: 0,
            projectName: ''
          });
        }
        
        // Skip ahead to where we left off
        i = j - 1;
      }
    }
  }
  
  // If we still couldn't find any entries but the resume isn't empty
  if (entries.length === 0 && resumeText.trim()) {
    console.log("Could not automatically detect work experience, providing a template entry");
    
    // Create a default entry as a template
    entries.push({
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
    });
  }
  
  return entries;
};
