
import { useState, useEffect } from 'react';
import { callGenerativeAI } from '@/components/resume-optimization/utils/ai-helper';
import { toast } from '@/hooks/use-toast';
import { Experience } from '../../../types';

export const useExperienceEnhancement = (experience: Experience, onUpdate: (field: keyof Experience, value: any) => void) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [isGeneratingTailored, setIsGeneratingTailored] = useState(false);
  const [tailoredSuggestions, setTailoredSuggestions] = useState<string[]>([]);
  const [showTailoredSuggestions, setShowTailoredSuggestions] = useState(false);

  // Generate tailored suggestions when job title changes
  useEffect(() => {
    if (experience.job_title && experience.job_title.trim() !== '') {
      // Clear old suggestions
      setTailoredSuggestions([]);
    }
  }, [experience.job_title]);

  const handleEnhanceResponsibilities = async () => {
    if (!experience.job_title || !experience.responsibilities_text) {
      toast({
        title: "Missing information",
        description: "Please add a job title and some responsibilities before enhancing.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const prompt = `Enhance the following job description for a ${experience.job_title} position to be more compelling, professional, and include specific achievements with metrics where possible. Maintain the original meaning but make it more impressive for a resume:
      
      "${experience.responsibilities_text}"
      
      Please use bullet points (•) for each point and ensure all bullet points start with powerful action verbs. Limit to 4-6 bullet points total.`;
      
      const enhancedText = await callGenerativeAI(prompt);
      
      if (enhancedText) {
        onUpdate('responsibilities_text', enhancedText);
        toast({
          title: "Text enhanced",
          description: "Your responsibilities have been professionally enhanced.",
        });
      } else {
        toast({
          title: "Enhancement failed",
          description: "Could not enhance description. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enhancing text:", error);
      toast({
        title: "Error",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateSuggestion = async () => {
    if (!experience.job_title) {
      toast({
        title: "Missing job title",
        description: "Please add a job title before generating suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSuggestion(true);
    try {
      const prompt = `Generate a specific job duty or achievement for a ${experience.job_title} position that includes a measurable outcome or metric. The duty should be 1-2 sentences maximum and start with an action verb.`;
      
      const suggestion = await callGenerativeAI(prompt);
      
      if (suggestion) {
        // Add the suggested duty to the current description
        const updatedDescription = experience.responsibilities_text 
          ? `${experience.responsibilities_text}\n• ${suggestion}` 
          : `• ${suggestion}`;
          
        onUpdate('responsibilities_text', updatedDescription);
        toast({
          title: "Suggestion added",
          description: "A new duty has been added to your responsibilities.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate suggestion. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const generateTailoredSuggestions = async () => {
    if (!experience.job_title) {
      toast({
        title: "Missing job title",
        description: "Please add a job title to generate tailored suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingTailored(true);
    try {
      const prompt = `Generate 5 specific responsibilities and achievements for a ${experience.job_title} position. 
      Each should be concise (one sentence), start with a strong action verb, and include quantifiable metrics where possible.
      Format as a list with each item on a new line, without bullet points or numbers. 
      Make them impressive for a resume.`;
      
      const result = await callGenerativeAI(prompt);
      
      if (result) {
        // Split into array and clean up
        const suggestions = result
          .split('\n')
          .filter(item => item.trim() !== '')
          .map(item => item.replace(/^[•-]\s*/, '').trim());
        
        setTailoredSuggestions(suggestions);
        setShowTailoredSuggestions(true);
        
        toast({
          title: "Suggestions generated",
          description: "Tailored suggestions for your role are ready to review.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Could not generate tailored suggestions. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating tailored suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate tailored suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTailored(false);
    }
  };

  const addTailoredSuggestion = (suggestion: string) => {
    // Add the selected suggestion to the responsibilities
    const updatedDescription = experience.responsibilities_text
      ? `${experience.responsibilities_text}\n• ${suggestion}`
      : `• ${suggestion}`;
      
    onUpdate('responsibilities_text', updatedDescription);
    
    toast({
      title: "Suggestion added",
      description: "The selected suggestion has been added to your responsibilities.",
    });
  };

  return {
    isEnhancing,
    isGeneratingSuggestion,
    isGeneratingTailored,
    tailoredSuggestions,
    showTailoredSuggestions,
    setShowTailoredSuggestions,
    handleEnhanceResponsibilities,
    handleGenerateSuggestion,
    generateTailoredSuggestions,
    addTailoredSuggestion
  };
};
