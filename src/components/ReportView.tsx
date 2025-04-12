import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ATSChecksSection from "./report/ATSChecksSection";
import KeywordsSection from "./report/KeywordsSection";
import ScoreDisplay from "./report/ScoreDisplay";
import SuggestionsSection from "./report/SuggestionsSection";
import OptimizationPanel from "./resume-optimization/OptimizationPanel";
import StructureAnalysisSection from "./report/StructureAnalysisSection";
import AdvancedCriteriaSection from "./report/AdvancedCriteriaSection";
import PerformanceSection from "./report/PerformanceSection";
import { TrophyIcon, ArrowRight, Sparkles } from "lucide-react";
import ResumeParsingModal from './resume-optimization/parser/ResumeParsingModal';
import ResumeOptimizationPage from './resume-optimization/parser/ResumeOptimizationPage';

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText }) => {
  const [optimizationMode, setOptimizationMode] = useState(false);
  const [showParsingModal, setShowParsingModal] = useState(false);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const { toast } = useToast();

  // Handle parse resume action
  const handleParseResume = () => {
    if (!resumeText?.trim()) {
      toast({
        title: "No resume found",
        description: "Please upload or paste your resume before optimizing.",
        variant: "destructive"
      });
      return;
    }
    
    setShowParsingModal(true);
  };
  
  // Handle parsed data from the parsing modal
  const handleParseComplete = (data) => {
    setParsedResumeData(data);
    setShowParsingModal(false);
    setOptimizationMode(true);
  };
  
  // Handle back button from optimization page
  const handleBackFromOptimization = () => {
    setOptimizationMode(false);
  };
  
  // Handle proceed button from optimization page
  const handleProceedFromOptimization = (updatedData) => {
    // Here you would process the edited data and move to the next step
    // For now, just log it and show a toast
    console.log("Proceeding with optimized data:", updatedData);
    toast({
      title: "Data saved",
      description: "Your optimized resume data has been processed.",
    });
    
    // In a real implementation, this would trigger the next step in your workflow
    setOptimizationMode(false);
  };

  if (optimizationMode && parsedResumeData) {
    return (
      <ResumeOptimizationPage
        parsedData={parsedResumeData}
        onBack={handleBackFromOptimization}
        onProceed={handleProceedFromOptimization}
      />
    );
  }

  return (
    <>
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

        <ATSChecksSection report={report} />
        <KeywordsSection report={report} />
        <AdvancedCriteriaSection report={report} />
        <PerformanceSection report={report} />
        <StructureAnalysisSection report={report} />
        <SuggestionsSection report={report} />
        
        {/* Add the new Optimize with AI button in the existing code */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleParseResume}
            variant="default" 
            size="lg"
            className="flex items-center"
          >
            <Sparkles className="mr-2" />
            Optimize with AI Suggestions
          </Button>
        </div>
        
      </div>
      
      {/* Parsing Modal */}
      {showParsingModal && (
        <ResumeParsingModal
          isOpen={showParsingModal}
          onClose={() => setShowParsingModal(false)}
          resumeText={resumeText}
          onParseComplete={handleParseComplete}
        />
      )}
    </>
  );
};

export default ReportView;
