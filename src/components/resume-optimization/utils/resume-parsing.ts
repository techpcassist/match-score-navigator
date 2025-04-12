import { WorkExperienceEntry, Education, MissingSection, ProjectEntry } from '../types';

// Parse the resume text to extract work experience entries
export const parseResumeForWorkExperience = (resumeText: string): WorkExperienceEntry[] => {
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

// Parse the resume text to extract education entries
export const parseResumeForEducation = (resumeText: string): Education[] => {
  const lines = resumeText.split('\n');
  const entries: Education[] = [];
  let currentEntry: Partial<Education> = {};
  let isInEducationSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Simple section detection
    if (line.toLowerCase().includes('education') && line.length < 30) {
      isInEducationSection = true;
      continue;
    }
    
    if (isInEducationSection) {
      // Detect new education entry
      if (line.length > 0 && line.length < 100 && !line.startsWith('-') && !line.startsWith('•')) {
        // Save previous entry if exists
        if (currentEntry.degree || currentEntry.university) {
          entries.push({
            id: `edu-${entries.length}`,
            degree: currentEntry.degree || '',
            fieldOfStudy: currentEntry.fieldOfStudy || '',
            university: currentEntry.university || '',
            startDate: currentEntry.startDate || '',
            endDate: currentEntry.endDate || '',
            country: '',
            state: '',
            customUniversity: false
          });
        }
        
        // Try to extract university and degree
        if (line.includes(',')) {
          // Format: "University Name, Degree"
          const parts = line.split(',');
          currentEntry = {
            university: parts[0].trim(),
            degree: parts.slice(1).join(',').trim()
          };
        } else if (line.includes('-')) {
          // Format: "Degree - University Name"
          const parts = line.split('-');
          currentEntry = {
            degree: parts[0].trim(),
            university: parts.slice(1).join('-').trim()
          };
        } else {
          // Can't determine format, just use as university
          currentEntry = {
            university: line,
            degree: ''
          };
        }
      }
      // Detect dates
      else if (line.match(/\d{4}/)) {
        const dates = line.match(/\d{2}\/\d{4}|\d{4}|[A-Za-z]+\s+\d{4}|Present/g);
        if (dates && dates.length > 0) {
          currentEntry.startDate = dates[0];
          currentEntry.endDate = dates.length > 1 ? dates[1] : 'Present';
        }
      }
      // Detect field of study if not part of degree
      else if (line.length > 0 && line.length < 60 && !currentEntry.fieldOfStudy) {
        currentEntry.fieldOfStudy = line;
      }
      // If next section starts, break
      else if (line.length > 0 && line.length < 30 && 
        (line.toLowerCase().includes('experience') || 
         line.toLowerCase().includes('skills') || 
         line.toLowerCase().includes('projects'))) {
        isInEducationSection = false;
      }
    }
  }
  
  // Add the last entry
  if (currentEntry.degree || currentEntry.university) {
    entries.push({
      id: `edu-${entries.length}`,
      degree: currentEntry.degree || '',
      fieldOfStudy: currentEntry.fieldOfStudy || '',
      university: currentEntry.university || '',
      startDate: currentEntry.startDate || '',
      endDate: currentEntry.endDate || '',
      country: '',
      state: '',
      customUniversity: false
    });
  }
  
  // If no entries were found but education section exists, add an empty one
  if (entries.length === 0 && isInEducationSection) {
    entries.push({
      id: 'edu-0',
      degree: '',
      fieldOfStudy: '',
      university: '',
      startDate: '',
      endDate: '',
      country: '',
      state: '',
      customUniversity: false
    });
  }
  
  return entries;
};

