
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

    // Perform AI comparison
    console.log("Calling compareResumeToJob with Google Generative AI integration");
    console.log("Using user role:", input.userRole || "not specified");
    console.log("Job title:", input.jobTitle || "not specified");
    console.log("Company name:", input.companyName || "not specified");

    const comparisonResult = await compareResumeToJob(
      input.resumeText,
      input.jobDescriptionText,
      input.userRole,
      input.jobTitle,
      input.companyName
    );

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
        companyName: input.companyName || null
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
        warning: "Existing comparison was retrieved"
      };
    }
  }
}
