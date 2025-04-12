import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface Education {
  id?: string;
  course_certification_name: string;
  institute_name: string;
  university_name: string | null;
  state: string;
  country: string;
  is_certification: boolean;
  certificate_authority?: string;
  certificate_number?: string;
  validity?: string;
  start_date?: string;
  end_date?: string;
}

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education = [], onChange }) => {
  const [openEducation, setOpenEducation] = React.useState<string[]>([]);
  const [otherState, setOtherState] = React.useState<{[key: string]: string}>({});
  
  // Add IDs to education entries that don't have them
  React.useEffect(() => {
    if (education.some(edu => !edu.id)) {
      const updatedEducation = education.map(edu => 
        edu.id ? edu : { ...edu, id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      );
      onChange(updatedEducation);
      
      // Open the first education entry by default if none are open
      if (updatedEducation.length > 0 && openEducation.length === 0) {
        setOpenEducation([updatedEducation[0].id as string]);
      }
    } else if (education.length > 0 && openEducation.length === 0) {
      // Open the first education entry by default if none are open
      setOpenEducation([education[0].id as string]);
    }
    
    // Initialize otherState for entries with non-Indian states
    const stateMap: {[key: string]: string} = {};
    education.forEach(edu => {
      if (edu.id && edu.state && !INDIAN_STATES.includes(edu.state)) {
        stateMap[edu.id] = edu.state;
      }
    });
    setOtherState(prev => ({...prev, ...stateMap}));
  }, [education]);
  
  const toggleEducation = (id: string) => {
    setOpenEducation(prev => 
      prev.includes(id) ? prev.filter(eduId => eduId !== id) : [...prev, id]
    );
  };
  
  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updatedEducation = education.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    
    onChange(updatedEducation);
  };
  
  const handleStateChange = (id: string, value: string) => {
    if (value === 'other') {
      // Keep the current other state value or initialize empty
      const currentOtherState = otherState[id] || '';
      setOtherState({...otherState, [id]: currentOtherState});
    } else {
      // Update the state in the education entry
      updateEducation(id, 'state', value);
    }
  };
  
  const handleOtherStateChange = (id: string, value: string) => {
    setOtherState({...otherState, [id]: value});
    updateEducation(id, 'state', value);
  };
  
  const addEducation = () => {
    const newId = `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEducation: Education = {
      id: newId,
      course_certification_name: '',
      institute_name: '',
      university_name: '',
      state: '',
      country: 'India', // Default to India
      is_certification: false,
      start_date: '',
      end_date: ''
    };
    
    onChange([...education, newEducation]);
    setOpenEducation(prev => [...prev, newId]);
  };
  
  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
    setOpenEducation(prev => prev.filter(eduId => eduId !== id));
    
    // Remove from otherState if present
    if (otherState[id]) {
      const newOtherState = {...otherState};
      delete newOtherState[id];
      setOtherState(newOtherState);
    }
  };
  
  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          List your educational qualifications and certifications. Include relevant details like
          institution names, degrees, and completion dates.
        </AlertDescription>
      </Alert>
      
      {education.map((edu) => (
        <Collapsible 
          key={edu.id} 
          open={openEducation.includes(edu.id || '')}
          onOpenChange={() => toggleEducation(edu.id || '')}
          className="border rounded-md"
        >
          <div className="flex items-center justify-between p-4 border-b bg-slate-50">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {openEducation.includes(edu.id || '') ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <span className="font-medium">
                {edu.is_certification ? 'Certification: ' : 'Degree: '}
                {edu.course_certification_name || 'New Entry'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeEducation(edu.id || '');
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <CollapsibleContent>
            <CardContent className="p-4 pt-6">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`certification-${edu.id}`}
                    checked={edu.is_certification}
                    onCheckedChange={(checked) => 
                      updateEducation(edu.id || '', 'is_certification', !!checked)
                    }
                  />
                  <label
                    htmlFor={`certification-${edu.id}`}
                    className="text-sm font-medium leading-none"
                  >
                    This is a certification (not a degree)
                  </label>
                </div>
                
                <div>
                  <Label htmlFor={`course-${edu.id}`}>
                    {edu.is_certification ? 'Certification Name' : 'Degree/Course Name'}
                  </Label>
                  <Input
                    id={`course-${edu.id}`}
                    value={edu.course_certification_name || ''}
                    onChange={(e) => updateEducation(edu.id || '', 'course_certification_name', e.target.value)}
                    placeholder={edu.is_certification ? "e.g. AWS Certified Solutions Architect" : "e.g. Bachelor of Technology"}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`institute-${edu.id}`}>
                    {edu.is_certification ? 'Certifying Institution' : 'College/Institute Name'}
                  </Label>
                  <Input
                    id={`institute-${edu.id}`}
                    value={edu.institute_name || ''}
                    onChange={(e) => updateEducation(edu.id || '', 'institute_name', e.target.value)}
                    placeholder={edu.is_certification ? "e.g. Amazon Web Services" : "e.g. IIT Delhi"}
                  />
                </div>
                
                {!edu.is_certification && (
                  <div>
                    <Label htmlFor={`university-${edu.id}`}>University Name (if different from Institute)</Label>
                    <Input
                      id={`university-${edu.id}`}
                      value={edu.university_name || ''}
                      onChange={(e) => updateEducation(edu.id || '', 'university_name', e.target.value)}
                      placeholder="e.g. Delhi University"
                    />
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`country-${edu.id}`}>Country</Label>
                    <Input
                      id={`country-${edu.id}`}
                      value={edu.country || ''}
                      onChange={(e) => updateEducation(edu.id || '', 'country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`state-${edu.id}`}>State/Region</Label>
                    <div className="space-y-2">
                      <Select 
                        value={INDIAN_STATES.includes(edu.state || '') ? edu.state : 'other'}
                        onValueChange={(value) => handleStateChange(edu.id || '', value)}
                      >
                        <SelectTrigger id={`state-${edu.id}`}>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {(!INDIAN_STATES.includes(edu.state || '') || 
                         (otherState[edu.id || ''] && !INDIAN_STATES.includes(otherState[edu.id || '']))) && (
                        <Input
                          placeholder="Enter state/region"
                          value={otherState[edu.id || ''] || ''}
                          onChange={(e) => handleOtherStateChange(edu.id || '', e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`start-date-${edu.id}`}>Start Date (MM/YYYY)</Label>
                    <Input
                      id={`start-date-${edu.id}`}
                      value={edu.start_date || ''}
                      onChange={(e) => updateEducation(edu.id || '', 'start_date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`end-date-${edu.id}`}>End Date (MM/YYYY)</Label>
                    <Input
                      id={`end-date-${edu.id}`}
                      value={edu.end_date || ''}
                      onChange={(e) => updateEducation(edu.id || '', 'end_date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
                
                {edu.is_certification && (
                  <>
                    <div>
                      <Label htmlFor={`authority-${edu.id}`}>Certificate Authority</Label>
                      <Input
                        id={`authority-${edu.id}`}
                        value={edu.certificate_authority || ''}
                        onChange={(e) => updateEducation(edu.id || '', 'certificate_authority', e.target.value)}
                        placeholder="e.g. AWS, Microsoft, Cisco"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`number-${edu.id}`}>Certificate Number/ID</Label>
                        <Input
                          id={`number-${edu.id}`}
                          value={edu.certificate_number || ''}
                          onChange={(e) => updateEducation(edu.id || '', 'certificate_number', e.target.value)}
                          placeholder="Certificate ID or Number"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`validity-${edu.id}`}>Validity/Expiry Date</Label>
                        <Input
                          id={`validity-${edu.id}`}
                          value={edu.validity || ''}
                          onChange={(e) => updateEducation(edu.id || '', 'validity', e.target.value)}
                          placeholder="MM/YYYY or Never Expires"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      <Button variant="outline" onClick={addEducation} className="flex items-center w-full justify-center">
        <Plus className="mr-2 h-4 w-4" />
        Add {education.some(edu => edu.is_certification) && education.some(edu => !edu.is_certification) 
          ? 'Education/Certification' 
          : education.some(edu => edu.is_certification) 
          ? 'Certification' 
          : 'Education'}
      </Button>
    </div>
  );
};

export default EducationSection;
