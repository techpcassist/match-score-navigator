
import { Education } from '../../types';

// Parse the resume text to extract education entries
export const parseResumeForEducation = (resumeText: string, analysisReport?: any): Education[] => {
  // If we have AI-parsed data from the analysis report, use it first
  if (analysisReport?.parsed_data?.education && analysisReport.parsed_data.education.length > 0) {
    console.log("Using AI-parsed education data:", analysisReport.parsed_data.education);
    
    // Map the AI parsed data to our Education type
    return analysisReport.parsed_data.education.map((entry: any, index: number) => ({
      id: entry.id || `edu-${index}`,
      degree: entry.degree || '',
      fieldOfStudy: entry.fieldOfStudy || '',
      university: entry.university || '',
      startDate: entry.startDate || '',
      endDate: entry.endDate || '',
      country: entry.country || '',
      state: entry.state || '',
      customUniversity: false
    }));
  }
  
  // Fallback to traditional parsing if no AI data is available
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
