
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportViewMain } from './ReportViewMain';
import { ReportViewDetails } from './ReportViewDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResumeParsingModal } from '../resume-optimization/parser/ResumeParsingModal';

interface ReportViewProps {
  matchScore: number;
  report: any;
  userRole: string;
  resumeText: string;
  jobDescriptionText: string;
  jobTitle: string;
  companyName: string;
}

const ReportView: React.FC<ReportViewProps> = ({
  matchScore,
  report,
  userRole,
  resumeText,
  jobDescriptionText,
  jobTitle,
  companyName
}) => {
  const [localResumeText, setLocalResumeText] = React.useState(resumeText);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isParsingModalOpen, setIsParsingModalOpen] = React.useState(false);
  const [parsedResumeData, setParsedResumeData] = React.useState<any>(null);
  const isMobile = useIsMobile();

  // Handle parse resume
  const handleParseResume = () => {
    if (!resumeText) return;
    setIsParsingModalOpen(true);
  };
  
  const handleParseComplete = (data: any) => {
    setParsedResumeData(data);
    setIsParsingModalOpen(false);
  };

  // Add proper error state UI
  const renderErrorState = () => {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Analysis Issue</h3>
        <p className="mb-4">We encountered a problem generating your analysis. Please try again.</p>
        <p className="text-sm text-muted-foreground">
          If this message persists, our AI service may be temporarily unavailable. 
          The system has generated a basic analysis instead.
        </p>
      </div>
    );
  };

  // Show an error message if report is missing expected data
  const hasError = !report || !report.keywords || !report.suggestions;
  
  return (
    <div className="space-y-6">
      {hasError ? (
        renderErrorState()
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-center mb-6">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ReportViewMain
              matchScore={matchScore}
              report={report}
              userRole={userRole}
              resumeText={resumeText}
              localResumeText={localResumeText}
              onParseResume={handleParseResume}
              isMobile={isMobile}
            />
          </TabsContent>
          
          <TabsContent value="details">
            <ReportViewDetails
              report={report}
              resumeText={resumeText}
              jobDescriptionText={jobDescriptionText}
              isMobile={isMobile}
            />
          </TabsContent>
        </Tabs>
      )}
      
      <ResumeParsingModal
        isOpen={isParsingModalOpen}
        onClose={() => setIsParsingModalOpen(false)}
        resumeText={resumeText}
        onParseComplete={handleParseComplete}
      />
    </div>
  );
};

export default ReportView;
