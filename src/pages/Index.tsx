
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InputCard from '@/components/InputCard';
import ReportView from '@/components/ReportView';
import { extractTextFromFile, uploadResumeFile } from '@/utils/fileProcessor';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [resumeFilePath, setResumeFilePath] = useState<string | null>(null);

  const handleScan = async () => {
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

    setIsAnalyzing(true);
    
    try {
      let finalResumeText = resumeText;
      let finalJobText = jobDescriptionText;
      let storedFilePath: string | null = resumeFilePath;
      
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
      
      // Call our Supabase Edge Function to perform the comparison
      const { data, error } = await supabase.functions.invoke('compare-resume', {
        body: {
          resume_text: finalResumeText,
          job_description_text: finalJobText,
          resume_file_path: storedFilePath
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
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
        onAnalyze={handleScan}
      />
      
      {/* Results Section */}
      {matchScore !== null && report && (
        <ReportView 
          matchScore={matchScore} 
          report={report} 
        />
      )}
    </div>
  );
};

export default Index;
