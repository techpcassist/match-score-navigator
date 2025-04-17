import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import InputCard from '@/components/InputCard';
import ReportView from '@/components/ReportView';
import { extractTextFromFile, uploadResumeFile } from '@/utils/fileProcessor';
import RoleSelectionModal, { UserRole } from '@/components/RoleSelectionModal';
import JobTitleCompanyForm from '@/components/JobTitleCompanyForm';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [resumeFilePath, setResumeFilePath] = useState<string | null>(null);
  const [lastResumeText, setLastResumeText] = useState<string>('');
  const [lastJobText, setLastJobText] = useState<string>('');
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);
  const [lastJobId, setLastJobId] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [finalProcessedResumeText, setFinalProcessedResumeText] = useState('');
  const [finalProcessedJobText, setFinalProcessedJobText] = useState(''); 
  const [showJobTitleCompanyForm, setShowJobTitleCompanyForm] = useState(false);
  const [jobTitleCompanyInfo, setJobTitleCompanyInfo] = useState({
    jobTitle: '',
    companyName: ''
  });
  const isMobile = useIsMobile();

  const handleScanClick = () => {
    if ((!resumeFile && resumeText.trim() === '') || 
        (!jobDescriptionFile && jobDescriptionText.trim() === '')) {
      toast({
        title: "Missing information",
        description: "Please provide both a resume and job description to analyze.",
        variant: "destructive"
      });
      return;
    }

    setShowJobTitleCompanyForm(true);
  };

  const handleJobTitleCompanySubmit = async (jobTitle: string, companyName: string) => {
    setJobTitleCompanyInfo({ jobTitle, companyName });
    setShowJobTitleCompanyForm(false);
    setShowRoleModal(true);
  };

  const handleRoleConfirm = async (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleModal(false);
    await performAnalysis(role, jobTitleCompanyInfo.jobTitle, jobTitleCompanyInfo.companyName);
  };

  const performAnalysis = async (userRole: UserRole, jobTitle: string, companyName: string) => {
    setIsAnalyzing(true);
    
    try {
      let finalResumeText = resumeText;
      let finalJobText = jobDescriptionText;
      let storedFilePath: string | null = resumeFilePath;
      let resumeId: string | null = null;
      let jobId: string | null = null;
      
      if (resumeFile) {
        finalResumeText = await extractTextFromFile(resumeFile);
        
        if (!storedFilePath) {
          storedFilePath = await uploadResumeFile(resumeFile);
          setResumeFilePath(storedFilePath);
          
          if (storedFilePath) {
            toast({
              title: "File uploaded",
              description: "Your resume has been stored successfully.",
            });
          }
        }
      }
      
      if (jobDescriptionFile) {
        finalJobText = await extractTextFromFile(jobDescriptionFile);
      }
      
      setFinalProcessedResumeText(finalResumeText);
      setFinalProcessedJobText(finalJobText);
      console.log("Index: Setting finalProcessedResumeText, length:", finalResumeText.length);
      console.log("Index: Setting finalProcessedJobText, length:", finalJobText.length);
      
      if (finalResumeText === lastResumeText && lastResumeId) {
        resumeId = lastResumeId;
        console.log("Using existing resume ID:", resumeId);
      }
      
      if (finalJobText === lastJobText && lastJobId) {
        jobId = lastJobId;
        console.log("Using existing job ID:", jobId);
      }
      
      const { data, error } = await supabase.functions.invoke('compare-resume', {
        body: {
          resume_text: finalResumeText,
          job_description_text: finalJobText,
          resume_file_path: storedFilePath,
          resume_id: resumeId,
          job_id: jobId,
          user_role: userRole,
          job_title: jobTitle,
          company_name: companyName
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setLastResumeText(finalResumeText);
      setLastJobText(finalJobText);
      setLastResumeId(data.resume_id);
      setLastJobId(data.job_description_id);
      
      setMatchScore(data.match_score);
      setReport(data.report);
      
      toast({
        title: "Analysis complete",
        description: `Match score: ${data.match_score}%`,
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = (!!resumeFile || resumeText.trim().length > 0) && 
                     (!!jobDescriptionFile || jobDescriptionText.trim().length > 0);

  useEffect(() => {
    console.log("Index component - Current resumeText state:", 
      resumeText ? `Present (length: ${resumeText.length})` : "Not present");
    console.log("Index component - Current finalProcessedResumeText:", 
      finalProcessedResumeText ? `Present (length: ${finalProcessedResumeText.length})` : "Not present");
  }, [resumeText, finalProcessedResumeText]);

  return (
    <div className={`container mx-auto py-4 md:py-6 ${isMobile ? 'px-3' : 'max-w-4xl'}`}>
      <InputCard 
        resumeFile={resumeFile}
        jobDescriptionFile={jobDescriptionFile}
        resumeText={resumeText}
        jobDescriptionText={jobDescriptionText}
        setResumeFile={setResumeFile}
        setJobDescriptionFile={setJobDescriptionFile}
        setResumeText={setResumeText}
        setJobDescriptionText={setJobDescriptionText}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
        onAnalyze={handleScanClick}
      />
      
      <JobTitleCompanyForm 
        open={showJobTitleCompanyForm}
        onClose={() => setShowJobTitleCompanyForm(false)}
        onSubmit={handleJobTitleCompanySubmit}
        jobTitle=""
        companyName=""
      />
      
      {showRoleModal && (
        <RoleSelectionModal 
          key={`role-modal-${showRoleModal}`}
          isOpen={showRoleModal} 
          onClose={() => setShowRoleModal(false)} 
          onConfirm={handleRoleConfirm}
        />
      )}
      
      {matchScore !== null && report && (
        <ReportView 
          matchScore={matchScore} 
          report={report}
          userRole={selectedRole}
          resumeText={finalProcessedResumeText || lastResumeText}
          jobDescriptionText={finalProcessedJobText || lastJobText}
        />
      )}
    </div>
  );
};

export default Index;
