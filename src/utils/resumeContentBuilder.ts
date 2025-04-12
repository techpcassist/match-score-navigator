
import { ResumeSection } from '@/types/resume';
import { parseContentIntoSections } from './resumeParser';

// Create proper resume sections from optimized data
export const createSectionsFromOptimizedData = (data: any): ResumeSection[] => {
  const timestamp = Date.now();
  const sections: ResumeSection[] = [];
  
  // Add contact information section if available
  if (data.contact_details) {
    let contactContent = '';
    if (data.contact_details.name) contactContent += `${data.contact_details.name}\n`;
    if (data.contact_details.email) contactContent += `${data.contact_details.email}\n`;
    if (data.contact_details.phone) contactContent += `${data.contact_details.phone}\n`;
    if (data.contact_details.location) contactContent += `${data.contact_details.location}\n`;
    if (data.contact_details.linkedin) contactContent += `${data.contact_details.linkedin}\n`;
    
    sections.push({
      id: `section-${timestamp}-${sections.length}`,
      title: "Contact Information",
      content: contactContent.trim(),
      type: "contact"
    });
  }
  
  // Add summary section if available
  if (data.summary) {
    sections.push({
      id: `section-${timestamp}-${sections.length}`,
      title: "Professional Summary",
      content: data.summary.trim(),
      type: "summary"
    });
  }
  
  // Add experiences section if available
  if (data.experiences && data.experiences.length > 0) {
    let experienceContent = '';
    
    data.experiences.forEach((exp: any) => {
      let jobHeader = '';
      if (exp.title) jobHeader += `${exp.title}`;
      if (exp.company) jobHeader += ` | ${exp.company}`;
      if (exp.startDate || exp.endDate) {
        jobHeader += ` | `;
        if (exp.startDate) jobHeader += `${exp.startDate}`;
        jobHeader += ` - `;
        if (exp.endDate) jobHeader += `${exp.endDate}`;
      }
      experienceContent += `${jobHeader}\n`;
      
      if (exp.description) {
        // Format bullet points
        const descLines = exp.description.split('\n');
        descLines.forEach((line: string) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('•')) {
            experienceContent += `${trimmedLine}\n`;
          } else if (trimmedLine) {
            experienceContent += `• ${trimmedLine}\n`;
          }
        });
      }
      
      experienceContent += '\n';
    });
    
    sections.push({
      id: `section-${timestamp}-${sections.length}`,
      title: "Work Experience",
      content: experienceContent.trim(),
      type: "experience"
    });
  }
  
  // Add education section if available
  if (data.education && data.education.length > 0) {
    let educationContent = '';
    
    data.education.forEach((edu: any) => {
      if (edu.degree) educationContent += `${edu.degree}`;
      if (edu.fieldOfStudy) educationContent += ` in ${edu.fieldOfStudy}`;
      educationContent += `\n`;
      
      if (edu.university) educationContent += `${edu.university}`;
      if (edu.startDate || edu.endDate) {
        educationContent += ` | `;
        if (edu.startDate) educationContent += `${edu.startDate}`;
        educationContent += ` - `;
        if (edu.endDate) educationContent += `${edu.endDate}`;
      }
      educationContent += `\n\n`;
    });
    
    sections.push({
      id: `section-${timestamp}-${sections.length}`,
      title: "Education",
      content: educationContent.trim(),
      type: "education"
    });
  }
  
  // Add skills section if available
  if (data.skills && data.skills.length > 0) {
    const skillsContent = data.skills.join(', ');
    
    sections.push({
      id: `section-${timestamp}-${sections.length}`,
      title: "Skills",
      content: skillsContent,
      type: "skills"
    });
  }
  
  return sections;
};

// Build a complete resume content from the optimized data
export const buildResumeContentFromData = (data: any): string => {
  let content = '';
  
  // Add contact information if available
  if (data.contact_details) {
    content += `Contact Information\n\n`;
    if (data.contact_details.name) content += `${data.contact_details.name}\n`;
    if (data.contact_details.email) content += `${data.contact_details.email}\n`;
    if (data.contact_details.phone) content += `${data.contact_details.phone}\n`;
    if (data.contact_details.location) content += `${data.contact_details.location}\n`;
    if (data.contact_details.linkedin) content += `${data.contact_details.linkedin}\n`;
    content += '\n';
  }
  
  // Add summary if available
  if (data.summary) {
    content += `Professional Summary\n\n${data.summary}\n\n`;
  }
  
  // Add experiences
  if (data.experiences && data.experiences.length > 0) {
    content += `Work Experience\n\n`;
    data.experiences.forEach((exp: any) => {
      if (exp.title) content += `${exp.title}`;
      if (exp.company) content += ` | ${exp.company}`;
      if (exp.startDate || exp.endDate) {
        content += ` | `;
        if (exp.startDate) content += `${exp.startDate}`;
        content += ` - `;
        if (exp.endDate) content += `${exp.endDate}`;
      }
      content += `\n`;
      
      if (exp.description) {
        // Split the description into bullet points if it contains any
        const descLines = exp.description.split('\n');
        descLines.forEach((line: string) => {
          if (line.trim().startsWith('•')) {
            content += `${line.trim()}\n`;
          } else if (line.trim()) {
            content += `• ${line.trim()}\n`;
          }
        });
      }
      content += '\n';
    });
  }
  
  // Add education
  if (data.education && data.education.length > 0) {
    content += `Education\n\n`;
    data.education.forEach((edu: any) => {
      if (edu.degree) content += `${edu.degree}`;
      if (edu.fieldOfStudy) content += ` in ${edu.fieldOfStudy}`;
      content += `\n`;
      if (edu.university) content += `${edu.university}`;
      if (edu.startDate || edu.endDate) {
        content += ` | `;
        if (edu.startDate) content += `${edu.startDate}`;
        content += ` - `;
        if (edu.endDate) content += `${edu.endDate}`;
      }
      content += `\n\n`;
    });
  }
  
  // Add skills if available
  if (data.skills && data.skills.length > 0) {
    content += `Skills\n\n${data.skills.join(', ')}\n\n`;
  }
  
  return content;
};
