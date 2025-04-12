
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { WorkExperienceEntry } from './types';
import { WorkExperienceEntryComponent } from './experience/WorkExperienceEntry';

interface WorkExperienceFormProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export const WorkExperienceForm = ({ entries, onChange }: WorkExperienceFormProps) => {
  const [openEntries, setOpenEntries] = useState<string[]>([
    entries.length > 0 ? entries[0].id : ''
  ]);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const toggleEntry = (id: string) => {
    setOpenEntries(prev => {
      if (prev.includes(id)) {
        return prev.filter(entryId => entryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const updateEntry = (id: string, field: keyof WorkExperienceEntry, value: any) => {
    if (field === 'description' && !value.startsWith('Led') && !value.startsWith('Designed') && !value.startsWith('Developed') && !value.startsWith('Built') && !value.startsWith('Managed') && !value.startsWith('Conducted') && !value.startsWith('Directed') && !value.startsWith('Spearheaded') && !value.startsWith('Oversaw')) {
      // This is a direct update, not generated
      const updatedEntries = entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, [field]: value };
        }
        return entry;
      });
      
      onChange(updatedEntries);
      return;
    }
    
    // For generating a description or updating other fields
    if (field === 'description') {
      setGeneratingId(id);
      setTimeout(() => {
        const updatedEntries = entries.map(entry => {
          if (entry.id === id) {
            return { ...entry, [field]: value };
          }
          return entry;
        });
        
        onChange(updatedEntries);
        setGeneratingId(null);
      }, 1000);
    } else {
      const updatedEntries = entries.map(entry => {
        if (entry.id === id) {
          if (field === 'companyLocation') {
            return { ...entry, companyLocation: { ...entry.companyLocation, ...value } };
          }
          return { ...entry, [field]: value };
        }
        return entry;
      });
      
      onChange(updatedEntries);
    }
  };
  
  const addNewEntry = () => {
    const newEntry: WorkExperienceEntry = {
      id: `job-${Date.now()}`,
      company: '',
      companyLocation: { country: '', state: '', city: '' },
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      teamName: '',
      teamSize: 0,
      projectName: ''
    };
    
    const updatedEntries = [...entries, newEntry];
    onChange(updatedEntries);
    
    setOpenEntries(prev => [...prev, newEntry.id]);
  };
  
  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange(updatedEntries);
    
    setOpenEntries(prev => prev.filter(entryId => entryId !== id));
  };
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No work experience entries detected in your resume.</p>
        <Button onClick={addNewEntry}>Add Work Experience</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        Complete the details for each work experience entry. Dates and specific achievements with metrics are particularly important for ATS systems.
      </p>
      
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
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={addNewEntry}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Position
        </Button>
      </div>
    </div>
  );
};
