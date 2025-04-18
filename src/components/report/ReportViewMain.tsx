
import React, { useState, useEffect } from 'react';
import { ScoreDisplay } from './ScoreDisplay';
import { TrophyIcon, Building, Briefcase } from 'lucide-react';
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

const ReportViewMain: React.FC<ReportViewMainProps> = ({
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

  // Log the received match score for debugging
  useEffect(() => {
    console.log('ReportViewMain received matchScore:', matchScore);
  }, [matchScore]);

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
    setShowJobTitleForm(false);
    toast({
      title: "Information Updated",
      description: "Job title and company name have been added to your analysis.",
    });
  };

  // Ensure match score is a valid number
  const validMatchScore = typeof matchScore === 'number' ? matchScore : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <ScoreDisplay matchScore={validMatchScore} />

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
        <div className="bg-muted/30 p-4 rounded-md border space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h3 className="text-lg font-medium">Hiring Manager's Perspective</h3>
            <div className="flex flex-col md:flex-row gap-3 mt-2 md:mt-0">
              <div className="flex items-center text-sm">
                <Briefcase className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">{jobTitleInfo.jobTitle}</span>
              </div>
              <div className="flex items-center text-sm">
                <Building className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">{jobTitleInfo.companyName}</span>
              </div>
            </div>
          </div>
          
          {report.job_title_analysis.key_parameters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">Core Technical Skills</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    {report.job_title_analysis.key_parameters.core_technical_skills?.map((skill: string, index: number) => (
                      <li key={index} className="text-muted-foreground">• {skill}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold">Essential Soft Skills</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    {report.job_title_analysis.key_parameters.essential_soft_skills?.map((skill: string, index: number) => (
                      <li key={index} className="text-muted-foreground">• {skill}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold">Educational Requirements</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.job_title_analysis.key_parameters.educational_requirements}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold">Key Responsibilities</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.job_title_analysis.key_parameters.key_responsibilities}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold">Work Culture Fit</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.job_title_analysis.key_parameters.work_culture_fit}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold">Industry Knowledge</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.job_title_analysis.key_parameters.industry_specific_knowledge}
                  </p>
                </div>
              </div>
            </div>
          )}
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
