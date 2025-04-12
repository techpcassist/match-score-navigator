import { WorkExperienceEntry } from '../../../types';
import { detectExperienceSection, parseEntry } from './parser-utils';

// Parse the resume by first finding the experience section
export const parseFromExperienceSection = (resumeText: string): WorkExperienceEntry[] => {
  const lines = resumeText.split('\n');
  const entries: WorkExperienceEntry[] = [];
  
  // Find the experience section
  const { inExperienceSection, startIndex } = detectExperienceSection(lines);
  
  if (!inExperienceSection) {
    return [];
  }
  
  // Start processing from the line after the section header
  let j = startIndex + 1;
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
                         /[A-Z][a-z]+ [A-Z][a-z]+, [A-Z]{2}/.test(currentLine) ||
                         /^[A-Z][a-z]* [A-Z][a-z]* ([A-Z][a-z]*)?$/.test(currentLine);
    
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
        entries.push(parseEntry(currentCompany, currentTitle, currentDates, currentDescription));
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
    entries.push(parseEntry(currentCompany, currentTitle, currentDates, currentDescription));
  }
  
  return entries;
};
