
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import InputCard from '@/components/InputCard';
import { AnalysisProvider } from '@/components/analysis/AnalysisProvider';
import { AnalysisWorkflow } from '@/components/analysis/AnalysisWorkflow';

const Index = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [showJobTitleCompanyForm, setShowJobTitleCompanyForm] = useState(false);
  const isMobile = useIsMobile();

  const canAnalyze = (!!resumeFile || resumeText.trim().length > 0) && 
                     (!!jobDescriptionFile || jobDescriptionText.trim().length > 0);

  const handleScanClick = () => {
    if (!canAnalyze) {
      toast({
        title: "Missing information",
        description: "Please provide both a resume and job description to analyze.",
        variant: "destructive"
      });
      return;
    }
    setShowJobTitleCompanyForm(true);
  };

  return (
    <div className={`container mx-auto py-4 md:py-6 ${isMobile ? 'px-3' : 'max-w-4xl'}`}>
      <AnalysisProvider
        resumeFile={resumeFile}
        jobDescriptionFile={jobDescriptionFile}
        resumeText={resumeText}
        jobDescriptionText={jobDescriptionText}
      >
        <InputCard 
          resumeFile={resumeFile}
          jobDescriptionFile={jobDescriptionFile}
          resumeText={resumeText}
          jobDescriptionText={jobDescriptionText}
          setResumeFile={setResumeFile}
          setJobDescriptionFile={setJobDescriptionFile}
          setResumeText={setResumeText}
          setJobDescriptionText={setJobDescriptionText}
          isAnalyzing={false}
          canAnalyze={canAnalyze}
          onAnalyze={handleScanClick}
        />
        
        <AnalysisWorkflow
          showJobTitleCompanyForm={showJobTitleCompanyForm}
          onCloseJobTitleForm={() => setShowJobTitleCompanyForm(false)}
        />
      </AnalysisProvider>
    </div>
  );
};

export default Index;
