
/**
 * Utility functions for text processing
 */

/**
 * Extracts basic keywords from text
 */
export const extractBasicKeywords = (text: string): string[] => {
  if (!text) return [];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Remove common words
  const commonWords = [
    'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
    'his', 'from', 'they', 'she', 'will', 'would', 'there', 'their', 'what',
    'about', 'which', 'when', 'make', 'like', 'time', 'just', 'know', 'take',
    'person', 'year', 'your', 'good', 'some', 'could', 'them', 'than', 'then',
    'look', 'only', 'come', 'over', 'think', 'also', 'back', 'after', 'work',
    'first', 'well', 'even', 'want', 'because', 'these', 'give', 'most'
  ];
  
  // Return unique keywords not in common words
  return [...new Set(words.filter(word => !commonWords.includes(word)))];
};

/**
 * Extracts sections from resume text
 */
export const extractResumeSections = (text: string): Record<string, string> => {
  const sections: Record<string, string> = {
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: '',
    other: ''
  };
  
  // Simple section detection based on common section headings
  const lines = text.split('\n');
  let currentSection = 'other';
  
  for (const line of lines) {
    const lowercaseLine = line.toLowerCase().trim();
    
    if (lowercaseLine.includes('summary') || lowercaseLine.includes('objective') || lowercaseLine.includes('profile')) {
      currentSection = 'summary';
    } else if (lowercaseLine.includes('experience') || lowercaseLine.includes('employment') || lowercaseLine.includes('work history')) {
      currentSection = 'experience';
    } else if (lowercaseLine.includes('education') || lowercaseLine.includes('qualification') || lowercaseLine.includes('academic')) {
      currentSection = 'education';
    } else if (lowercaseLine.includes('skill') || lowercaseLine.includes('expertise') || lowercaseLine.includes('competencies')) {
      currentSection = 'skills';
    } else if (lowercaseLine.includes('project') || lowercaseLine.includes('portfolio')) {
      currentSection = 'projects';
    } else if (lowercaseLine.includes('certification') || lowercaseLine.includes('license') || lowercaseLine.includes('certificate')) {
      currentSection = 'certifications';
    }
    
    sections[currentSection] += line + '\n';
  }
  
  return sections;
};
