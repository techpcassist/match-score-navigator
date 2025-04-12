
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { resumeExporter } from '@/utils/resumeExporter';
import { ResumeSection } from '@/types/resume';
import { 
  parseContentIntoSections, 
  generateResumeContent, 
  createDefaultSection 
} from '@/utils/resumeParser';
import { loadResumeData, saveResumeToStorage } from '@/utils/resumeStorage';

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
  const [error, setError] = useState<string | null>(null);
  
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
    loadResumeData(
      id, 
      setResumeTitle, 
      setSections, 
      setCurrentSection, 
      setRawContent, 
      setLoading, 
      setError, 
      setHasInitialized,
      parseContentIntoSections
    );
  }, [id]);

  // Separated the section initialization into its own effect with proper dependencies
  useEffect(() => {
    // Only run this effect after the initial loading is complete
    if (!loading && hasInitialized && sections.length === 0 && !error) {
      console.log("No sections available after loading, creating default section");
      const defaultSection = createDefaultSection();
      setSections([defaultSection]);
      setCurrentSection(defaultSection.id);
    }
  }, [loading, hasInitialized, sections.length, error]);

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

  // Save the resume data
  const saveResume = () => {
    saveResumeToStorage(id, resumeTitle, sections);
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
    error,
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
    generateResumeContent: () => generateResumeContent(sections)
  };
};
