
import React from 'react';
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

interface ReportViewMainProps {
  matchScore: number;
  report: ReportData;
  userRole?: string;
  resumeText: string; 
  localResumeText: string;
  onParseResume: () => void;
}

export const ReportViewMain: React.FC<ReportViewMainProps> = ({
  matchScore,
  report,
  userRole,
  resumeText,
  localResumeText,
  onParseResume
}) => {
  return (
    <div className="space-y-8">
      <ScoreDisplay matchScore={matchScore} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analysis Report</h2>
        {userRole === "recruiter" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <TrophyIcon className="mr-2 h-4 w-4" />
            Recruiter View
          </div>
        )}
      </div>

      <ATSChecksSection checks={report.ats_checks} />
      <KeywordsSection 
        hardSkills={report.keywords.hard_skills} 
        softSkills={report.keywords.soft_skills} 
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
      />
    </div>
  );
};

export default ReportViewMain;
