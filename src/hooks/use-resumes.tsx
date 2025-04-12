
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
  sections?: any[];
  fromOptimization?: boolean;
}

export const useResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load resumes from localStorage
  useEffect(() => {
    loadResumes();
    checkForOptimizedResume();
  }, []);

  const loadResumes = () => {
    console.log("Loading resumes in dashboard");
    setLoading(true);
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      try {
        const parsedResumes = JSON.parse(savedResumes);
        console.log("Parsed resumes:", parsedResumes);
        // Convert string dates back to Date objects
        const formattedResumes = parsedResumes.map((resume: any) => ({
          ...resume,
          lastModified: new Date(resume.lastModified)
        }));
        setResumes(formattedResumes);
      } catch (error) {
        console.error('Error parsing resumes from localStorage:', error);
        setResumes([]);
      }
    } else {
      console.log("No resumes found in localStorage");
    }
    setLoading(false);
  };

  const checkForOptimizedResume = () => {
    const pendingOptimizedResume = localStorage.getItem('pendingOptimizedResume');
    if (pendingOptimizedResume) {
      try {
        console.log("Found pending optimized resume");
        const optimizedResume = JSON.parse(pendingOptimizedResume);
        
        // Create a new resume from the optimized content
        const newResume = createResume(
          optimizedResume.title || 'Optimized Resume',
          optimizedResume.content,
          optimizedResume.sections || [],
          true // Mark this as coming from optimization
        );
        
        // Don't clear pendingOptimizedResume yet so it can be used when editing
        // We'll clear it after the user saves changes to the resume
        
        // Show success toast
        toast({
          title: "Resume added",
          description: "Your optimized resume has been added to your dashboard.",
        });
      } catch (error) {
        console.error('Error processing optimized resume:', error);
      }
    }
  };

  const createResume = (
    title: string, 
    content: string = '', 
    sections: any[] = [],
    fromOptimization: boolean = false
  ) => {
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      title,
      lastModified: new Date(),
      content,
      fromOptimization,
      sections: sections.length > 0 ? sections : [
        {
          id: `section-${Date.now()}-0`,
          title: "Summary",
          content: "",
          type: "summary"
        }
      ]
    };

    console.log("Creating new resume:", newResume);
    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    
    // Save to localStorage
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    return newResume;
  };

  const deleteResume = (id: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    // If this was an optimized resume and we deleted it, clear the pending data
    const pendingOptimizedResume = localStorage.getItem('pendingOptimizedResume');
    if (pendingOptimizedResume) {
      try {
        const optimizedResume = JSON.parse(pendingOptimizedResume);
        const deletedResume = resumes.find(r => r.id === id);
        
        if (deletedResume && deletedResume.fromOptimization && 
            optimizedResume.title === deletedResume.title) {
          localStorage.removeItem('pendingOptimizedResume');
        }
      } catch (error) {
        console.error('Error processing optimized resume during delete:', error);
      }
    }
    
    toast({
      title: "Resume deleted",
      description: "The resume has been removed from your dashboard.",
    });
  };

  const saveResume = (id: string, updatedData: Partial<Resume>) => {
    const updatedResumes = resumes.map(resume => {
      if (resume.id === id) {
        const savedResume = {
          ...resume,
          ...updatedData,
          lastModified: new Date()
        };
        
        // If this was from optimization and we're saving it, clear the pending data
        if (resume.fromOptimization) {
          localStorage.removeItem('pendingOptimizedResume');
          savedResume.fromOptimization = false;
        }
        
        return savedResume;
      }
      return resume;
    });
    
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    toast({
      title: "Resume saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const getResumeById = (id: string): Resume | undefined => {
    return resumes.find(resume => resume.id === id);
  };

  return {
    resumes,
    loading,
    createResume,
    deleteResume,
    saveResume,
    getResumeById,
    loadResumes
  };
};
