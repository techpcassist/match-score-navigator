
export interface ComparisonRequest {
  resume_text: string;
  job_description_text: string;
  resume_file_path?: string;
  resume_id?: string;
  job_id?: string;
  user_role?: 'job_seeker' | 'recruiter';
  job_title?: string;
  company_name?: string;
}

export interface ComparisonResponse {
  resume_id: string;
  job_description_id: string;
  comparison_id?: string;
  match_score: number;
  report: any;
  resume_file_path?: string;
  warning?: string;
  user_role?: string;
  job_title?: string;
  company_name?: string;
}
