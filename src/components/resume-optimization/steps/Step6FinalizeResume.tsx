
import React, { useRef } from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ResumeEditor } from '../ResumeEditor';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';

interface Step6FinalizeResumeProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export const Step6FinalizeResume: React.FC<Step6FinalizeResumeProps> = ({ 
  initialContent, 
  onChange 
}) => {
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSavePDF = () => {
    if (!resumeContentRef.current) {
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Create a clone of the content to style for PDF
    const element = resumeContentRef.current.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    container.appendChild(element);
    
    // Add proper styling for PDF
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '20px';
    container.style.width = '8.5in';
    container.style.minHeight = '11in';
    container.style.color = '#000';
    container.style.backgroundColor = '#fff';
    
    // Format text
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.margin = '6px 0';
      p.style.lineHeight = '1.5';
    });

    // Configure PDF options
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'optimized-resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and download PDF
    html2pdf().from(container).set(opt).save()
      .then(() => {
        toast({
          title: "Success",
          description: "Your resume has been saved as a PDF file.",
        });
      })
      .catch(error => {
        console.error("PDF generation error:", error);
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 6: Finalize Resume</CardTitle>
        <CardDescription>
          Review and edit your optimized resume before finalizing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button 
            onClick={handleSavePDF} 
            className="gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
        </div>
        <div ref={resumeContentRef}>
          <ResumeEditor 
            initialContent={initialContent}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </div>
  );
};
