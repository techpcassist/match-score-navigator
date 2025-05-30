
import { compareResumeToJob } from "../analysis/ai-comparison.ts";
import { UserRole } from "../ai/types.ts";
import { DatabaseHandler } from "../database.ts";
import { processResumeAndJobData } from "../handlers/db-operations.ts";

export interface ComparisonInput {
  resumeText: string;
  jobDescriptionText: string;
  resumeFilePath?: string | null;
  resumeId?: string;
  jobId?: string;
  userRole?: UserRole;
  jobTitle?: string;
  companyName?: string;
}

export interface ComparisonResult {
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
  isAIGenerated: boolean;
}

export class ComparisonService {
  constructor(private dbHandler: DatabaseHandler) {}

  async performComparison(input: ComparisonInput): Promise<ComparisonResult> {
    // Process resume and job data
    const { resumeData, jobData } = await processResumeAndJobData(
      this.dbHandler,
      input.resumeText,
      input.jobDescriptionText,
      input.resumeId,
      input.jobId,
      input.resumeFilePath
    );

    // Perform AI comparison with timeout protection
    console.log("Calling compareResumeToJob with enhanced error handling");
    console.log("Using user role:", input.userRole || "not specified");
    console.log("Job title:", input.jobTitle || "not specified");
    console.log("Company name:", input.companyName || "not specified");

    let isAIGenerated = true;
    let comparisonResult;
    let comparisonError;
    
    try {
      // Create a promise with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Comparison timed out after 40 seconds")), 40000);
      });
      
      // Race the comparison with the timeout
      comparisonResult = await Promise.race([
        compareResumeToJob(
          input.resumeText,
          input.jobDescriptionText,
          input.userRole,
          input.jobTitle,
          input.companyName
        ),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof compareResumeToJob>>;
    } catch (error) {
      console.error("Error in comparison process:", error);
      comparisonError = error;
      isAIGenerated = false;
      throw error; // Let it propagate up to trigger a retry
    }

    // Ensure we have a valid AI-generated result
    if (!comparisonResult || !isAIGenerated) {
      console.error("No valid AI comparison result");
      throw new Error("Failed to get AI analysis");
    }

    try {
      // Store comparison result with the exact score from AI
      const comparisonData = await this.dbHandler.storeComparison(
        resumeData.id,
        jobData.id,
        comparisonResult.match_score,
        comparisonResult.analysis
      );

      return {
        resumeId: resumeData.id,
        jobDescriptionId: jobData.id,
        comparisonId: comparisonData.id,
        matchScore: comparisonResult.match_score,
        report: comparisonResult.analysis,
        resumeFilePath: input.resumeFilePath,
        userRole: input.userRole || null,
        jobTitle: input.jobTitle || null,
        companyName: input.companyName || null,
        isAIGenerated
      };
    } catch (dbError) {
      console.error("Database error in compare-resume function:", dbError);
      throw dbError; // Propagate the error to trigger a retry
    }
  }
}
