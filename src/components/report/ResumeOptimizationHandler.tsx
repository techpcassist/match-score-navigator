
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ResumeParsingModal from '../resume-optimization/parser/ResumeParsingModal';
import ResumeOptimizationPage from '../resume-optimization/parser/ResumeOptimizationPage';
import { createSectionsFromOptimizedData, buildResumeContentFromData } from '@/utils/resumeContentBuilder';

interface ResumeOptimizationHandlerProps {
  resumeText: string;
  jobDescriptionText: string;
  localResumeText: string;
  localJobText: string;
  children: (handleParseResume: () => void) => React.ReactNode;
}

export const ResumeOptimizationHandler: React.FC<ResumeOptimizationHandlerProps> = ({
  resumeText,
  jobDescriptionText,
  localResumeText,
  localJobText,
  children
}) => {
  const [optimizationMode, setOptimizationMode] = useState(false);
  const [showParsingModal, setShowParsingModal] = useState(false);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle parse resume action
  const handleParseResume = () => {
    console.log("handleParseResume called", {
      resumeTextProp: resumeText ? `Present (length: ${resumeText.length})` : "Not present",
      localResumeText: localResumeText ? `Present (length: ${localResumeText.length})` : "Not present"
    });
    
    // Use local state for checking, with fallback to prop
    const textToUse = localResumeText || resumeText;
    
    // Check if resumeText exists and is not empty
    if (!textToUse || textToUse.trim() === '') {
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
  const handleParseComplete = (data: any) => {
    setParsedResumeData(data);
    setShowParsingModal(false);
    setOptimizationMode(true);
  };
  
  // Handle back button from optimization page
  const handleBackFromOptimization = () => {
    setOptimizationMode(false);
  };
  
  // Handle proceed button from optimization page
  const handleProceedFromOptimization = (updatedData: any) => {
    console.log("Proceeding with optimized data:", updatedData);
    
    // Create a full resume content from the optimized data
    const resumeContent = buildResumeContentFromData(updatedData);
    
    // Create proper resume sections
    const sections = createSectionsFromOptimizedData(updatedData);
    
    // Store the optimized resume in localStorage to be picked up by the ResumeDashboard
    const optimizedResumeData = {
      title: `Optimized Resume (${new Date().toLocaleDateString()})`,
      content: resumeContent,
      sections: sections,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pendingOptimizedResume', JSON.stringify(optimizedResumeData));
    
    toast({
      title: "Resume optimized",
      description: "Your resume has been optimized and is ready to view in the dashboard.",
    });
    
    // Navigate to the resume dashboard
    navigate('/resumes');
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
      {children(handleParseResume)}
      
      {/* Parsing Modal */}
      {showParsingModal && (
        <ResumeParsingModal
          isOpen={showParsingModal}
          onClose={() => setShowParsingModal(false)}
          resumeText={localResumeText || resumeText}
          onParseComplete={handleParseComplete}
        />
      )}
    </>
  );
};

export default ResumeOptimizationHandler;
