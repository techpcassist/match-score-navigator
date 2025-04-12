
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ATSChecksSection } from "./report/ATSChecksSection";
import { KeywordsSection } from "./report/KeywordsSection";
import { ScoreDisplay } from "./report/ScoreDisplay";
import { SuggestionsSection } from "./report/SuggestionsSection";
import { OptimizationPanel } from "./resume-optimization/OptimizationPanel";
import { StructureAnalysisSection } from "./report/StructureAnalysisSection";
import { AdvancedCriteriaSection } from "./report/AdvancedCriteriaSection";
import { PerformanceSection } from "./report/PerformanceSection";
import { TrophyIcon, ArrowRight, Sparkles, Save } from "lucide-react";
import ResumeParsingModal from './resume-optimization/parser/ResumeParsingModal';
import ResumeOptimizationPage from './resume-optimization/parser/ResumeOptimizationPage';

const ReportView = ({ matchScore, report, userRole, resumeText, jobDescriptionText }) => {
  const [optimizationMode, setOptimizationMode] = useState(false);
  const [showParsingModal, setShowParsingModal] = useState(false);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const [localResumeText, setLocalResumeText] = useState('');
  const [localJobText, setLocalJobText] = useState(''); // Added to store job text locally
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use effect to update local state when props change
  useEffect(() => {
    console.log("ReportView: Received resumeText prop:", resumeText ? `Present (length: ${resumeText.length})` : "Not present");
    console.log("ReportView: Received jobDescriptionText prop:", jobDescriptionText ? `Present (length: ${jobDescriptionText.length})` : "Not present");
    
    if (resumeText && resumeText.trim() !== '') {
      console.log("ReportView: Updating localResumeText from props");
      setLocalResumeText(resumeText);
    }
    
    if (jobDescriptionText && jobDescriptionText.trim() !== '') {
      console.log("ReportView: Updating localJobText from props");
      setLocalJobText(jobDescriptionText);
    }
  }, [resumeText, jobDescriptionText]);
  
  // Handle parse resume action
  const handleParseResume = () => {
    console.log("handleParseResume called", {
      resumeTextProp: resumeText ? `Present (length: ${resumeText.length})` : "Not present",
      localResumeText: localResumeText ? `Present (length: ${localResumeText.length})` : "Not present"
    });
    
    // Use local state for checking, with fallback to prop
    const textToUse = localResumeText || resumeText;
    
    // Check if resumeText exists and is not empty
    if (!textToUse || textToUse.trim() === '') {
      toast({
        title: "No resume found",
        description: "Please upload or paste your resume before optimizing.",
        variant: "destructive"
      });
      return;
    }
    
    setShowParsingModal(true);
  };
  
  // Handle parsed data from the parsing modal
  const handleParseComplete = (data) => {
    setParsedResumeData(data);
    setShowParsingModal(false);
    setOptimizationMode(true);
  };
  
  // Handle back button from optimization page
  const handleBackFromOptimization = () => {
    setOptimizationMode(false);
  };
  
  // Handle proceed button from optimization page
  const handleProceedFromOptimization = (updatedData) => {
    console.log("Proceeding with optimized data:", updatedData);
    
    // Create a full resume content from the optimized data
    const resumeContent = buildResumeContentFromData(updatedData);
    
    // Store the optimized resume in localStorage to be picked up by the ResumeDashboard
    const optimizedResumeData = {
      title: `Optimized Resume (${new Date().toLocaleDateString()})`,
      content: resumeContent,
      timestamp: Date.now()
    };
    
    localStorage.setItem('pendingOptimizedResume', JSON.stringify(optimizedResumeData));
    
    toast({
      title: "Resume optimized",
      description: "Your resume has been optimized and is ready to view in the dashboard.",
    });
    
    // Navigate to the resume dashboard
    navigate('/resumes');
  };
  
  // Build a complete resume content from the optimized data
  const buildResumeContentFromData = (data) => {
    let content = '';
    
    // Add contact information if available
    if (data.contactInfo) {
      content += `Contact Information\n\n`;
      if (data.contactInfo.name) content += `${data.contactInfo.name}\n`;
      if (data.contactInfo.email) content += `${data.contactInfo.email}\n`;
      if (data.contactInfo.phone) content += `${data.contactInfo.phone}\n`;
      if (data.contactInfo.location) content += `${data.contactInfo.location}\n`;
      if (data.contactInfo.linkedin) content += `${data.contactInfo.linkedin}\n`;
      content += '\n';
    }
    
    // Add summary if available
    if (data.summary) {
      content += `Professional Summary\n\n${data.summary}\n\n`;
    }
    
    // Add experiences
    if (data.experiences && data.experiences.length > 0) {
      content += `Work Experience\n\n`;
      data.experiences.forEach(exp => {
        if (exp.title) content += `${exp.title}`;
        if (exp.company) content += ` | ${exp.company}`;
        if (exp.startDate || exp.endDate) {
          content += ` | `;
          if (exp.startDate) content += `${exp.startDate}`;
          content += ` - `;
          if (exp.endDate) content += `${exp.endDate}`;
        }
        content += `\n`;
        
        if (exp.description) {
          // Split the description into bullet points if it contains any
          const descLines = exp.description.split('\n');
          descLines.forEach(line => {
            if (line.trim().startsWith('•')) {
              content += `${line.trim()}\n`;
            } else if (line.trim()) {
              content += `• ${line.trim()}\n`;
            }
          });
        }
        content += '\n';
      });
    }
    
    // Add education
    if (data.education && data.education.length > 0) {
      content += `Education\n\n`;
      data.education.forEach(edu => {
        if (edu.degree) content += `${edu.degree}`;
        if (edu.fieldOfStudy) content += ` in ${edu.fieldOfStudy}`;
        content += `\n`;
        if (edu.university) content += `${edu.university}`;
        if (edu.startDate || edu.endDate) {
          content += ` | `;
          if (edu.startDate) content += `${edu.startDate}`;
          content += ` - `;
          if (edu.endDate) content += `${edu.endDate}`;
        }
        content += `\n\n`;
      });
    }
    
    // Add skills
    if (data.skills && data.skills.length > 0) {
      content += `Skills\n\n`;
      content += data.skills.join(', ');
      content += `\n\n`;
    }
    
    // Add any other sections if present
    if (data.projects && data.projects.length > 0) {
      content += `Projects\n\n`;
      data.projects.forEach(project => {
        if (project.name) content += `${project.name}\n`;
        if (project.description) content += `${project.description}\n`;
        content += '\n';
      });
    }
    
    return content;
  };

  if (optimizationMode && parsedResumeData) {
    return (
      <ResumeOptimizationPage
        parsedData={parsedResumeData}
        onBack={handleBackFromOptimization}
        onProceed={handleProceedFromOptimization}
      />
    );
  }

  return (
    <>
      <div className="space-y-8">
        <ScoreDisplay matchScore={matchScore} />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Analysis Report</h2>
          {userRole === "recruiter" && (
            <div className="flex items-center text-sm text-muted-foreground">
              <TrophyIcon className="mr-2 h-4 w-4" />
              Recruiter View
            </div>
          )}
        </div>

        <ATSChecksSection checks={report.ats_checks} />
        <KeywordsSection 
          hardSkills={report.keywords.hard_skills} 
          softSkills={report.keywords.soft_skills} 
        />
        <AdvancedCriteriaSection criteria={report.advanced_criteria || []} />
        <PerformanceSection performanceIndicators={report.performance_indicators || {
          job_kpis: [],
          resume_kpis: [],
          match_percentage: 0
        }} />
        <StructureAnalysisSection 
          sectionAnalysis={report.section_analysis || {
            education: '',
            experience: '',
            skills: '',
            projects: ''
          }}
          improvementPotential={report.improvement_potential}
        />
        <SuggestionsSection suggestions={report.suggestions} />
        
        {/* Updated buttons to include Analyze and Save option */}
        <div className="flex justify-center mt-8 gap-4">
          <Button 
            onClick={handleParseResume}
            variant="default" 
            size="lg"
            className="flex items-center"
          >
            <Sparkles className="mr-2" />
            Optimize with AI Suggestions
          </Button>
          
          <Button 
            onClick={() => {
              // Store the current resume in localStorage and navigate
              if (resumeText || localResumeText) {
                const optimizedResumeData = {
                  title: `Resume Analysis (${new Date().toLocaleDateString()})`,
                  content: resumeText || localResumeText,
                  timestamp: Date.now()
                };
                
                localStorage.setItem('pendingOptimizedResume', JSON.stringify(optimizedResumeData));
                navigate('/resumes');
              } else {
                toast({
                  title: "No resume found",
                  description: "Please upload or paste your resume first.",
                  variant: "destructive"
                });
              }
            }}
            variant="outline" 
            size="lg"
            className="flex items-center"
          >
            <Save className="mr-2" />
            Analyze and Save
          </Button>
        </div>
      </div>
      
      {/* Parsing Modal */}
      {showParsingModal && (
        <ResumeParsingModal
          isOpen={showParsingModal}
          onClose={() => setShowParsingModal(false)}
          resumeText={localResumeText || resumeText}
          onParseComplete={handleParseComplete}
        />
      )}
    </>
  );
};

export default ReportView;
