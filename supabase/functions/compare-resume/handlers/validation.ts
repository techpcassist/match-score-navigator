
import { UserRole } from "../ai/types.ts";

/**
 * Validates the input data for the resume comparison
 */
export function validateComparisonInput(
  resumeText?: string, 
  jobText?: string, 
  userRole?: string
): { valid: boolean; error?: string } {
  // Check required fields
  if (!resumeText || !jobText) {
    return { 
      valid: false, 
      error: "Both resume_text and job_description_text are required" 
    };
  }
  
  // Validate user role if provided
  if (userRole && !isValidUserRole(userRole)) {
    return { 
      valid: false, 
      error: "user_role must be either 'job_seeker' or 'recruiter'" 
    };
  }
  
  return { valid: true };
}

/**
 * Validates the user role
 */
export function isValidUserRole(role: string): role is UserRole {
  return ['job_seeker', 'recruiter'].includes(role);
}
