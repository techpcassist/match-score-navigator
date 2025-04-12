
import { MissingSection } from '../../types';

// Function to be used by resume-parser.ts
export const parseSections = (resumeText: string) => {
  // This is a simplified implementation that just returns an object with empty fields
  // In a real implementation, this would parse the text to find sections
  return {
    workExperience: '',
    education: ''
  };
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
