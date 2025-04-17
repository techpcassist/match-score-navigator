
import React from 'react';
import InputCard from '@/components/InputCard';
import { toast } from "@/hooks/use-toast";

interface InputSectionProps {
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  resumeText: string;
  jobDescriptionText: string;
  setResumeFile: (file: File | null) => void;
  setJobDescriptionFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setJobDescriptionText: (text: string) => void;
  setShowJobTitleCompanyForm: (show: boolean) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  resumeFile,
  jobDescriptionFile,
  resumeText,
  jobDescriptionText,
  setResumeFile,
  setJobDescriptionFile,
  setResumeText,
  setJobDescriptionText,
  setShowJobTitleCompanyForm
}) => {
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
  );
};

export default InputSection;
