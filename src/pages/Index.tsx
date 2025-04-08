
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

const Index = () => {
  // Mock data for initial UI development - will be replaced with actual API calls later
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [report, setReport] = useState<any | null>(null);

  const handleScan = () => {
    // This will be replaced with actual API call to the Flask backend
    setIsAnalyzing(true);
    
    // Simulate API response delay
    setTimeout(() => {
      // Mock response data
      const mockReport = {
        match_score: 75,
        report: {
          keywords: {
            hard_skills: [
              { term: "React", matched: true },
              { term: "TypeScript", matched: true },
              { term: "Python", matched: false },
              { term: "Node.js", matched: true },
              { term: "SQL", matched: false },
            ],
            soft_skills: [
              { term: "Communication", matched: true },
              { term: "Problem Solving", matched: true },
              { term: "Leadership", matched: false },
            ]
          },
          advanced_criteria: [
            { 
              name: "Skill Proficiency Level", 
              status: "partial", 
              description: "The resume indicates intermediate proficiency in React, but the job requires advanced expertise."
            },
            { 
              name: "Quantified Impact Alignment", 
              status: "matched", 
              description: "Your quantified achievements (15% performance improvement) align well with the KPIs mentioned in the job description."
            },
            { 
              name: "Project Complexity & Scope", 
              status: "matched", 
              description: "The scale and complexity of projects in your resume match the expectations outlined in the job description."
            },
            { 
              name: "Semantic Role Similarity", 
              status: "partial", 
              description: "Some core responsibilities in your previous roles align with the job requirements, but there are gaps in certain areas."
            },
            { 
              name: "Career Trajectory & Velocity", 
              status: "matched", 
              description: "Your career progression matches the seniority level required for this position."
            },
            { 
              name: "Contextual Skill Application", 
              status: "missing", 
              description: "Some key skills are mentioned but not demonstrated in a relevant context to this specific role."
            },
            { 
              name: "Recency of Critical Skill Usage", 
              status: "matched", 
              description: "Your most recent experience includes the critical skills required for this position."
            },
            { 
              name: "Transferable Skills", 
              status: "matched", 
              description: "Several transferable skills identified that are relevant to the requirements."
            },
            { 
              name: "Problem-Solving Approach", 
              status: "partial", 
              description: "Your analytical approach is evident but could better highlight creative problem-solving as mentioned in the job."
            },
            { 
              name: "Tool Ecosystem Familiarity", 
              status: "partial", 
              description: "Experience with related tools suggests familiarity with the required ecosystem, but specific tools are missing."
            }
          ],
          ats_checks: [
            { check_name: "Contact Information", status: "pass", message: "Contact information found" },
            { check_name: "Education Section", status: "pass", message: "Education section present" },
            { check_name: "Experience Format", status: "warning", message: "Consider adding more quantifiable achievements" },
            { check_name: "File Format", status: "pass", message: "PDF format is ATS-friendly" }
          ],
          suggestions: [
            "Add more quantifiable achievements in your experience section",
            "Include Python skills mentioned in the job description",
            "Consider adding a specific section for technical skills",
            "Demonstrate leadership experience with concrete examples",
            "Highlight experience with SQL or database management",
            "Use more action verbs that demonstrate advanced proficiency",
            "Include specific tools from the job's required ecosystem"
          ]
        },
        processing_metadata: {
          scan_duration_ms: 1240,
          resume_word_count: 425,
          jd_word_count: 350
        }
      };
      
      setMatchScore(mockReport.match_score);
      setReport(mockReport.report);
      setIsAnalyzing(false);
    }, 2000);
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
                  acceptedTypes=".pdf,.docx"
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
