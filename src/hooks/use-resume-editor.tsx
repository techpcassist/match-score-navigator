import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { resumeExporter } from '@/utils/resumeExporter';

// Resume section type
interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

export const useResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Resume state
  const [resumeTitle, setResumeTitle] = useState('');
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [rawContent, setRawContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Used for autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to create a default section if no sections exist after loading completes
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Load resume data
    if (id) {
      loadResumeData();
    }
  }, [id]);

  // Separated the section initialization into its own effect with proper dependencies
  useEffect(() => {
    // Only run this effect after the initial loading is complete
    if (!loading && hasInitialized && sections.length === 0) {
      console.log("No sections available after loading, creating default section");
      createDefaultSection();
    }
  }, [loading, hasInitialized, sections.length]);

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

  const loadResumeData = () => {
    setLoading(true);
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      try {
        console.log("Loading resumes from localStorage");
        const resumes = JSON.parse(savedResumes);
        console.log("Found resumes:", resumes);
        const resume = resumes.find((r: any) => r.id === id);
        
        if (resume) {
          console.log("Found resume with ID:", id, resume);
          setResumeTitle(resume.title || 'Untitled Resume');
          
          // If resume has sections already, use them
          if (resume.sections && Array.isArray(resume.sections) && resume.sections.length > 0) {
            console.log("Using existing sections:", resume.sections);
            setSections(resume.sections);
            setCurrentSection(resume.sections[0]?.id || null);
          } else {
            // Otherwise, parse the content into sections
            console.log("Parsing content into sections:", resume.content);
            setRawContent(resume.content || '');
            const parsedSections = parseContentIntoSections(resume.content || '');
            console.log("Parsed sections:", parsedSections);
            setSections(parsedSections);
            setCurrentSection(parsedSections[0]?.id || null);
          }
        } else {
          console.error("Resume not found with ID:", id);
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
      } finally {
        setLoading(false);
        setHasInitialized(true);
      }
    } else {
      console.error("No resumes found in localStorage");
      setLoading(false);
      setHasInitialized(true);
    }
  };

  const createDefaultSection = () => {
    const defaultSection = {
      id: `section-${Date.now()}-0`,
      title: "Summary",
      content: "",
      type: "summary"
    };
    setSections([defaultSection]);
    setCurrentSection(defaultSection.id);
  };

  // Parse resume content into sections
  const parseContentIntoSections = (content: string): ResumeSection[] => {
    if (!content || typeof content !== 'string') {
      console.log("Creating default section due to empty content");
      return [{
        id: `section-${Date.now()}-0`,
        title: "Summary",
        content: "",
        type: "summary"
      }];
    }
    
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
      console.log("Creating default section as no sections were parsed");
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

  return {
    id,
    resumeTitle,
    setResumeTitle,
    sections,
    currentSection,
    setCurrentSection,
    loading,
    showAddSectionDialog,
    setShowAddSectionDialog,
    showPreview,
    setShowPreview,
    isEditing,
    setIsEditing,
    saveResume,
    handleExport,
    handleSectionUpdate,
    handleAddSection,
    handleDeleteSection,
    handleMoveSection,
    handleAISuggestion,
    generateResumeContent
  };
};
