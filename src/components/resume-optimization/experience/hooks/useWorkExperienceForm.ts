
import { useState } from 'react';
import { WorkExperienceEntry } from '../../types';

export const useWorkExperienceForm = (
  entries: WorkExperienceEntry[],
  onChange: (entries: WorkExperienceEntry[]) => void
) => {
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
    if (field === 'description' && typeof value === 'string' && 
        !value.startsWith('Led') && !value.startsWith('Designed') && 
        !value.startsWith('Developed') && !value.startsWith('Built') && 
        !value.startsWith('Managed') && !value.startsWith('Conducted') && 
        !value.startsWith('Directed') && !value.startsWith('Spearheaded') && 
        !value.startsWith('Oversaw')) {
      
      const updatedEntries = entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, [field]: value };
        }
        return entry;
      });
      
      onChange(updatedEntries);
      return;
    }
    
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
    
    const updatedEntries = [...(entries || []), newEntry];
    onChange(updatedEntries);
    
    setOpenEntries(prev => [...prev, newEntry.id]);
  };
  
  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange(updatedEntries);
    
    setOpenEntries(prev => prev.filter(entryId => entryId !== id));
  };

  return {
    openEntries,
    generatingId,
    toggleEntry,
    updateEntry,
    addNewEntry,
    removeEntry
  };
};
