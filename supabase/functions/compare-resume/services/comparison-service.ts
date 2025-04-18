
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

    // Add a timeout for the entire comparison operation
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
      // Let it fall through to use the fallback
      isAIGenerated = false;
    }

    // If we don't have a result, generate a basic fallback
    if (!comparisonResult) {
      console.log("No comparison result, generating basic fallback");
      const { performBasicComparison } = await import("../analysis/basic-comparison.ts");
      comparisonResult = performBasicComparison(
        input.resumeText,
        input.jobDescriptionText,
        input.jobTitle,
        input.companyName
      );
      isAIGenerated = false;
    }

    try {
      // Store comparison result
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
      return {
        resumeId: resumeData.id,
        jobDescriptionId: jobData.id,
        matchScore: comparisonResult.match_score,
        report: comparisonResult.analysis,
        resumeFilePath: input.resumeFilePath,
        userRole: input.userRole || null,
        jobTitle: input.jobTitle || null,
        companyName: input.companyName || null,
        warning: comparisonError ? 
          `AI service error: ${comparisonError.message}` : 
          "Existing comparison was retrieved",
        isAIGenerated
      };
    }
  }
}
