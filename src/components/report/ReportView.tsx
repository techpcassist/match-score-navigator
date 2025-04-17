import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ReportViewProps } from './types';
import { ScoreDisplay } from './ScoreDisplay';
import { KeywordsSection } from './KeywordsSection';
import { StructureAnalysisSection } from './StructureAnalysisSection';
import { PerformanceSection } from './PerformanceSection';
import { AdvancedCriteriaSection } from './AdvancedCriteriaSection';
import { ATSChecksSection } from './ATSChecksSection';
import { SuggestionsSection } from './SuggestionsSection';
import { useState } from 'react';
import { JobTitleForm } from './JobTitleForm';

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText }: ReportViewProps) => {
  const [jobInfo, setJobInfo] = useState({
    jobTitle: report?.job_title_analysis?.job_title || '',
    companyName: report?.job_title_analysis?.company_name || ''
  });
  
  const needsJobInfo = !jobInfo.jobTitle || !jobInfo.companyName || 
                      jobInfo.jobTitle === 'unknown' || 
                      jobInfo.companyName === 'unknown';

  const handleJobInfoSubmit = (jobTitle: string, companyName: string) => {
    setJobInfo({ jobTitle, companyName });
    // Here you would typically trigger a new analysis with the updated job info
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume Analysis Results</CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-sm font-medium">Match Score:</span>
          <Badge 
            className={`text-lg px-3 py-1 ${matchScore >= 80 
              ? 'bg-green-500 hover:bg-green-600' 
              : matchScore >= 60 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-red-500 hover:bg-red-600'}`}
          >
            {matchScore}%
          </Badge>
          
          {report.ats_score > 0 && (
            <>
              <span className="text-sm font-medium ml-2">ATS Score:</span>
              <Badge 
                className={`text-lg px-3 py-1 ${report.ats_score >= 80 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : report.ats_score >= 60 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-red-500 hover:bg-red-600'}`}
              >
                {report.ats_score}%
              </Badge>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {needsJobInfo && (
          <JobTitleForm 
            jobTitle={jobInfo.jobTitle} 
            companyName={jobInfo.companyName}
            onSubmit={handleJobInfoSubmit}
          />
        )}
        <div className="space-y-6">
          {/* Score Visualization */}
          <ScoreDisplay matchScore={matchScore} />

          <Separator />

          {/* Keywords Section */}
          <KeywordsSection 
            hardSkills={report.keywords.hard_skills} 
            softSkills={report.keywords.soft_skills} 
          />

          <Separator />

          {/* Document Structure Analysis */}
          {report.section_analysis && (
            <>
              <StructureAnalysisSection 
                sectionAnalysis={report.section_analysis}
                improvementPotential={report.improvement_potential}
              />
              <Separator />
            </>
          )}

          {/* Performance Indicators */}
          {report.performance_indicators && (
            <>
              <PerformanceSection performanceIndicators={report.performance_indicators} />
              <Separator />
            </>
          )}

          {/* Advanced Matching Criteria */}
          {report.advanced_criteria && report.advanced_criteria.length > 0 && (
            <>
              <AdvancedCriteriaSection criteria={report.advanced_criteria} />
              <Separator />
            </>
          )}

          {/* ATS Checks */}
          <ATSChecksSection checks={report.ats_checks} />

          <Separator />

          {/* Suggestions */}
          <SuggestionsSection suggestions={report.suggestions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportView;
