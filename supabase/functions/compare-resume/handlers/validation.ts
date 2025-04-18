
import { UserRole } from "../ai/types.ts";

export function validateComparisonInput(
  resumeText?: string, 
  jobText?: string, 
  userRole?: string
): { valid: boolean; error?: string } {
  if (!resumeText || !jobText) {
    return { 
      valid: false, 
      error: "Both resume_text and job_description_text are required" 
    };
  }
  
  if (userRole && !isValidUserRole(userRole)) {
    return { 
      valid: false, 
      error: "user_role must be either 'job_seeker' or 'recruiter'" 
    };
  }
  
  return { valid: true };
}

export function isValidUserRole(role: string): role is UserRole {
  return ['job_seeker', 'recruiter'].includes(role);
}
