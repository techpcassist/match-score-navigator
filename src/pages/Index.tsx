
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InputCard from '@/components/InputCard';
import ReportView from '@/components/ReportView';
import { extractTextFromFile, uploadResumeFile } from '@/utils/fileProcessor';
import RoleSelectionModal, { UserRole } from '@/components/RoleSelectionModal';

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

  const handleScanClick = () => {
    // Check if we have enough input to analyze
    if ((!resumeFile && resumeText.trim() === '') || 
        (!jobDescriptionFile && jobDescriptionText.trim() === '')) {
      toast({
        title: "Missing information",
        description: "Please provide both a resume and job description to analyze.",
        variant: "destructive"
      });
      return;
    }

    // Show the role selection modal instead of immediately analyzing
    setShowRoleModal(true);
  };

  const handleRoleConfirm = async (role: UserRole) => {
    setSelectedRole(role);
    await performAnalysis(role);
  };

  const performAnalysis = async (userRole: UserRole) => {
    setIsAnalyzing(true);
    
    try {
      let finalResumeText = resumeText;
      let finalJobText = jobDescriptionText;
      let storedFilePath: string | null = resumeFilePath;
      let resumeId: string | null = null;
      let jobId: string | null = null;
      
      // If files were uploaded, extract their text
      if (resumeFile) {
        finalResumeText = await extractTextFromFile(resumeFile);
        
        // Upload the resume file to storage if not already uploaded
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
      
      // Check if resume text has changed from last submission
      if (finalResumeText === lastResumeText && lastResumeId) {
        resumeId = lastResumeId;
        console.log("Using existing resume ID:", resumeId);
      }
      
      // Check if job description text has changed from last submission
      if (finalJobText === lastJobText && lastJobId) {
        jobId = lastJobId;
        console.log("Using existing job ID:", jobId);
      }
      
      // Call our Supabase Edge Function to perform the comparison
      const { data, error } = await supabase.functions.invoke('compare-resume', {
        body: {
          resume_text: finalResumeText,
          job_description_text: finalJobText,
          resume_file_path: storedFilePath,
          resume_id: resumeId,
          job_id: jobId,
          user_role: userRole // Include the selected role
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update last submitted texts and IDs
      setLastResumeText(finalResumeText);
      setLastJobText(finalJobText);
      setLastResumeId(data.resume_id);
      setLastJobId(data.job_description_id);
      
      // Update state with the response
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

  return (
    <div className="container mx-auto py-6 max-w-4xl">
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
        onAnalyze={handleScanClick}  // Changed from handleScan to handleScanClick
      />
      
      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
        onConfirm={handleRoleConfirm}
      />
      
      {/* Results Section */}
      {matchScore !== null && report && (
        <ReportView 
          matchScore={matchScore} 
          report={report}
          userRole={selectedRole} // Pass the role to show in the report
        />
      )}
    </div>
  );
};

export default Index;
