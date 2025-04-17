
import { useState } from 'react';

export function useResumeInput() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [showJobTitleCompanyForm, setShowJobTitleCompanyForm] = useState(false);

  const canAnalyze = (!!resumeFile || resumeText.trim().length > 0) && 
                    (!!jobDescriptionFile || jobDescriptionText.trim().length > 0);

  return {
    resumeFile,
    resumeText,
    jobDescriptionText,
    jobDescriptionFile,
    showJobTitleCompanyForm,
    setResumeFile,
    setResumeText,
    setJobDescriptionText,
    setJobDescriptionFile,
    setShowJobTitleCompanyForm,
    canAnalyze
  };
}
