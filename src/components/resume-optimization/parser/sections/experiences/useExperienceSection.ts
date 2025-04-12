
import { useState, useEffect } from 'react';
import { Experience } from '../types';

export const useExperienceSection = (
  initialExperiences: Experience[],
  onChange: (experiences: Experience[]) => void
) => {
  const [openExperiences, setOpenExperiences] = useState<string[]>([]);
  
  // Add IDs to experiences that don't have them and open first experience by default
  useEffect(() => {
    if (initialExperiences.some(exp => !exp.id)) {
      const updatedExperiences = initialExperiences.map(exp => 
        exp.id ? exp : { ...exp, id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      );
      onChange(updatedExperiences);
      
      // Open the first experience by default if none are open
      if (updatedExperiences.length > 0 && openExperiences.length === 0) {
        setOpenExperiences([updatedExperiences[0].id as string]);
      }
    } else if (initialExperiences.length > 0 && openExperiences.length === 0) {
      // Open the first experience by default if none are open
      setOpenExperiences([initialExperiences[0].id as string]);
    }
  }, [initialExperiences, openExperiences.length]);
  
  const toggleExperience = (id: string) => {
    setOpenExperiences(prev => 
      prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
    );
  };
  
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedExperiences = initialExperiences.map(exp => {
      if (exp.id === id) {
        // Handle special case for end_date and is_present checkbox
        if (field === 'is_present') {
          return { 
            ...exp, 
            is_present: value,
            end_date: value ? 'Present' : exp.end_date === 'Present' ? '' : exp.end_date
          };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });
    
    onChange(updatedExperiences);
  };
  
  const addExperience = () => {
    const newId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newExperience: Experience = {
      id: newId,
      company_name: '',
      state: '',
      country: '',
      start_date: '',
      end_date: '',
      job_title: '',
      responsibilities_text: '',
      skills_tools_used: '',
      is_present: false
    };
    
    onChange([...initialExperiences, newExperience]);
    setOpenExperiences(prev => [...prev, newId]);
  };
  
  const removeExperience = (id: string) => {
    onChange(initialExperiences.filter(exp => exp.id !== id));
    setOpenExperiences(prev => prev.filter(expId => expId !== id));
  };
  
  return {
    openExperiences,
    toggleExperience,
    updateExperience,
    addExperience,
    removeExperience
  };
};
