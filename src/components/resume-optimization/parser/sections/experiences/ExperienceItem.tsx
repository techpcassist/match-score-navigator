
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Experience } from '../types';

interface ExperienceItemProps {
  experience: Experience;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (field: keyof Experience, value: any) => void;
  onRemove: () => void;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experience,
  isOpen,
  onToggle,
  onUpdate,
  onRemove
}) => {
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={onToggle}
      className="border rounded-md"
    >
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <span className="font-medium">
            {experience.company_name || 'New Experience'} - {experience.job_title || 'Position'}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 pt-6">
          <div className="grid gap-4">
            <ExperienceCompanySection 
              experience={experience} 
              onUpdate={onUpdate}
            />
            
            <ExperienceDateSection 
              experience={experience} 
              onUpdate={onUpdate}
            />
            
            <ExperienceDetailsSection 
              experience={experience} 
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ExperienceSectionProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: any) => void;
}

const ExperienceCompanySection: React.FC<ExperienceSectionProps> = ({ experience, onUpdate }) => {
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

const ExperienceDateSection: React.FC<ExperienceSectionProps> = ({ experience, onUpdate }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`start-date-${experience.id}`}>Start Date (MM/YYYY)</Label>
        <Input
          id={`start-date-${experience.id}`}
          value={experience.start_date || ''}
          onChange={(e) => onUpdate('start_date', e.target.value)}
          placeholder="MM/YYYY"
        />
      </div>
      
      <div>
        <Label htmlFor={`end-date-${experience.id}`}>End Date (MM/YYYY)</Label>
        <div className="flex flex-col space-y-2">
          <Input
            id={`end-date-${experience.id}`}
            value={experience.is_present ? 'Present' : experience.end_date || ''}
            onChange={(e) => onUpdate('end_date', e.target.value)}
            placeholder="MM/YYYY"
            disabled={experience.is_present}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-job-${experience.id}`}
              checked={experience.is_present || experience.end_date === 'Present'}
              onCheckedChange={(checked) => 
                onUpdate('is_present', !!checked)
              }
            />
            <label
              htmlFor={`current-job-${experience.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I currently work here
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperienceDetailsSection: React.FC<ExperienceSectionProps> = ({ experience, onUpdate }) => {
  return (
    <>
      <div>
        <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
        <Textarea
          id={`responsibilities-${experience.id}`}
          value={experience.responsibilities_text || ''}
          onChange={(e) => onUpdate('responsibilities_text', e.target.value)}
          placeholder="Describe your role, responsibilities, and key achievements..."
          className="min-h-[150px]"
        />
      </div>
      
      <div>
        <Label htmlFor={`skills-${experience.id}`}>Skills & Tools Used</Label>
        <Textarea
          id={`skills-${experience.id}`}
          value={experience.skills_tools_used || ''}
          onChange={(e) => onUpdate('skills_tools_used', e.target.value)}
          placeholder="List skills and tools you used in this role (comma separated)..."
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};
