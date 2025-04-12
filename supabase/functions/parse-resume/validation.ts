
/**
 * Validates the parsed data against the original resume text to catch potential hallucinations
 */
export function validateParsedData(data: any, originalText: string): any {
  const validated = { ...data };
  
  // Validate work experiences
  if (validated.experiences && Array.isArray(validated.experiences)) {
    // Filter out potentially hallucinated companies
    validated.experiences = validated.experiences.filter((exp: any) => {
      if (!exp.company_name) return true; // Keep entries with null company names
      
      // Check if company name appears in the resume text (allowing for case insensitivity)
      const companyNameRegex = new RegExp(
        exp.company_name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 
        'i'
      );
      
      const companyFound = companyNameRegex.test(originalText);
      
      if (!companyFound) {
        console.log(`Potential hallucination detected: Company "${exp.company_name}" not found in resume text`);
      }
      
      return companyFound;
    });
    
    // Further validate job titles within legitimate companies
    validated.experiences = validated.experiences.map((exp: any) => {
      if (!exp.job_title) return exp;
      
      // Check if the job title appears in the text or is similar to phrases in the text
      const titleRegex = new RegExp(exp.job_title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      const titleFound = titleRegex.test(originalText);
      
      if (!titleFound) {
        console.log(`Potential hallucination detected: Job title "${exp.job_title}" for company "${exp.company_name}" not found in resume text`);
        return { ...exp, job_title: null }; // Nullify potentially hallucinated job title
      }
      
      return exp;
    });
  }
  
  // Validate education entries
  if (validated.education && Array.isArray(validated.education)) {
    validated.education = validated.education.filter((edu: any) => {
      // Check for institute or course name in the text
      const instituteName = edu.institute_name || '';
      const courseName = edu.course_certification_name || '';
      
      const instituteRegex = new RegExp(instituteName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      const courseRegex = new RegExp(courseName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      
      const instituteFound = instituteName ? instituteRegex.test(originalText) : false;
      const courseFound = courseName ? courseRegex.test(originalText) : false;
      
      const isValid = instituteFound || courseFound;
      
      if (!isValid && (instituteName || courseName)) {
        console.log(`Potential hallucination detected: Education entry "${instituteName || courseName}" not found in resume text`);
      }
      
      return isValid;
    });
  }
  
  return validated;
}
