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

const Index = () => {
  // Mock data for initial UI development - will be replaced with actual API calls later
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [report, setReport] = useState<any | null>(null);

  // Simple function to calculate a more dynamic match score based on inputs
  const calculateDynamicScore = (resume: string, jobDescription: string): number => {
    if (!resume || !jobDescription) return 0;
    
    // This is a simplified algorithm that produces different scores based on content length and overlap
    // In a real implementation, this would be replaced by the AI comparison logic
    
    // Convert texts to lowercase for better comparison
    const resumeLower = resume.toLowerCase();
    const jdLower = jobDescription.toLowerCase();
    
    // Extract common keywords (very simplified)
    const commonKeywords = [
      "react", "javascript", "typescript", "python", "java", "nodejs", "express",
      "mongodb", "sql", "database", "frontend", "backend", "fullstack", "development",
      "software", "engineer", "developer", "project", "team", "manager", "lead",
      "experience", "years", "skills", "communication", "problem-solving", "leadership"
    ];
    
    // Count keywords in both texts
    let matchCount = 0;
    let totalKeywords = 0;
    
    commonKeywords.forEach(keyword => {
      if (jdLower.includes(keyword)) {
        totalKeywords++;
        if (resumeLower.includes(keyword)) {
          matchCount++;
        }
      }
    });
    
    // Calculate score based on keyword matches and content length similarity
    const lengthScore = Math.min(100, 
      100 - Math.abs(resume.length - jobDescription.length) / Math.max(resume.length, jobDescription.length) * 50
    );
    
    const keywordScore = totalKeywords > 0 ? (matchCount / totalKeywords) * 100 : 50;
    
    // Combine scores with different weights
    const finalScore = Math.round(keywordScore * 0.7 + lengthScore * 0.3);
    
    // Keep score between 0-100
    return Math.min(100, Math.max(0, finalScore));
  };

  const handleScan = () => {
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
    
    // This will be replaced with actual API call to the Flask backend
    setTimeout(() => {
      // Calculate a more dynamic score based on provided text
      const resumeContent = resumeText.trim();
      const jobContent = jobDescriptionText.trim();
      
      const dynamicScore = calculateDynamicScore(resumeContent, jobContent);
      
      // Adjust matched skills based on our dynamic score
      const mockReport = generateMockReport(dynamicScore, resumeContent, jobContent);
      
      setMatchScore(mockReport.match_score);
      setReport(mockReport.report);
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Match score: ${mockReport.match_score}%`,
      });
    }, 2000);
  };

  // Generate a more dynamic mock report based on the calculated score
  const generateMockReport = (score: number, resumeText: string, jobText: string) => {
    // Prepare skill lists based on common terms
    const hardSkills = [
      { term: "React", matched: score > 40 && resumeText.toLowerCase().includes("react") },
      { term: "TypeScript", matched: score > 35 && resumeText.toLowerCase().includes("typescript") },
      { term: "Python", matched: score > 30 && resumeText.toLowerCase().includes("python") },
      { term: "Node.js", matched: score > 45 && resumeText.toLowerCase().includes("node") },
      { term: "SQL", matched: score > 25 && resumeText.toLowerCase().includes("sql") }
    ];
    
    const softSkills = [
      { term: "Communication", matched: score > 60 && resumeText.toLowerCase().includes("communicat") },
      { term: "Problem Solving", matched: score > 55 && resumeText.toLowerCase().includes("problem") },
      { term: "Leadership", matched: score > 65 && resumeText.toLowerCase().includes("lead") }
    ];

    // Create status categories based on the score
    const getStatusForScore = (baseScore: number) => {
      if (score > baseScore + 15) return "matched";
      if (score > baseScore - 15) return "partial";
      return "missing";
    };

    return {
      match_score: score,
      report: {
        keywords: {
          hard_skills: hardSkills,
          soft_skills: softSkills
        },
        advanced_criteria: [
          { 
            name: "Skill Proficiency Level", 
            status: getStatusForScore(60), 
            description: "The resume indicates intermediate proficiency in React, but the job requires advanced expertise."
          },
          { 
            name: "Quantified Impact Alignment", 
            status: getStatusForScore(70), 
            description: "Your quantified achievements align with the KPIs mentioned in the job description."
          },
          { 
            name: "Project Complexity & Scope", 
            status: getStatusForScore(75), 
            description: "The scale and complexity of projects in your resume match the expectations outlined in the job description."
          },
          { 
            name: "Semantic Role Similarity", 
            status: getStatusForScore(65), 
            description: "Some core responsibilities in your previous roles align with the job requirements, but there are gaps in certain areas."
          },
          { 
            name: "Career Trajectory & Velocity", 
            status: getStatusForScore(80), 
            description: "Your career progression matches the seniority level required for this position."
          },
          { 
            name: "Contextual Skill Application", 
            status: getStatusForScore(55), 
            description: "Some key skills are mentioned but not demonstrated in a relevant context to this specific role."
          },
          { 
            name: "Recency of Critical Skill Usage", 
            status: getStatusForScore(70), 
            description: "Your most recent experience includes the critical skills required for this position."
          },
          { 
            name: "Transferable Skills", 
            status: getStatusForScore(75), 
            description: "Several transferable skills identified that are relevant to the requirements."
          },
          { 
            name: "Problem-Solving Approach", 
            status: getStatusForScore(65), 
            description: "Your analytical approach is evident but could better highlight creative problem-solving as mentioned in the job."
          },
          { 
            name: "Tool Ecosystem Familiarity", 
            status: getStatusForScore(60), 
            description: "Experience with related tools suggests familiarity with the required ecosystem, but specific tools are missing."
          }
        ],
        ats_checks: [
          { check_name: "Contact Information", status: "pass", message: "Contact information found" },
          { check_name: "Education Section", status: "pass", message: "Education section present" },
          { check_name: "Experience Format", status: score > 50 ? "pass" : "warning", message: score > 50 ? "Experience format looks good" : "Consider adding more quantifiable achievements" },
          { check_name: "File Format", status: "pass", message: "Format is ATS-friendly" }
        ],
        suggestions: [
          "Add more quantifiable achievements in your experience section",
          score < 60 ? "Include Python skills mentioned in the job description" : "Consider detailing your Python experience more thoroughly",
          "Consider adding a specific section for technical skills",
          score < 70 ? "Demonstrate leadership experience with concrete examples" : "Highlight your leadership achievements more prominently",
          "Use more action verbs that demonstrate advanced proficiency",
          "Include specific tools from the job's required ecosystem"
        ].filter(Boolean)
      },
      processing_metadata: {
        scan_duration_ms: Math.floor(Math.random() * 2000) + 500,
        resume_word_count: resumeText ? resumeText.split(/\s+/).length : 425,
        jd_word_count: jobText ? jobText.split(/\s+/).length : 350
      }
    };
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
