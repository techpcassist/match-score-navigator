
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
  sections?: any[];
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
        createResume(
          optimizedResume.title || 'Optimized Resume',
          optimizedResume.content,
          optimizedResume.sections || []
        );
        
        // Clear the pending optimized resume
        localStorage.removeItem('pendingOptimizedResume');
        
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

  const createResume = (title: string, content: string = '', sections: any[] = []) => {
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      title,
      lastModified: new Date(),
      content,
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
    
    toast({
      title: "Resume deleted",
      description: "The resume has been removed from your dashboard.",
    });
  };

  const saveResume = (id: string, updatedData: Partial<Resume>) => {
    const updatedResumes = resumes.map(resume => {
      if (resume.id === id) {
        return {
          ...resume,
          ...updatedData,
          lastModified: new Date()
        };
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
