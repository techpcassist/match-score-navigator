
import React from 'react';
import { AnalysisProvider } from '@/components/analysis/AnalysisProvider';
import { AnalysisWorkflow } from '@/components/analysis/AnalysisWorkflow';
import HomeContainer from '@/components/home/HomeContainer';
import InputSection from '@/components/home/InputSection';
import { useResumeInput } from '@/hooks/use-resume-input';

const Index = () => {
  const {
    resumeFile,
    resumeText,
    jobDescriptionText,
    jobDescriptionFile,
    showJobTitleCompanyForm,
    setResumeFile,
    setResumeText,
    setJobDescriptionText,
    setJobDescriptionFile,
    setShowJobTitleCompanyForm
  } = useResumeInput();

  return (
    <HomeContainer>
      <AnalysisProvider
        resumeFile={resumeFile}
        jobDescriptionFile={jobDescriptionFile}
        resumeText={resumeText}
        jobDescriptionText={jobDescriptionText}
      >
        <InputSection 
          resumeFile={resumeFile}
          jobDescriptionFile={jobDescriptionFile}
          resumeText={resumeText}
          jobDescriptionText={jobDescriptionText}
          setResumeFile={setResumeFile}
          setJobDescriptionFile={setJobDescriptionFile}
          setResumeText={setResumeText}
          setJobDescriptionText={setJobDescriptionText}
          setShowJobTitleCompanyForm={setShowJobTitleCompanyForm}
        />
        
        <AnalysisWorkflow
          showJobTitleCompanyForm={showJobTitleCompanyForm}
          onCloseJobTitleForm={() => setShowJobTitleCompanyForm(false)}
        />
      </AnalysisProvider>
    </HomeContainer>
  );
};

export default Index;
