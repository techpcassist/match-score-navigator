
/**
 * Interface for API responses
 */
export interface ApiResponse {
  status: number;
  body: any;
  headers: Record<string, string>;
}

/**
 * Interface for comparison request data
 */
export interface ComparisonRequest {
  resume_text: string;
  job_description_text: string;
  resume_file_path?: string;
  resume_id?: string;
  job_id?: string;
  user_role?: 'job_seeker' | 'recruiter';
}

/**
 * Interface for comparison response data
 */
export interface ComparisonResponse {
  resume_id: string;
  job_description_id: string;
  comparison_id?: string;
  match_score: number;
  report: any;
  resume_file_path?: string;
  user_role: string | null;
  warning?: string;
}
