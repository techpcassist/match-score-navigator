
import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/components/RoleSelectionModal';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromFile, uploadResumeFile } from '@/utils/fileProcessor';

interface AnalysisContextType {
  isAnalyzing: boolean;
  matchScore: number | null;
  report: any | null;
  resumeFilePath: string | null;
  finalProcessedResumeText: string;
  finalProcessedJobText: string;
  performAnalysis: (userRole: UserRole, jobTitle: string, companyName: string) => Promise<void>;
  lastResumeText: string;
  lastJobText: string;
  lastResumeId: string | null;
  lastJobId: string | null;
}

interface AnalysisProviderProps {
  children: React.ReactNode;
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  resumeText: string;
  jobDescriptionText: string;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ 
  children, 
  resumeFile,
  jobDescriptionFile,
  resumeText,
  jobDescriptionText
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [resumeFilePath, setResumeFilePath] = useState<string | null>(null);
  const [lastResumeText, setLastResumeText] = useState<string>('');
  const [lastJobText, setLastJobText] = useState<string>('');
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);
  const [lastJobId, setLastJobId] = useState<string | null>(null);
  const [finalProcessedResumeText, setFinalProcessedResumeText] = useState('');
  const [finalProcessedJobText, setFinalProcessedJobText] = useState('');

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
      
      if (finalResumeText === lastResumeText && lastResumeId) {
        resumeId = lastResumeId;
      }
      
      if (finalJobText === lastJobText && lastJobId) {
        jobId = lastJobId;
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

  return (
    <AnalysisContext.Provider value={{
      isAnalyzing,
      matchScore,
      report,
      resumeFilePath,
      finalProcessedResumeText,
      finalProcessedJobText,
      performAnalysis,
      lastResumeText,
      lastJobText,
      lastResumeId,
      lastJobId
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
