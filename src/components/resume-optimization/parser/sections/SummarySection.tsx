
import React from 'react';
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
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              placeholder="Provide a concise overview of your professional background, key skills, and career highlights..."
              value={summary || ''}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
