import { Resume, ResumeSection } from '@/types/resume';
import { generateResumeContent } from './resumeParser';
import { useToast } from '@/hooks/use-toast';

export const loadResumeData = (
  id: string | undefined,
  setResumeTitle: (title: string) => void,
  setSections: (sections: ResumeSection[]) => void,
  setCurrentSection: (sectionId: string | null) => void,
  setRawContent: (content: string) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setHasInitialized: (initialized: boolean) => void,
  parseContentIntoSections: (content: string) => ResumeSection[]
) => {
  setLoading(true);
  setError(null);
  
  try {
    if (!id) {
      console.error("No ID provided");
      setError("No resume ID provided");
      setLoading(false);
      setHasInitialized(true);
      return;
    }
    
    const savedResumes = localStorage.getItem('resumes');
    
    if (!savedResumes) {
      console.error("No resumes found in localStorage");
      setError("No resumes found");
      setLoading(false);
      setHasInitialized(true);
      return;
    }
    
    console.log("Loading resumes from localStorage");
    const resumes = JSON.parse(savedResumes);
    console.log("Found resumes:", resumes);
    
    if (!Array.isArray(resumes) || resumes.length === 0) {
      console.error("No resumes available in localStorage");
      setError("No resumes available");
      setLoading(false);
      setHasInitialized(true);
      return;
    }
    
    // Check if we're in the special case with :id as the parameter
    if (id === ':id') {
      console.error("Invalid resume ID: :id");
      setError("Invalid resume ID");
      setLoading(false);
      setHasInitialized(true);
      return;
    }
    
    const resume = resumes.find((r: any) => r.id === id);
    
    if (!resume) {
      console.error("Resume not found with ID:", id);
      setError(`Resume not found with ID: ${id}`);
      setLoading(false);
      setHasInitialized(true);
      return;
    }
    
    console.log("Found resume with ID:", id, resume);
    setResumeTitle(resume.title || 'Untitled Resume');
    
    // If resume has sections already, use them
    if (resume.sections && Array.isArray(resume.sections) && resume.sections.length > 0) {
      console.log("Using existing sections:", resume.sections);
      setSections(resume.sections);
      setCurrentSection(resume.sections[0]?.id || null);
    }
    // Check for pendingOptimizedResume if this is a newly created optimized resume
    else if (resume.fromOptimization && localStorage.getItem('pendingOptimizedResume')) {
      try {
        const optimizedData = JSON.parse(localStorage.getItem('pendingOptimizedResume') || '');
        if (optimizedData && optimizedData.sections) {
          console.log("Using sections from optimized resume:", optimizedData.sections);
          setSections(optimizedData.sections);
          setCurrentSection(optimizedData.sections[0]?.id || null);
        } else {
          console.log("Parsing content from optimized resume:", optimizedData?.content);
          const parsedSections = parseContentIntoSections(optimizedData?.content || '');
          setSections(parsedSections);
          setCurrentSection(parsedSections[0]?.id || null);
        }
      } catch (err) {
        console.error("Error parsing optimized resume data:", err);
        // Fall back to normal content parsing
        setRawContent(resume.content || '');
        const parsedSections = parseContentIntoSections(resume.content || '');
        setSections(parsedSections);
        setCurrentSection(parsedSections[0]?.id || null);
      }
    } 
    // Otherwise, parse the content into sections
    else {
      console.log("Parsing content into sections:", resume.content);
      setRawContent(resume.content || '');
      const parsedSections = parseContentIntoSections(resume.content || '');
      console.log("Parsed sections:", parsedSections);
      setSections(parsedSections);
      setCurrentSection(parsedSections[0]?.id || null);
    }
    
    setLoading(false);
    setHasInitialized(true);
  } catch (error) {
    console.error('Error loading resume:', error);
    setError('Error loading resume data');
    setLoading(false);
    setHasInitialized(true);
  }
};

export const saveResumeToStorage = (
  id: string | undefined,
  resumeTitle: string,
  sections: ResumeSection[]
) => {
  if (!id) return;
  const { toast } = useToast();
  
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
        content: generateResumeContent(sections),
        sections: sections
      };
      
      // If this was from optimization, mark it as saved and clear the pending data
      if (resumes[resumeIndex].fromOptimization) {
        resumes[resumeIndex].fromOptimization = false;
        localStorage.removeItem('pendingOptimizedResume');
      }
    }
    
    localStorage.setItem('resumes', JSON.stringify(resumes));
    
    toast({
      title: "Resume saved",
      description: "Your changes have been saved successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error saving resume:', error);
    toast({
      title: "Error saving resume",
      description: "There was a problem saving your changes.",
      variant: "destructive"
    });
    
    return false;
  }
};
