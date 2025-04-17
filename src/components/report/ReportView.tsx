
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

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText }) => {
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

          {report.job_title_analysis && (
            <div className="bg-muted/30 p-4 rounded-md border">
              <h3 className="text-lg font-medium mb-4">Position Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Analysis Information */}
                <div>
                  <p><strong>Job Title:</strong> {report.job_title_analysis.job_title}</p>
                  <p><strong>Company:</strong> {report.job_title_analysis.company_name}</p>
                </div>
              </div>
            </div>
          )}

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
