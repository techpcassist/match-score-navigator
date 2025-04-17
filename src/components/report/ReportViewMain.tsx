
import React, { useState, useEffect } from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { TrophyIcon } from 'lucide-react';
import { ATSChecksSection } from './ATSChecksSection';
import { KeywordsSection } from './KeywordsSection';
import { AdvancedCriteriaSection } from './AdvancedCriteriaSection';
import { PerformanceSection } from './PerformanceSection';
import { StructureAnalysisSection } from './StructureAnalysisSection';
import { SuggestionsSection } from './SuggestionsSection';
import { ReportActions } from './ReportActions';
import { ReportData } from './types';
import { JobTitleCompanyForm } from './JobTitleCompanyForm';
import { toast } from '@/hooks/use-toast';

interface ReportViewMainProps {
  matchScore: number;
  report: ReportData;
  userRole?: string;
  resumeText: string; 
  localResumeText: string;
  onParseResume: () => void;
  isMobile?: boolean;
}

export const ReportViewMain: React.FC<ReportViewMainProps> = ({
  matchScore,
  report,
  userRole,
  resumeText,
  localResumeText,
  onParseResume,
  isMobile = false
}) => {
  const [showJobTitleForm, setShowJobTitleForm] = useState(false);
  const [jobTitleInfo, setJobTitleInfo] = useState({
    jobTitle: '',
    companyName: ''
  });

  // Check if job title and company name are available in the report
  useEffect(() => {
    if (report && report.job_title_analysis) {
      const { job_title, company_name } = report.job_title_analysis;
      
      if (job_title === "unknown" || company_name === "unknown") {
        setShowJobTitleForm(true);
      } else {
        setJobTitleInfo({
          jobTitle: job_title,
          companyName: company_name
        });
      }
    }
  }, [report]);

  const handleJobTitleSubmit = (jobTitle: string, companyName: string) => {
    setJobTitleInfo({ jobTitle, companyName });
    toast({
      title: "Information Updated",
      description: "Job title and company name have been added to your analysis.",
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <ScoreDisplay matchScore={matchScore} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 md:mb-0">Analysis Report</h2>
        {userRole === "recruiter" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <TrophyIcon className="mr-2 h-4 w-4" />
            Recruiter View
          </div>
        )}
      </div>

      {/* Job Title Company Form */}
      <JobTitleCompanyForm 
        open={showJobTitleForm}
        onClose={() => setShowJobTitleForm(false)}
        onSubmit={handleJobTitleSubmit}
        jobTitle={jobTitleInfo.jobTitle !== "unknown" ? jobTitleInfo.jobTitle : ""}
        companyName={jobTitleInfo.companyName !== "unknown" ? jobTitleInfo.companyName : ""}
      />

      {/* Job Title Analysis Display - only show if we have both job title and company name */}
      {jobTitleInfo.jobTitle && jobTitleInfo.companyName && report.job_title_analysis && (
        <div className="bg-muted/30 p-4 rounded-md border">
          <h3 className="text-lg font-medium mb-2">Job Role Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Job Title: <span className="font-normal">{jobTitleInfo.jobTitle}</span></p>
              <p className="text-sm font-medium">Company: <span className="font-normal">{jobTitleInfo.companyName}</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                This analysis provides insights into how your qualifications align with this specific role
              </p>
            </div>
          </div>
        </div>
      )}

      <ATSChecksSection checks={report.ats_checks} />
      <KeywordsSection 
        hardSkills={report.keywords.hard_skills} 
        softSkills={report.keywords.soft_skills} 
        isMobile={isMobile}
      />
      <AdvancedCriteriaSection criteria={report.advanced_criteria || []} />
      <PerformanceSection performanceIndicators={report.performance_indicators || {
        job_kpis: [],
        resume_kpis: [],
        match_percentage: 0
      }} />
      <StructureAnalysisSection 
        sectionAnalysis={report.section_analysis || {
          education: '',
          experience: '',
          skills: '',
          projects: ''
        }}
        improvementPotential={report.improvement_potential}
      />
      <SuggestionsSection suggestions={report.suggestions} />
      
      <ReportActions 
        resumeText={resumeText} 
        localResumeText={localResumeText} 
        onParseResume={onParseResume} 
        isMobile={isMobile}
      />
    </div>
  );
};

export default ReportViewMain;
