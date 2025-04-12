
import React from 'react';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { WorkExperienceEntry } from '../../types';
import { CompanyFields } from '../CompanyFields';
import { DateFields } from '../DateFields';
import { JobDetailsFields } from '../JobDetailsFields';

interface EntryContentProps {
  entry: WorkExperienceEntry;
  generatingId: string | null;
  onUpdate: (field: keyof WorkExperienceEntry, value: any) => void;
  onGenerateDescription: () => void;
}

export const EntryContent: React.FC<EntryContentProps> = ({
  entry,
  generatingId,
  onUpdate,
  onGenerateDescription
}) => {
  return (
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
          onGenerateDescription={onGenerateDescription}
        />
      </div>
    </CollapsibleContent>
  );
};
