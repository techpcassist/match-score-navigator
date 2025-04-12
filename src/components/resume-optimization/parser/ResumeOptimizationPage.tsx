
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SummarySection from './sections/SummarySection';
import ExperiencesSection from './sections/ExperiencesSection';
import EducationSection from './sections/EducationSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import { useToast } from '@/components/ui/use-toast';

interface ParsedResumeData {
  summary: string;
  experiences: any[];
  education: any[];
  contact_details: any;
}

interface ResumeOptimizationPageProps {
  parsedData: ParsedResumeData;
  onBack: () => void;
  onProceed: (updatedData: ParsedResumeData) => void;
}

const ResumeOptimizationPage: React.FC<ResumeOptimizationPageProps> = ({
  parsedData,
  onBack,
  onProceed
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [formData, setFormData] = useState<ParsedResumeData>(parsedData);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const updateSummary = (summary: string) => {
    setFormData(prev => ({ ...prev, summary }));
  };
  
  const updateExperiences = (experiences: any[]) => {
    setFormData(prev => ({ ...prev, experiences }));
  };
  
  const updateEducation = (education: any[]) => {
    setFormData(prev => ({ ...prev, education }));
  };
  
  const updateContactDetails = (contact_details: any) => {
    setFormData(prev => ({ ...prev, contact_details }));
  };
  
  const handleProceed = () => {
    // Basic validation before proceeding
    if (!formData.summary?.trim()) {
      toast({
        title: "Missing summary",
        description: "Please provide a summary of your resume.",
        variant: "destructive"
      });
      setActiveTab('summary');
      return;
    }
    
    if (!formData.experiences?.length) {
      toast({
        title: "No work experience",
        description: "Please add at least one work experience entry.",
        variant: "destructive"
      });
      setActiveTab('experiences');
      return;
    }
    
    // Send the updated data back to the parent component
    onProceed(formData);
  };
  
  const handleSave = () => {
    // Build resume content from the form data
    const resumeContent = buildResumeContentFromData(formData);
    
    // Save directly to localStorage for the resume dashboard
    const newResume = {
      id: `resume-${Date.now()}`,
      title: `Optimized Resume (${new Date().toLocaleDateString()})`,
      lastModified: new Date(),
      content: resumeContent,
      sections: buildResumeSections(formData)
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
      description: "Your optimized resume has been saved to your dashboard.",
    });
    
    // Navigate to the resume editor for the new resume
    navigate(`/resumes/edit/${newResume.id}`);
  };
  
  // Build a complete resume content from the optimized data
  const buildResumeContentFromData = (data: ParsedResumeData): string => {
    let content = '';
    
    // Add contact information if available
    if (data.contact_details) {
      content += `Contact Information\n\n`;
      if (data.contact_details.name) content += `${data.contact_details.name}\n`;
      if (data.contact_details.email) content += `${data.contact_details.email}\n`;
      if (data.contact_details.phone) content += `${data.contact_details.phone}\n`;
      if (data.contact_details.location) content += `${data.contact_details.location}\n`;
      if (data.contact_details.linkedin) content += `${data.contact_details.linkedin}\n`;
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
    
    return content;
  };
  
  // Build resume sections for the editor
  const buildResumeSections = (data: ParsedResumeData): any[] => {
    const sections = [];
    
    // Contact section
    if (data.contact_details) {
      let contactContent = '';
      if (data.contact_details.name) contactContent += `${data.contact_details.name}\n`;
      if (data.contact_details.email) contactContent += `${data.contact_details.email}\n`;
      if (data.contact_details.phone) contactContent += `${data.contact_details.phone}\n`;
      if (data.contact_details.location) contactContent += `${data.contact_details.location}\n`;
      if (data.contact_details.linkedin) contactContent += `${data.contact_details.linkedin}\n`;
      
      sections.push({
        id: `section-${Date.now()}-contact`,
        title: 'Contact Information',
        content: contactContent.trim(),
        type: 'contact'
      });
    }
    
    // Summary section
    if (data.summary) {
      sections.push({
        id: `section-${Date.now()}-summary`,
        title: 'Professional Summary',
        content: data.summary.trim(),
        type: 'summary'
      });
    }
    
    // Experience section
    if (data.experiences && data.experiences.length > 0) {
      let experienceContent = '';
      
      data.experiences.forEach(exp => {
        if (exp.title) experienceContent += `**${exp.title}**`;
        if (exp.company) experienceContent += ` | ${exp.company}`;
        if (exp.startDate || exp.endDate) {
          experienceContent += ` | `;
          if (exp.startDate) experienceContent += `${exp.startDate}`;
          experienceContent += ` - `;
          if (exp.endDate) experienceContent += `${exp.endDate}`;
        }
        experienceContent += `\n\n`;
        
        if (exp.description) {
          // Format the description with bullet points
          const descLines = exp.description.split('\n');
          descLines.forEach(line => {
            if (line.trim().startsWith('•')) {
              experienceContent += `${line.trim()}\n`;
            } else if (line.trim()) {
              experienceContent += `• ${line.trim()}\n`;
            }
          });
        }
        experienceContent += `\n`;
      });
      
      sections.push({
        id: `section-${Date.now()}-experience`,
        title: 'Work Experience',
        content: experienceContent.trim(),
        type: 'experience'
      });
    }
    
    // Education section
    if (data.education && data.education.length > 0) {
      let educationContent = '';
      
      data.education.forEach(edu => {
        if (edu.degree) educationContent += `**${edu.degree}**`;
        if (edu.fieldOfStudy) educationContent += ` in ${edu.fieldOfStudy}`;
        educationContent += `\n`;
        if (edu.university) educationContent += `${edu.university}`;
        if (edu.startDate || edu.endDate) {
          educationContent += ` | `;
          if (edu.startDate) educationContent += `${edu.startDate}`;
          educationContent += ` - `;
          if (edu.endDate) educationContent += `${edu.endDate}`;
        }
        educationContent += `\n\n`;
      });
      
      sections.push({
        id: `section-${Date.now()}-education`,
        title: 'Education',
        content: educationContent.trim(),
        type: 'education'
      });
    }
    
    return sections;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Resume Optimization</CardTitle>
        <CardDescription>
          Review and edit the information extracted from your resume to ensure accuracy before
          generating AI suggestions.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="experiences">Work Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4">
            <SummarySection 
              summary={formData.summary} 
              onChange={updateSummary} 
            />
          </TabsContent>
          
          <TabsContent value="experiences" className="mt-4">
            <ExperiencesSection 
              experiences={formData.experiences} 
              onChange={updateExperiences} 
            />
          </TabsContent>
          
          <TabsContent value="education" className="mt-4">
            <EducationSection 
              education={formData.education} 
              onChange={updateEducation} 
            />
          </TabsContent>
          
          <TabsContent value="contact" className="mt-4">
            <ContactDetailsSection 
              contactDetails={formData.contact_details} 
              onChange={updateContactDetails} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save & Edit in Resume Builder
            </Button>
            
            <Button onClick={handleProceed} className="flex items-center">
              Save & Analyze for Suggestions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeOptimizationPage;
