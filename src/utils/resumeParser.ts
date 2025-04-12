
import { ResumeSection } from '@/types/resume';

// Parse resume content into sections
export const parseContentIntoSections = (content: string): ResumeSection[] => {
  if (!content || typeof content !== 'string') {
    console.log("Creating default section due to empty content");
    return [{
      id: `section-${Date.now()}-0`,
      title: "Summary",
      content: "",
      type: "summary"
    }];
  }
  
  const lines = content.split('\n');
  const parsedSections: ResumeSection[] = [];
  let currentType = "summary";
  let currentTitle = "Summary";
  let currentContent = "";
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a section header
    const isSectionHeader = line.match(/^[A-Z][A-Za-z\s]*$/) && line.length < 30;
    
    if (isSectionHeader && currentContent) {
      // Save the current section
      parsedSections.push({
        id: `section-${Date.now()}-${parsedSections.length}`,
        title: currentTitle,
        content: currentContent.trim(),
        type: currentType
      });
      
      // Start a new section
      currentContent = "";
      currentTitle = line;
      
      // Determine section type based on title
      if (/contact|phone|email|address/i.test(line)) currentType = "contact";
      else if (/summary|objective|profile/i.test(line)) currentType = "summary";
      else if (/experience|work|employment|history/i.test(line)) currentType = "experience";
      else if (/education|academic|school|university|college/i.test(line)) currentType = "education";
      else if (/skill|expertise|competenc/i.test(line)) currentType = "skills";
      else if (/project/i.test(line)) currentType = "projects";
      else if (/certification|certificate/i.test(line)) currentType = "certifications";
      else if (/award|honor|achievement/i.test(line)) currentType = "awards";
      else if (/language/i.test(line)) currentType = "languages";
      else if (/interest|hobby|activit/i.test(line)) currentType = "interests";
      else if (/reference/i.test(line)) currentType = "references";
      else currentType = "custom";
    } else {
      // Add line to current content
      currentContent += line + '\n';
    }
  }
  
  // Add the last section
  if (currentContent.trim()) {
    parsedSections.push({
      id: `section-${Date.now()}-${parsedSections.length}`,
      title: currentTitle,
      content: currentContent.trim(),
      type: currentType
    });
  }
  
  // If no sections were created, create a default summary section
  if (parsedSections.length === 0) {
    console.log("Creating default section as no sections were parsed");
    parsedSections.push({
      id: `section-${Date.now()}-0`,
      title: "Summary",
      content: content.trim(),
      type: "summary"
    });
  }
  
  return parsedSections;
};

// Generate full resume content from sections
export const generateResumeContent = (sections: ResumeSection[]): string => {
  return sections.map(section => `${section.title}\n\n${section.content}`).join('\n\n');
};

// Create a default section if needed
export const createDefaultSection = (): ResumeSection => {
  return {
    id: `section-${Date.now()}-0`,
    title: "Summary",
    content: "",
    type: "summary"
  };
};