// Identify missing sections based on the resume and job description
export const identifyMissingSections = (resumeText: string, jobDescriptionText: string, analysisReport: any): MissingSection[] => {
  const missingList: MissingSection[] = [];
  
  // Check for summary/objective
  if (!resumeText.toLowerCase().includes('summary') && 
      !resumeText.toLowerCase().includes('objective')) {
    missingList.push({
      id: 'missing-summary',
      name: 'Professional Summary',
      recommendation: 'Add a concise professional summary highlighting your key qualifications relevant to the job',
      example: `Professional Summary\n\nExperienced professional with skills in ${
        analysisReport.keywords?.hard_skills
          .filter((skill: any) => skill.matched)
          .slice(0, 3)
          .map((skill: any) => skill.term)
          .join(', ')
      }. Proven track record of delivering results in a fast-paced environment.`
    });
  }
  
  // Check for skills section
  if (!resumeText.toLowerCase().includes('skills') ||
      analysisReport.section_analysis?.skills === 'missing') {
    missingList.push({
      id: 'missing-skills',
      name: 'Skills',
      recommendation: 'Add a dedicated skills section to highlight your technical and soft skills',
      example: `Skills\n\n${
        analysisReport.keywords?.hard_skills
          .filter((skill: any) => skill.matched)
          .slice(0, 6)
          .map((skill: any) => skill.term)
          .join(' • ')
      }`
    });
  }
  
  // Check for projects section if applicable
  if (!resumeText.toLowerCase().includes('projects') && 
      jobDescriptionText.toLowerCase().includes('project')) {
    missingList.push({
      id: 'missing-projects',
      name: 'Projects',
      recommendation: 'Add a projects section to showcase relevant work that demonstrates your skills',
      example: 'Projects\n\nProject Name\nDeveloped a solution that [value proposition]. Utilized [key skills relevant to job description].'
    });
  }
  
  // Check for education
  if (!resumeText.toLowerCase().includes('education')) {
    missingList.push({
      id: 'missing-education',
      name: 'Education',
      recommendation: 'Add your educational background, including degrees, institutions, and graduation dates',
      example: 'Education\n\nBachelor of Science, Computer Science\nUniversity Name - Graduation Year'
    });
  }
  
  // Check for certifications if mentioned in job description
  if (!resumeText.toLowerCase().includes('certification') && 
      jobDescriptionText.toLowerCase().includes('certif')) {
    missingList.push({
      id: 'missing-certifications',
      name: 'Certifications',
      recommendation: 'Add any relevant certifications that align with the job requirements',
      example: 'Certifications\n\nCertification Name - Issuing Organization - Year'
    });
  }
  
  return missingList;
};

// Helper function to extract keyword suggestions from the analysis report
export const extractKeywordSuggestions = (analysisReport: any) => {
  return analysisReport.keywords?.hard_skills
    .filter((skill: any) => !skill.matched)
    .map((skill: any, index: number) => ({
      id: `keyword-${index}-${skill.term}`,
      type: 'keyword' as const,
      keyword: skill.term,
      originalText: '',
      suggestedText: `Consider adding the keyword "${skill.term}" to your skills section or incorporating it into your experience.`,
      section: 'skills'
    })) || [];
};

// Helper function to extract format suggestions based on ATS checks
export const extractFormatSuggestions = (analysisReport: any) => {
  return analysisReport.ats_checks
    ?.filter((check: any) => check.status !== 'pass')
    .map((check: any, index: number) => ({
      id: `format-${index}`,
      type: 'formatting' as const,
      issue: check.check_name,
      description: check.message,
      suggestedFix: `Apply ${check.check_name} formatting fix`
    })) || [];
};

// Helper function to create section suggestions from missing sections
export const createSectionSuggestions = (missingSections: MissingSection[]) => {
  return missingSections.map(section => ({
    id: `section-${section.id}`,
    type: 'section' as const,
    sectionName: section.name,
    suggestedText: section.example || `${section.name}\n\n[Add your ${section.name.toLowerCase()} here]`
  }));
};

// Helper function to generate missing info requirements
export const generateMissingInfo = (workExperienceEntries: WorkExperienceEntry[], analysisReport: any, resumeText: string) => {
  const missingInfo = [];
  
  // Check for missing dates in work experience
  const entriesWithMissingDates = workExperienceEntries.filter(entry => 
    !entry.startDate || entry.startDate.trim() === '' || 
    !entry.endDate || entry.endDate.trim() === ''
  );
  
  if (entriesWithMissingDates.length > 0) {
    entriesWithMissingDates.forEach(entry => {
      missingInfo.push({
        id: `missing-dates-${entry.id}`,
        type: 'dates' as const,
        description: `Your work experience at ${entry.company || 'a company'} as ${entry.title || 'a role'} is missing dates.`,
        fields: ['startDate', 'endDate'],
        section: 'experience'
      });
    });
  }
  
  // Check for missing metrics in achievements
  if (analysisReport.improvement_potential?.achievement_emphasis?.level !== 'low') {
    missingInfo.push({
      id: 'missing-metrics',
      type: 'metrics' as const,
      description: 'Your achievements could be strengthened with quantifiable metrics.',
      fields: ['metric'],
      section: 'experience'
    });
  }
  
  // Check for complete contact information
  if (analysisReport.ats_checks?.some((check: any) => 
    check.check_name === 'Contact Information' && check.status !== 'pass'
  )) {
    missingInfo.push({
      id: 'missing-contact',
      type: 'contact' as const,
      description: 'Your resume may be missing key contact information.',
      fields: ['phone', 'email', 'linkedin'],
      section: 'contact'
    });
  }
  
  // Check for education details if education section exists but may be incomplete
  if (resumeText.toLowerCase().includes('education') && 
      !resumeText.match(/degree|bachelor|master|phd|diploma/i)) {
    missingInfo.push({
      id: 'missing-education-details',
      type: 'education' as const,
      description: 'Your education section may be missing key details like degree name or graduation year.',
      fields: ['degree', 'institution', 'year'],
      section: 'education'
    });
  }
  
  return missingInfo;
};
