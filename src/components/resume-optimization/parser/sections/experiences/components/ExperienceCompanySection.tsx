
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Experience } from '../types';

interface ExperienceCompanySectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

export const ExperienceCompanySection: React.FC<ExperienceCompanySectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`company-${experience.id}`}>Company Name</Label>
          <Input
            id={`company-${experience.id}`}
            value={experience.company_name || ''}
            onChange={(e) => onUpdate('company_name', e.target.value)}
            placeholder="Company Name"
          />
        </div>
        
        <div>
          <Label htmlFor={`title-${experience.id}`}>Job Title</Label>
          <Input
            id={`title-${experience.id}`}
            value={experience.job_title || ''}
            onChange={(e) => onUpdate('job_title', e.target.value)}
            placeholder="Job Title"
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`country-${experience.id}`}>Country</Label>
          <Input
            id={`country-${experience.id}`}
            value={experience.country || ''}
            onChange={(e) => onUpdate('country', e.target.value)}
            placeholder="Country"
          />
        </div>
        
        <div>
          <Label htmlFor={`state-${experience.id}`}>State/Region</Label>
          <Input
            id={`state-${experience.id}`}
            value={experience.state || ''}
            onChange={(e) => onUpdate('state', e.target.value)}
            placeholder="State or Region"
          />
        </div>
      </div>
    </>
  );
};
