
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SummarySectionProps {
  summary: string;
  onChange: (summary: string) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary, onChange }) => {
  const [characterCount, setCharacterCount] = useState(0);
  
  useEffect(() => {
    setCharacterCount(summary?.length || 0);
  }, [summary]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCharacterCount(e.target.value.length);
  };
  
  // Calculate character count color
  const getCountColor = () => {
    if (characterCount > 1000) return "text-red-500";
    if (characterCount > 750) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Alert variant="default" className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              A good summary provides a concise overview of your professional background, key skills,
              and career highlights. It appears at the top of your resume and makes a strong first impression.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="summary">Professional Summary</Label>
              <span className={`text-xs ${getCountColor()}`}>
                {characterCount} / 800 characters recommended
              </span>
            </div>
            <Textarea
              id="summary"
              placeholder="Provide a concise overview of your professional background, key skills, and career highlights..."
              value={summary || ''}
              onChange={handleChange}
              className="min-h-[200px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
