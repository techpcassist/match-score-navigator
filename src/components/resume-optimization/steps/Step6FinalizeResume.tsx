
import React from 'react';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ResumeEditor } from '../ResumeEditor';

interface Step6FinalizeResumeProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export const Step6FinalizeResume: React.FC<Step6FinalizeResumeProps> = ({ 
  initialContent, 
  onChange 
}) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Step 6: Finalize Resume</CardTitle>
        <CardDescription>
          Review and edit your optimized resume before finalizing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResumeEditor 
          initialContent={initialContent}
          onChange={onChange}
        />
      </CardContent>
    </div>
  );
};
