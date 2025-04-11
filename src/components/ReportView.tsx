
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from './report/ScoreDisplay';
import { KeywordsSection } from './report/KeywordsSection';
import { ATSChecksSection } from './report/ATSChecksSection';
import { AdvancedCriteriaSection } from './report/AdvancedCriteriaSection';
import { SuggestionsSection } from './report/SuggestionsSection';
import { PerformanceSection } from './report/PerformanceSection';
import { StructureAnalysisSection } from './report/StructureAnalysisSection';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Briefcase } from 'lucide-react';
import { UserRole } from './RoleSelectionModal';

interface ReportViewProps {
  matchScore: number;
  report: any;
  userRole?: UserRole | null;
}

const ReportView = ({ matchScore, report, userRole }: ReportViewProps) => {
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

  return (
    <Card className="w-full mb-8">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <CardTitle className="text-2xl font-bold">Match Analysis</CardTitle>
          <RoleLabel />
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
  );
};

export default ReportView;
