
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from './report/ScoreDisplay';
import { KeywordsSection } from './report/KeywordsSection';
import { ATSChecksSection } from './report/ATSChecksSection';
import { AdvancedCriteriaSection } from './report/AdvancedCriteriaSection';
import { SuggestionsSection } from './report/SuggestionsSection';
import { PerformanceSection } from './report/PerformanceSection';
import { StructureAnalysisSection } from './report/StructureAnalysisSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wand, UserCircle, Briefcase } from 'lucide-react';  // Changed MagicWand to Wand
import { UserRole } from './RoleSelectionModal';
import { OptimizationPanel } from './resume-optimization/OptimizationPanel';

interface ReportViewProps {
  matchScore: number;
  report: any;
  userRole?: UserRole | null;
  resumeText?: string;
  jobDescriptionText?: string;
}

const ReportView = ({ matchScore, report, userRole, resumeText = '', jobDescriptionText = '' }: ReportViewProps) => {
  const [showOptimizationPanel, setShowOptimizationPanel] = useState(false);
  
  // Role label elements
  const RoleLabel = () => {
    if (!userRole) return null;
    
    return (
      <Badge variant="outline" className="ml-4 flex items-center">
        {userRole === 'job_seeker' ? (
          <>
            <UserCircle className="h-4 w-4 mr-1" />
            <span>Job Seeker View</span>
          </>
        ) : (
          <>
            <Briefcase className="h-4 w-4 mr-1" />
            <span>Recruiter View</span>
          </>
        )}
      </Badge>
    );
  };

  const handleOptimizeClick = () => {
    setShowOptimizationPanel(true);
  };

  return (
    <div className="space-y-8">
      {showOptimizationPanel ? (
        <OptimizationPanel 
          resumeText={resumeText}
          jobDescriptionText={jobDescriptionText}
          analysisReport={report}
          onClose={() => setShowOptimizationPanel(false)}
        />
      ) : (
        <Card className="w-full mb-8">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <CardTitle className="text-2xl font-bold">Match Analysis</CardTitle>
                <RoleLabel />
              </div>
              
              {userRole === 'job_seeker' && (
                <Button 
                  className="mt-4 sm:mt-0"
                  onClick={handleOptimizeClick}
                >
                  <Wand className="h-4 w-4 mr-2" />
                  Optimize with AI
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScoreDisplay matchScore={matchScore} />

            {report.keywords && (
              <KeywordsSection 
                hardSkills={report.keywords.hard_skills} 
                softSkills={report.keywords.soft_skills} 
              />
            )}
            
            {report.ats_checks && (
              <ATSChecksSection 
                checks={report.ats_checks} 
              />
            )}
            
            {report.advanced_criteria && (
              <AdvancedCriteriaSection criteria={report.advanced_criteria} />
            )}
            
            {report.performance_indicators && (
              <PerformanceSection 
                performanceIndicators={report.performance_indicators} 
              />
            )}

            {report.section_analysis && (
              <StructureAnalysisSection 
                sectionAnalysis={report.section_analysis}
                improvementPotential={report.improvement_potential}
              />
            )}
            
            {report.suggestions && (
              <SuggestionsSection suggestions={report.suggestions} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportView;
