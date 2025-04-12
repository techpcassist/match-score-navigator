
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Experience {
  id?: string;
  company_name: string;
  state: string;
  country: string;
  start_date: string;
  end_date: string;
  job_title: string;
  responsibilities_text: string;
  skills_tools_used: string;
  is_present?: boolean;
}

interface ExperiencesSectionProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ experiences = [], onChange }) => {
  const [openExperiences, setOpenExperiences] = React.useState<string[]>([]);
  
  // Add IDs to experiences that don't have them
  React.useEffect(() => {
    if (experiences.some(exp => !exp.id)) {
      const updatedExperiences = experiences.map(exp => 
        exp.id ? exp : { ...exp, id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      );
      onChange(updatedExperiences);
      
      // Open the first experience by default if none are open
      if (updatedExperiences.length > 0 && openExperiences.length === 0) {
        setOpenExperiences([updatedExperiences[0].id as string]);
      }
    } else if (experiences.length > 0 && openExperiences.length === 0) {
      // Open the first experience by default if none are open
      setOpenExperiences([experiences[0].id as string]);
    }
  }, [experiences]);
  
  const toggleExperience = (id: string) => {
    setOpenExperiences(prev => 
      prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
    );
  };
  
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedExperiences = experiences.map(exp => {
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
    
    onChange([...experiences, newExperience]);
    setOpenExperiences(prev => [...prev, newId]);
  };
  
  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
    setOpenExperiences(prev => prev.filter(expId => expId !== id));
  };
  
  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          List your work experiences in reverse chronological order (most recent first).
          Include specific achievements and skills used in each role.
        </AlertDescription>
      </Alert>
      
      {experiences.map((experience) => (
        <Collapsible 
          key={experience.id} 
          open={openExperiences.includes(experience.id || '')}
          onOpenChange={() => toggleExperience(experience.id || '')}
          className="border rounded-md"
        >
          <div className="flex items-center justify-between p-4 border-b bg-slate-50">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {openExperiences.includes(experience.id || '') ? (
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
                removeExperience(experience.id || '');
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <CollapsibleContent>
            <CardContent className="p-4 pt-6">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`company-${experience.id}`}>Company Name</Label>
                    <Input
                      id={`company-${experience.id}`}
                      value={experience.company_name || ''}
                      onChange={(e) => updateExperience(experience.id || '', 'company_name', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`title-${experience.id}`}>Job Title</Label>
                    <Input
                      id={`title-${experience.id}`}
                      value={experience.job_title || ''}
                      onChange={(e) => updateExperience(experience.id || '', 'job_title', e.target.value)}
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
                      onChange={(e) => updateExperience(experience.id || '', 'country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`state-${experience.id}`}>State/Region</Label>
                    <Input
                      id={`state-${experience.id}`}
                      value={experience.state || ''}
                      onChange={(e) => updateExperience(experience.id || '', 'state', e.target.value)}
                      placeholder="State or Region"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`start-date-${experience.id}`}>Start Date (MM/YYYY)</Label>
                    <Input
                      id={`start-date-${experience.id}`}
                      value={experience.start_date || ''}
                      onChange={(e) => updateExperience(experience.id || '', 'start_date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`end-date-${experience.id}`}>End Date (MM/YYYY)</Label>
                    <div className="flex flex-col space-y-2">
                      <Input
                        id={`end-date-${experience.id}`}
                        value={experience.is_present ? 'Present' : experience.end_date || ''}
                        onChange={(e) => updateExperience(experience.id || '', 'end_date', e.target.value)}
                        placeholder="MM/YYYY"
                        disabled={experience.is_present}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`current-job-${experience.id}`}
                          checked={experience.is_present || experience.end_date === 'Present'}
                          onCheckedChange={(checked) => 
                            updateExperience(experience.id || '', 'is_present', !!checked)
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
                
                <div>
                  <Label htmlFor={`responsibilities-${experience.id}`}>Responsibilities & Achievements</Label>
                  <Textarea
                    id={`responsibilities-${experience.id}`}
                    value={experience.responsibilities_text || ''}
                    onChange={(e) => updateExperience(experience.id || '', 'responsibilities_text', e.target.value)}
                    placeholder="Describe your role, responsibilities, and key achievements..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`skills-${experience.id}`}>Skills & Tools Used</Label>
                  <Textarea
                    id={`skills-${experience.id}`}
                    value={experience.skills_tools_used || ''}
                    onChange={(e) => updateExperience(experience.id || '', 'skills_tools_used', e.target.value)}
                    placeholder="List skills and tools you used in this role (comma separated)..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      <Button variant="outline" onClick={addExperience} className="flex items-center w-full justify-center">
        <Plus className="mr-2 h-4 w-4" />
        Add Work Experience
      </Button>
    </div>
  );
};

export default ExperiencesSection;
