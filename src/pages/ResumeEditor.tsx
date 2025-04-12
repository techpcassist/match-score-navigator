import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  FileDown, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  PlusCircle, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ResumePreview } from '@/components/resume-dashboard/ResumePreview';
import { SectionEditor } from '@/components/resume-dashboard/SectionEditor';
import { AddSectionDialog } from '@/components/resume-dashboard/AddSectionDialog';
import { AIAssistant } from '@/components/resume-dashboard/AIAssistant';
import { resumeExporter } from '@/utils/resumeExporter';

// Resume section type
interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

// Define standard section types
const sectionTypes = [
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
  "languages",
  "interests",
  "references",
  "custom"
];

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Resume state
  const [resumeTitle, setResumeTitle] = useState('');
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [rawContent, setRawContent] = useState('');
  
  // UI state
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Used for autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load resume data
    if (id) {
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        try {
          const resumes = JSON.parse(savedResumes);
          const resume = resumes.find((r: any) => r.id === id);
          
          if (resume) {
            setResumeTitle(resume.title);
            
            // If resume has sections already, use them
            if (resume.sections && Array.isArray(resume.sections)) {
              setSections(resume.sections);
              setCurrentSection(resume.sections[0]?.id || null);
            } else {
              // Otherwise, parse the content into sections
              setRawContent(resume.content || '');
              const parsedSections = parseContentIntoSections(resume.content || '');
              setSections(parsedSections);
              setCurrentSection(parsedSections[0]?.id || null);
            }
          } else {
            toast({
              title: "Resume not found",
              description: "The requested resume could not be loaded.",
              variant: "destructive"
            });
            navigate('/resumes');
          }
        } catch (error) {
          console.error('Error loading resume:', error);
          toast({
            title: "Error loading resume",
            description: "There was a problem loading your resume.",
            variant: "destructive"
          });
        }
      }
    }
  }, [id, navigate, toast]);

  // Parse resume content into sections
  const parseContentIntoSections = (content: string): ResumeSection[] => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const parsedSections: ResumeSection[] = [];
    let currentType = "summary";
    let currentTitle = "Summary";
    let currentContent = "";
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a section header
      const isSectionHeader = line.match(/^[A-Z][A-Za-z\s]*$/) && line.length < 30;
      
      if (isSectionHeader && currentContent) {
        // Save the current section
        parsedSections.push({
          id: `section-${Date.now()}-${parsedSections.length}`,
          title: currentTitle,
          content: currentContent.trim(),
          type: currentType
        });
        
        // Start a new section
        currentContent = "";
        currentTitle = line;
        
        // Determine section type based on title
        if (/contact|phone|email|address/i.test(line)) currentType = "contact";
        else if (/summary|objective|profile/i.test(line)) currentType = "summary";
        else if (/experience|work|employment|history/i.test(line)) currentType = "experience";
        else if (/education|academic|school|university|college/i.test(line)) currentType = "education";
        else if (/skill|expertise|competenc/i.test(line)) currentType = "skills";
        else if (/project/i.test(line)) currentType = "projects";
        else if (/certification|certificate/i.test(line)) currentType = "certifications";
        else if (/award|honor|achievement/i.test(line)) currentType = "awards";
        else if (/language/i.test(line)) currentType = "languages";
        else if (/interest|hobby|activit/i.test(line)) currentType = "interests";
        else if (/reference/i.test(line)) currentType = "references";
        else currentType = "custom";
      } else {
        // Add line to current content
        currentContent += line + '\n';
      }
    }
    
    // Add the last section
    if (currentContent.trim()) {
      parsedSections.push({
        id: `section-${Date.now()}-${parsedSections.length}`,
        title: currentTitle,
        content: currentContent.trim(),
        type: currentType
      });
    }
    
    // If no sections were created, create a default summary section
    if (parsedSections.length === 0) {
      parsedSections.push({
        id: `section-${Date.now()}-0`,
        title: "Summary",
        content: content.trim(),
        type: "summary"
      });
    }
    
    return parsedSections;
  };

  // Save the resume data
  const saveResume = () => {
    if (!id) return;
    
    try {
      const savedResumes = localStorage.getItem('resumes');
      const resumes = savedResumes ? JSON.parse(savedResumes) : [];
      
      // Find the resume index
      const resumeIndex = resumes.findIndex((r: any) => r.id === id);
      
      if (resumeIndex !== -1) {
        // Update existing resume
        resumes[resumeIndex] = {
          ...resumes[resumeIndex],
          title: resumeTitle,
          lastModified: new Date(),
          content: generateResumeContent(),
          sections: sections
        };
      }
      
      localStorage.setItem('resumes', JSON.stringify(resumes));
      
      toast({
        title: "Resume saved",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error saving resume",
        description: "There was a problem saving your changes.",
        variant: "destructive"
      });
    }
  };

  // Auto-save on changes
  useEffect(() => {
    if (isEditing) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        saveResume();
        setIsEditing(false);
      }, 2000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sections, resumeTitle, isEditing]);

  // Generate full resume content from sections
  const generateResumeContent = (): string => {
    return sections.map(section => `${section.title}\n\n${section.content}`).join('\n\n');
  };

  // Handle section updates
  const handleSectionUpdate = (updatedSection: ResumeSection) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    setIsEditing(true);
  };

  // Add a new section
  const handleAddSection = (newSection: ResumeSection) => {
    setSections(prev => [...prev, newSection]);
    setCurrentSection(newSection.id);
    setShowAddSectionDialog(false);
    setIsEditing(true);
  };

  // Delete a section
  const handleDeleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    
    // If the deleted section was the current one, select another section
    if (currentSection === sectionId) {
      const remainingSections = sections.filter(section => section.id !== sectionId);
      setCurrentSection(remainingSections[0]?.id || null);
    }
    
    setIsEditing(true);
  };

  // Move section up or down
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const newSections = [...sections];
    
    if (direction === 'up' && sectionIndex > 0) {
      // Swap with the previous section
      [newSections[sectionIndex - 1], newSections[sectionIndex]] = 
      [newSections[sectionIndex], newSections[sectionIndex - 1]];
    } else if (direction === 'down' && sectionIndex < sections.length - 1) {
      // Swap with the next section
      [newSections[sectionIndex], newSections[sectionIndex + 1]] = 
      [newSections[sectionIndex + 1], newSections[sectionIndex]];
    }
    
    setSections(newSections);
    setIsEditing(true);
  };

  // Export resume as PDF or DOCX
  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await resumeExporter.exportToPdf(resumeTitle, sections);
      } else {
        await resumeExporter.exportToDocx(resumeTitle, sections);
      }
      
      toast({
        title: `Export complete`,
        description: `Your resume has been exported as ${format.toUpperCase()}.`
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast({
        title: "Export failed",
        description: `There was a problem exporting your resume as ${format.toUpperCase()}.`,
        variant: "destructive"
      });
    }
  };

  // AI content suggestion handler
  const handleAISuggestion = (sectionId: string, suggestion: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, content: suggestion } 
          : section
      )
    );
    setIsEditing(true);
    
    toast({
      title: "AI suggestion applied",
      description: "The suggested content has been added to your resume."
    });
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/resumes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            value={resumeTitle}
            onChange={(e) => {
              setResumeTitle(e.target.value);
              setIsEditing(true);
            }}
            className="font-bold text-xl h-10 w-64"
            placeholder="Resume Title"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('docx')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export DOCX
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('pdf')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            size="sm"
            onClick={saveResume}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Editor</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Show Preview
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border h-[calc(100vh-180px)] overflow-hidden">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddSectionDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Section
              </Button>
              
              <div className="flex-1 overflow-x-auto">
                <Tabs 
                  value={currentSection || ''} 
                  onValueChange={setCurrentSection}
                  className="w-full"
                >
                  <TabsList className="inline-flex h-9 w-auto">
                    {sections.map(section => (
                      <TabsTrigger 
                        key={section.id} 
                        value={section.id}
                        className="h-8 px-3"
                      >
                        {section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {sections.map(section => (
                <TabsContent 
                  key={section.id} 
                  value={section.id}
                  className="h-full m-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={section.title}
                        onChange={(e) => handleSectionUpdate({ ...section, title: e.target.value })}
                        className="w-48 h-8"
                        placeholder="Section Title"
                      />
                      <Select 
                        value={section.type}
                        onValueChange={(value) => handleSectionUpdate({ ...section, type: value })}
                      >
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue placeholder="Section Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectionTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMoveSection(section.id, 'up')}
                        disabled={sections.indexOf(section) === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleMoveSection(section.id, 'down')}
                        disabled={sections.indexOf(section) === sections.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteSection(section.id)}
                        disabled={sections.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <SectionEditor
                    section={section}
                    onUpdate={handleSectionUpdate}
                  />
                  
                  <AIAssistant
                    sectionType={section.type}
                    sectionId={section.id}
                    existingContent={section.content}
                    onSuggestionApply={handleAISuggestion}
                  />
                </TabsContent>
              ))}
            </div>
          </div>
        </div>
        
        {showPreview && (
          <div className="lg:w-1/2">
            <h2 className="text-lg font-medium mb-2">Preview</h2>
            <div className="bg-white p-6 rounded-lg border min-h-[calc(100vh-180px)] overflow-y-auto shadow-sm">
              <ResumePreview 
                title={resumeTitle}
                sections={sections}
              />
            </div>
          </div>
        )}
      </div>
      
      <AddSectionDialog
        open={showAddSectionDialog}
        onOpenChange={setShowAddSectionDialog}
        onAdd={handleAddSection}
      />
    </div>
  );
};

export default ResumeEditor;
