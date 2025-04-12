
import React, { useState } from 'react';
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
    toast({
      title: "Progress saved",
      description: "Your optimization progress has been saved.",
    });
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
              Save Progress
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
