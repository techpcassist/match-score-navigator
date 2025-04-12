
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResumeParsingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  onParseComplete: (parsedData: any) => void;
}

const ResumeParsingModal: React.FC<ResumeParsingModalProps> = ({
  isOpen,
  onClose,
  resumeText,
  onParseComplete
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  // Debug log when component mounts or resumeText changes
  useEffect(() => {
    console.log("ResumeParsingModal received resumeText:", 
      resumeText ? `Present (length: ${resumeText.length})` : "Not present");
  }, [resumeText]);

  // Simulated progress for better UX
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isParsing && progress < 90) {
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down progress as we approach 90%
          const increment = prev < 30 ? 10 : prev < 60 ? 5 : 2;
          return Math.min(prev + increment, 90);
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isParsing, progress]);

  // Auto-start parsing when modal opens
  useEffect(() => {
    if (isOpen && resumeText && !isParsing && progress === 0) {
      handleParseResume();
    }
  }, [isOpen, resumeText]);

  const handleParseResume = async () => {
    console.log("Starting resume parsing with text:", resumeText ? `Present (length: ${resumeText.length})` : "Not present");
    
    if (!resumeText || resumeText.trim() === '') {
      toast({
        title: "No resume content",
        description: "Please provide resume text to parse.",
        variant: "destructive"
      });
      onClose();
      return;
    }
    
    setIsParsing(true);
    setProgress(5);
    
    try {
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { resume_text: resumeText }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to parse resume');
      }
      
      // Set progress to 100% to indicate completion
      setProgress(100);
      
      // Notify the parent component with the parsed data
      onParseComplete(data.data);
      
      toast({
        title: "Resume parsed successfully",
        description: "Your resume has been analyzed and structured for optimization.",
      });
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Parsing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      onClose();
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Parsing Your Resume</DialogTitle>
          <DialogDescription>
            Our AI is analyzing your resume to extract key information for optimization.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2">
            {progress < 100 
              ? `Parsing your resume... ${progress}%` 
              : "Parsing complete!"}
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isParsing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleParseResume}
            disabled={isParsing}
          >
            {isParsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Parse Resume'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeParsingModal;
