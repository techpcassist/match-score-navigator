
/**
 * Generic interface for AI analysis response
 */
export interface AIAnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Interface for user role types used in analysis requests
 */
export type UserRole = 'job_seeker' | 'recruiter' | undefined;
