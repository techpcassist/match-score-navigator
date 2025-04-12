
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResumeEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export const ResumeEditor = ({ initialContent, onChange }: ResumeEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [sections, setSections] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<string>('full');
  const isMobile = useIsMobile();
  
  // Parse the resume into sections when content changes
  useEffect(() => {
    setContent(initialContent);
    const parsedSections = parseResumeIntoSections(initialContent);
    setSections(parsedSections);
  }, [initialContent]);
  
  const parseResumeIntoSections = (text: string): {[key: string]: string} => {
    const result: {[key: string]: string} = {
      summary: '',
      experience: '',
      education: '',
      skills: '',
      certifications: '',
      projects: '',
      other: ''
    };
    
    const lines = text.split('\n');
    let currentSection = 'other';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      
      // Detect section headers
      if (line.includes('summary') || line.includes('objective') || line.includes('profile')) {
        currentSection = 'summary';
        result[currentSection] += lines[i] + '\n';
        continue;
      } else if (line.includes('experience') || line.includes('employment') || line.includes('work history')) {
        currentSection = 'experience';
        result[currentSection] += lines[i] + '\n';
        continue;
      } else if (line.includes('education') || line.includes('academic')) {
        currentSection = 'education';
        result[currentSection] += lines[i] + '\n';
        continue;
      } else if (line.includes('skills') || line.includes('expertise') || line.includes('competencies')) {
        currentSection = 'skills';
        result[currentSection] += lines[i] + '\n';
        continue;
      } else if (line.includes('certification') || line.includes('certificate')) {
        currentSection = 'certifications';
        result[currentSection] += lines[i] + '\n';
        continue;
      } else if (line.includes('project')) {
        currentSection = 'projects';
        result[currentSection] += lines[i] + '\n';
        continue;
      }
      
      // Add line to current section
      if (currentSection) {
        result[currentSection] += lines[i] + '\n';
      } else {
        result.other += lines[i] + '\n';
      }
    }
    
    return result;
  };
  
  const handleSectionChange = (section: string, newContent: string) => {
    const updatedSections = { ...sections, [section]: newContent };
    setSections(updatedSections);
    
    // Reconstruct full content
    const newFullContent = [
      updatedSections.summary, 
      updatedSections.experience, 
      updatedSections.education, 
      updatedSections.skills, 
      updatedSections.certifications, 
      updatedSections.projects, 
      updatedSections.other
    ].filter(Boolean).join('\n\n');
    
    setContent(newFullContent);
    onChange(newFullContent);
  };
  
  const handleFullContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
    
    // Re-parse sections
    const parsedSections = parseResumeIntoSections(newContent);
    setSections(parsedSections);
  };
  
  const renderMobileTabs = () => (
    <TabsList className="flex flex-wrap gap-1 mb-4">
      <TabsTrigger value="full" className="flex-1">Full</TabsTrigger>
      <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
      <TabsTrigger value="experience" className="flex-1">Work</TabsTrigger>
      <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
      <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
    </TabsList>
  );
  
  const renderDesktopTabs = () => (
    <TabsList className="grid grid-cols-7 mb-4">
      <TabsTrigger value="full">Full Resume</TabsTrigger>
      <TabsTrigger value="summary">Summary</TabsTrigger>
      <TabsTrigger value="experience">Experience</TabsTrigger>
      <TabsTrigger value="education">Education</TabsTrigger>
      <TabsTrigger value="skills">Skills</TabsTrigger>
      <TabsTrigger value="certifications">Certifications</TabsTrigger>
      <TabsTrigger value="projects">Projects</TabsTrigger>
    </TabsList>
  );
  
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-muted-foreground mb-2 text-sm md:text-base">
          Edit your optimized resume below. All accepted suggestions have been applied.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          {isMobile ? renderMobileTabs() : renderDesktopTabs()}
          
          <TabsContent value="full">
            <Textarea
              value={content}
              onChange={handleFullContentChange}
              rows={isMobile ? 15 : 20}
              className="font-mono resize-none text-sm md:text-base"
            />
          </TabsContent>
          
          {Object.keys(sections).filter(section => section !== 'other').map(section => (
            <TabsContent key={section} value={section}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium capitalize">{section}</h3>
                <Separator />
                <Textarea
                  value={sections[section]}
                  onChange={(e) => handleSectionChange(section, e.target.value)}
                  rows={isMobile ? 12 : 16}
                  className="font-mono resize-none text-sm md:text-base"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
