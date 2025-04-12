
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export const ResumeEditor = ({ initialContent, onChange }: ResumeEditorProps) => {
  const [content, setContent] = useState(initialContent);
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };
  
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-muted-foreground mb-2">
          Edit your optimized resume below. All accepted suggestions have been applied.
        </p>
        <Textarea
          value={content}
          onChange={handleChange}
          rows={20}
          className="font-mono resize-none"
        />
      </CardContent>
    </Card>
  );
};
