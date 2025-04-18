
import React from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { ATSChecksSection } from './ATSChecksSection';
import { KeywordsSection } from './KeywordsSection';
import { AdvancedCriteriaSection } from './AdvancedCriteriaSection';
import { PerformanceSection } from './PerformanceSection';
import { StructureAnalysisSection } from './StructureAnalysisSection';
import { SuggestionsSection } from './SuggestionsSection';
import { ReportActions } from './ReportActions';
import { ReportData } from './types';
import { JobTitleCompanyForm } from './JobTitleCompanyForm';
import { ReportHeader } from './sections/header/ReportHeader';
import { JobTitleInfo } from './sections/job-info/JobTitleInfo';
import { useJobTitleForm } from '@/hooks/use-job-title-form';

interface ReportViewMainProps {
  matchScore: number;
  report: ReportData;
  userRole?: string;
  resumeText: string; 
  localResumeText: string;
  onParseResume: () => void;
  isMobile?: boolean;
}

const ReportViewMain: React.FC<ReportViewMainProps> = ({
  matchScore,
  report,
  userRole,
  resumeText,
  localResumeText,
  onParseResume,
  isMobile = false
}) => {
  const {
    showJobTitleForm,
    setShowJobTitleForm,
    jobTitleInfo,
    handleJobTitleSubmit
  } = useJobTitleForm(report);

  const validMatchScore = typeof matchScore === 'number' ? matchScore : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <ScoreDisplay matchScore={validMatchScore} />
      <ReportHeader userRole={userRole} />

      <JobTitleCompanyForm 
        open={showJobTitleForm}
        onClose={() => setShowJobTitleForm(false)}
        onSubmit={handleJobTitleSubmit}
        jobTitle={jobTitleInfo.jobTitle !== "unknown" ? jobTitleInfo.jobTitle : ""}
        companyName={jobTitleInfo.companyName !== "unknown" ? jobTitleInfo.companyName : ""}
      />

      {jobTitleInfo.jobTitle && jobTitleInfo.companyName && report.job_title_analysis && (
        <JobTitleInfo 
          jobTitle={jobTitleInfo.jobTitle}
          companyName={jobTitleInfo.companyName}
          analysis={report.job_title_analysis}
        />
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
