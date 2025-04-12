
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sparkles, Save } from 'lucide-react';
import { parseContentIntoSections } from '@/utils/resumeParser';

interface ReportActionsProps {
  resumeText: string;
  localResumeText: string;
  onParseResume: () => void;
}

export const ReportActions: React.FC<ReportActionsProps> = ({ 
  resumeText, 
  localResumeText, 
  onParseResume 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Save current resume directly to editor
  const handleSaveAndEdit = () => {
    const textToUse = localResumeText || resumeText;
    
    if (!textToUse || textToUse.trim() === '') {
      toast({
        title: "No resume found",
        description: "Please upload or paste your resume first.",
        variant: "destructive"
      });
      return;
    }
    
    // Create resume sections from the content
    const sections = parseContentIntoSections(textToUse);
    
    // Create a new resume entry
    const newResume = {
      id: `resume-${Date.now()}`,
      title: `Resume Analysis (${new Date().toLocaleDateString()})`,
      lastModified: new Date(),
      content: textToUse,
      sections: sections
    };
    
    // Get existing resumes or initialize empty array
    const savedResumes = localStorage.getItem('resumes');
    const resumes = savedResumes ? JSON.parse(savedResumes) : [];
    
    // Add new resume to the array
    resumes.push(newResume);
    
    // Save updated resumes array
    localStorage.setItem('resumes', JSON.stringify(resumes));
    
    toast({
      title: "Resume saved",
      description: "Your resume has been saved to your dashboard.",
    });
    
    // Navigate directly to the editor for this resume
    navigate(`/resumes/edit/${newResume.id}`);
  };

  return (
    <div className="flex justify-center mt-8 gap-4">
      <Button 
        onClick={onParseResume}
        variant="default" 
        size="lg"
        className="flex items-center"
      >
        <Sparkles className="mr-2" />
        Optimize with AI Suggestions
      </Button>
      
      <Button 
        onClick={handleSaveAndEdit}
        variant="outline" 
        size="lg"
        className="flex items-center"
      >
        <Save className="mr-2" />
        Save & Edit Resume
      </Button>
    </div>
  );
};
