
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, FilePlus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResumeTextInput from '@/components/ResumeTextInput';
import ReportView from '@/components/ReportView';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [report, setReport] = useState<any | null>(null);

  // Extract text from file (PDF or DOCX)
  const extractTextFromFile = async (file: File): Promise<string> => {
    // In a real implementation, this would use a proper PDF/DOCX parser
    // For now, we'll just read text files directly and mock the extraction for other formats
    if (file.type === 'text/plain') {
      return await file.text();
    } else {
      // Mock extraction - in a real app, you'd use a PDF/DOCX library or API
      return `Extracted content from ${file.name}. In a production app, this would use a proper PDF/DOCX parser.`;
    }
  };

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
      
      // If files were uploaded, extract their text
      if (resumeFile) {
        finalResumeText = await extractTextFromFile(resumeFile);
      }
      
      if (jobDescriptionFile) {
        finalJobText = await extractTextFromFile(jobDescriptionFile);
      }
      
      // Call our Supabase Edge Function to perform the comparison
      const { data, error } = await supabase.functions.invoke('compare-resume', {
        body: {
          resume_text: finalResumeText,
          job_description_text: finalJobText
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AI Resume Scanner</CardTitle>
          <CardDescription>
            Compare your resume against a job description to see how well you match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="paste">Paste Text</TabsTrigger>
            </TabsList>
            
            {/* Upload Files Tab */}
            <TabsContent value="upload" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploader 
                  title="Upload Resume" 
                  description="PDF or DOCX format" 
                  icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                  onFileSelected={setResumeFile}
                  acceptedTypes=".pdf,.docx,.txt"
                  selectedFile={resumeFile}
                />
                
                <FileUploader 
                  title="Upload Job Description" 
                  description="PDF or DOCX format" 
                  icon={<FilePlus className="h-8 w-8 text-muted-foreground" />}
                  onFileSelected={setJobDescriptionFile}
                  acceptedTypes=".pdf,.docx,.txt"
                  selectedFile={jobDescriptionFile}
                />
              </div>
            </TabsContent>
            
            {/* Paste Text Tab */}
            <TabsContent value="paste" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResumeTextInput
                  value={resumeText}
                  onChange={setResumeText}
                />
                
                <JobDescriptionInput
                  value={jobDescriptionText}
                  onChange={setJobDescriptionText}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleScan} 
              disabled={!canAnalyze || isAnalyzing}
              size="lg"
              className="w-full md:w-1/2"
            >
              {isAnalyzing ? (
                <>Analyzing... <Upload className="ml-2 h-4 w-4 animate-spin" /></>
              ) : (
                <>Analyze Match <Upload className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
