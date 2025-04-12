
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const ExperiencesHeader: React.FC = () => {
  return (
    <Alert variant="default" className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        List your work experiences in reverse chronological order (most recent first).
        Include specific achievements and skills used in each role.
      </AlertDescription>
    </Alert>
  );
};
