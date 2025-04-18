
/**
 * Interface for request body
 */
export interface ComparisonRequest {
  resume_text: string;
  job_description_text: string;
  resume_file_path?: string;
  resume_id?: string;
  job_id?: string;
  user_role?: string;
  job_title?: string;
  company_name?: string;
}

/**
 * Interface for response body
 */
export type ComparisonResponse = {
  resumeId: string;
  jobDescriptionId: string;
  comparisonId?: string;
  matchScore: number;
  report: any;
  resumeFilePath?: string;
  warning?: string;
  userRole?: string;
  jobTitle?: string;
  companyName?: string;
  isAIGenerated?: boolean;
  serviceStatus?: 'AI_GENERATED' | 'FALLBACK_GENERATED';
};
