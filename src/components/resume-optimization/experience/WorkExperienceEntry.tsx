
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { WorkExperienceEntry as WorkExperienceEntryType } from '../types';
import { EntryHeader } from './EntryHeader';
import { EntryContent } from './components/EntryContent';
import { useDescriptionGeneration } from './hooks/useDescriptionGeneration';

interface WorkExperienceEntryProps {
  entry: WorkExperienceEntryType;
  isOpen: boolean;
  generatingId: string | null;
  onToggle: () => void;
  onUpdate: (field: keyof WorkExperienceEntryType, value: any) => void;
  onRemove: () => void;
}

export const WorkExperienceEntryComponent: React.FC<WorkExperienceEntryProps> = ({
  entry,
  isOpen,
  generatingId,
  onToggle,
  onUpdate,
  onRemove
}) => {
  const { generateDescription } = useDescriptionGeneration();

  const handleGenerateDescription = async () => {
    // Update the state first to show loading indicator
    onUpdate('description', 'Generating...');
    
    const description = await generateDescription(
      entry.title || '',
      entry.teamName,
      entry.teamSize,
      entry.projectName
    );
    
    onUpdate('description', description);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <EntryHeader 
            isOpen={isOpen} 
            company={entry.company || ''} 
            title={entry.title || ''} 
            onRemove={onRemove} 
          />
          
          <EntryContent 
            entry={entry}
            generatingId={generatingId}
            onUpdate={onUpdate}
            onGenerateDescription={handleGenerateDescription}
          />
        </Collapsible>
      </CardContent>
    </Card>
  );
};
