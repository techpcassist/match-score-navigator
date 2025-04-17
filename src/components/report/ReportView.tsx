
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreDisplay } from './ScoreDisplay';
import { KeywordsSection } from './KeywordsSection';
import { StructureAnalysisSection } from './StructureAnalysisSection';
import { PerformanceSection } from './PerformanceSection';
import { AdvancedCriteriaSection } from './AdvancedCriteriaSection';
import { ATSChecksSection } from './ATSChecksSection';
import { SuggestionsSection } from './SuggestionsSection';
import { Building, Briefcase } from 'lucide-react';

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText, jobTitle, companyName }) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume Analysis Results</CardTitle>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-sm font-medium">Match Score:</span>
          <Badge 
            className={`text-lg px-3 py-1 ${
              matchScore >= 80 ? 'bg-green-500 hover:bg-green-600' : 
              matchScore >= 60 ? 'bg-yellow-500 hover:bg-yellow-600' : 
              'bg-red-500 hover:bg-red-600'
            }`}
          >
            {matchScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ScoreDisplay matchScore={matchScore} />

          <div className="bg-muted/30 p-4 rounded-md border">
            <h3 className="text-lg font-medium mb-4">Position Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Job Title:</span>
                  <span className="ml-2">{jobTitle || (report.job_title_analysis?.job_title !== "unknown" ? report.job_title_analysis?.job_title : "Not specified")}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Company:</span>
                  <span className="ml-2">{companyName || (report.job_title_analysis?.company_name !== "unknown" ? report.job_title_analysis?.company_name : "Not specified")}</span>
                </div>
              </div>
              {report.job_title_analysis?.key_parameters && (
                <div className="mt-2 md:mt-0">
                  <p><strong>Analysis Type:</strong> {userRole === "recruiter" ? "Recruiter View" : "Job Seeker View"}</p>
                </div>
              )}
            </div>
          </div>

          <ATSChecksSection checks={report.ats_checks} />
          <KeywordsSection hardSkills={report.keywords.hard_skills} softSkills={report.keywords.soft_skills} />
          {report.advanced_criteria && (
            <AdvancedCriteriaSection criteria={report.advanced_criteria} />
          )}
          {report.performance_indicators && (
            <PerformanceSection performanceIndicators={report.performance_indicators} />
          )}
          {report.section_analysis && (
            <StructureAnalysisSection 
              sectionAnalysis={report.section_analysis}
              improvementPotential={report.improvement_potential}
            />
          )}
          <SuggestionsSection suggestions={report.suggestions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportView;
