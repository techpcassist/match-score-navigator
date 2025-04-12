
import { useState } from 'react';
import { generateJobDescription } from '../../utils/description-generator';
import { useToast } from '@/hooks/use-toast';

export const useDescriptionGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDescription = async (
    title: string,
    teamName?: string,
    teamSize?: number,
    projectName?: string
  ): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const description = await generateJobDescription(
        title,
        teamName,
        teamSize,
        projectName
      );
      
      return description;
    } catch (error) {
      console.error("Error generating description:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate job description. Please try again.",
        variant: "destructive",
      });
      
      return "Error generating description. Please try again.";
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateDescription
  };
};
