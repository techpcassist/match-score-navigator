
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Interface for resume data storage
export interface ResumeData {
  id: string;
  resume_text: string;
  file_path: string | null;
}

// Interface for job description data storage
export interface JobData {
  id: string;
  description_text: string;
}

// Interface for comparison data storage
export interface ComparisonData {
  id: string;
  resume_id: string;
  job_description_id: string;
  match_score: number;
  analysis_report: any;
}

// Database operations handler
export class DatabaseHandler {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Find existing resume by text content
  async findResumeByText(resumeText: string): Promise<ResumeData | null> {
    const { data, error } = await this.supabase
      .from('resumes')
      .select('*')
      .eq('resume_text', resumeText)
      .maybeSingle();
    
    if (error) {
      console.error('Error finding resume:', error);
      return null;
    }
    
    return data;
  }

  // Find existing job description by text content
  async findJobByText(jobText: string): Promise<JobData | null> {
    const { data, error } = await this.supabase
      .from('job_descriptions')
      .select('*')
      .eq('description_text', jobText)
      .maybeSingle();
    
    if (error) {
      console.error('Error finding job description:', error);
      return null;
    }
    
    return data;
  }

  // Get resume by ID
  async getResumeById(id: string): Promise<ResumeData | null> {
    const { data, error } = await this.supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error || !data) {
      console.error('Error getting resume by ID:', error);
      return null;
    }
    
    return data;
  }

  // Get job description by ID
  async getJobById(id: string): Promise<JobData | null> {
    const { data, error } = await this.supabase
      .from('job_descriptions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error || !data) {
      console.error('Error getting job description by ID:', error);
      return null;
    }
    
    return data;
  }

  // Store resume in database
  async storeResume(resumeText: string, filePath: string | null): Promise<ResumeData> {
    // We need to cast the result to handle the type mismatch between runtime and TypeScript types
    const { data, error } = await this.supabase
      .from('resumes')
      .insert([{ 
        resume_text: resumeText,
        file_path: filePath || null 
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    // Add file_path to the returned data if it's not included in the type
    return {
      id: data.id,
      resume_text: data.resume_text,
      file_path: filePath
    };
  }

  // Store job description in database
  async storeJobDescription(jobText: string): Promise<JobData> {
    const { data, error } = await this.supabase
      .from('job_descriptions')
      .insert([{ description_text: jobText }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  // Store comparison result in database
  async storeComparison(
    resumeId: string, 
    jobDescriptionId: string, 
    matchScore: number, 
    analysisReport: any
  ): Promise<ComparisonData> {
    try {
      const { data, error } = await this.supabase
        .from('comparisons')
        .insert([{ 
          resume_id: resumeId,
          job_description_id: jobDescriptionId,
          match_score: matchScore,
          analysis_report: analysisReport
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Check if this is a duplicate key error
      if (error.code === '23505') {
        // Get the existing comparison instead
        const { data, error: fetchError } = await this.supabase
          .from('comparisons')
          .select('*')
          .eq('resume_id', resumeId)
          .eq('job_description_id', jobDescriptionId)
          .single();
        
        if (fetchError) throw fetchError;
        return data;
      }
      
      throw error;
    }
  }
}
