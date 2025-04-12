
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { WorkExperienceEntry as WorkExperienceEntryType } from '../types';
import { EntryHeader } from './EntryHeader';
import { CompanyFields } from './CompanyFields';
import { DateFields } from './DateFields';
import { JobDetailsFields } from './JobDetailsFields';
import { generateJobDescription } from '../utils/description-generator';

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
  const handleGenerateDescription = async () => {
    // Update the state first to show loading indicator
    onUpdate('description', 'Generating...');
    
    try {
      const description = await generateJobDescription(
        entry.title || '',
        entry.teamName,
        entry.teamSize,
        entry.projectName
      );
      
      onUpdate('description', description);
    } catch (error) {
      console.error("Error generating description:", error);
      onUpdate('description', "Error generating description. Please try again.");
    }
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
          
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <CompanyFields
                id={entry.id}
                company={entry.company || ''}
                title={entry.title || ''}
                companyLocation={entry.companyLocation || { country: '', city: '' }}
                onCompanyChange={(value) => onUpdate('company', value)}
                onTitleChange={(value) => onUpdate('title', value)}
                onLocationChange={(field, value) => 
                  onUpdate('companyLocation', { ...entry.companyLocation, [field]: value })
                }
              />
              
              <DateFields
                id={entry.id}
                startDate={entry.startDate || ''}
                endDate={entry.endDate || ''}
                onStartDateChange={(value) => onUpdate('startDate', value)}
                onEndDateChange={(value) => onUpdate('endDate', value)}
              />
              
              <JobDetailsFields
                id={entry.id}
                title={entry.title || ''}
                teamName={entry.teamName || ''}
                teamSize={entry.teamSize || 0}
                projectName={entry.projectName || ''}
                description={entry.description || ''}
                isGenerating={generatingId === entry.id}
                onTeamNameChange={(value) => onUpdate('teamName', value)}
                onTeamSizeChange={(value) => onUpdate('teamSize', value)}
                onProjectNameChange={(value) => onUpdate('projectName', value)}
                onDescriptionChange={(value) => onUpdate('description', value)}
                onGenerateDescription={handleGenerateDescription}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

