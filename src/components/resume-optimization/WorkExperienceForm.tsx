
import React from 'react';
import { WorkExperienceEntry } from './types';
import { WorkExperienceEntryComponent } from './experience/WorkExperienceEntry';
import { useWorkExperienceForm } from './experience/hooks/useWorkExperienceForm';
import { EmptyExperienceState } from './experience/EmptyExperienceState';
import { ExperienceFormInstructions } from './experience/ExperienceFormInstructions';
import { AddExperienceButton } from './experience/AddExperienceButton';

interface WorkExperienceFormProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export const WorkExperienceForm = ({ entries = [], onChange }: WorkExperienceFormProps) => {
  const {
    openEntries,
    generatingId,
    toggleEntry,
    updateEntry,
    addNewEntry,
    removeEntry
  } = useWorkExperienceForm(entries, onChange);
  
  if (!entries || entries.length === 0) {
    return <EmptyExperienceState onAddExperience={addNewEntry} />;
  }

  return (
    <div className="space-y-6">
      <ExperienceFormInstructions />
      
      <div className="space-y-4">
        {entries.map(entry => (
          <WorkExperienceEntryComponent
            key={entry.id}
            entry={entry}
            isOpen={openEntries.includes(entry.id)}
            generatingId={generatingId}
            onToggle={() => toggleEntry(entry.id)}
            onUpdate={(field, value) => updateEntry(entry.id, field, value)}
            onRemove={() => removeEntry(entry.id)}
          />
        ))}
      </div>
      
      <AddExperienceButton onClick={addNewEntry} />
    </div>
  );
};
