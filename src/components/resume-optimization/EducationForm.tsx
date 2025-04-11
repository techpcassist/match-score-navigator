
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Education } from './types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for universities by country and state
// In a real application, this would come from an API or database
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'China', 'Japan'];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'New York', 'Texas', 'Washington'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Alberta', 'British Columbia', 'Ontario', 'Quebec'],
  'Australia': ['New South Wales', 'Queensland', 'Victoria', 'Western Australia'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh'],
  'Germany': ['Bavaria', 'Berlin', 'Hesse', 'Saxony'],
  'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Normandy', 'Brittany'],
  'China': ['Beijing', 'Shanghai', 'Guangdong', 'Sichuan'],
  'Japan': ['Tokyo', 'Osaka', 'Hokkaido', 'Kyoto']
};

const UNIVERSITIES_BY_STATE: Record<string, string[]> = {
  'California': ['Stanford University', 'University of California, Berkeley', 'California Institute of Technology', 'University of California, Los Angeles'],
  'New York': ['Columbia University', 'Cornell University', 'New York University', 'Syracuse University'],
  'Texas': ['University of Texas at Austin', 'Texas A&M University', 'Rice University', 'University of Houston'],
  'Massachusetts': ['Harvard University', 'Massachusetts Institute of Technology', 'Boston University', 'Northeastern University'],
  'England': ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'University College London'],
  'Ontario': ['University of Toronto', 'University of Waterloo', 'McMaster University', 'York University'],
  'Maharashtra': ['University of Mumbai', 'Indian Institute of Technology Bombay', 'Pune University', 'SNDT Women\'s University'],
  'Karnataka': ['Indian Institute of Science', 'National Institute of Technology Karnataka', 'Manipal Academy of Higher Education', 'Bangalore University'],
  // More states and universities would be added in a real implementation
};

interface EducationFormProps {
  entries: Education[];
  onChange: (entries: Education[]) => void;
}

export const EducationForm = ({ entries, onChange }: EducationFormProps) => {
  const [openEntries, setOpenEntries] = useState<string[]>([
    // Open the first entry by default
    entries.length > 0 ? entries[0].id : ''
  ]);
  
  const toggleEntry = (id: string) => {
    setOpenEntries(prev => {
      if (prev.includes(id)) {
        return prev.filter(entryId => entryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const updateEntry = (id: string, field: keyof Education, value: string | boolean) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        
        // Reset state and university if country changes
        if (field === 'country') {
          updatedEntry.state = '';
          updatedEntry.university = '';
        }
        
        // Reset university if state changes
        if (field === 'state') {
          updatedEntry.university = '';
        }
        
        return updatedEntry;
      }
      return entry;
    });
    
    onChange(updatedEntries);
  };
  
  const addNewEntry = () => {
    const newEntry: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      fieldOfStudy: '',
      university: '',
      country: '',
      state: '',
      startDate: '',
      endDate: '',
      customUniversity: false
    };
    
    const updatedEntries = [...entries, newEntry];
    onChange(updatedEntries);
    
    // Open the new entry
    setOpenEntries(prev => [...prev, newEntry.id]);
  };
  
  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    onChange(updatedEntries);
    
    // Remove from open entries
    setOpenEntries(prev => prev.filter(entryId => entryId !== id));
  };
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No education entries detected in your resume.</p>
        <Button onClick={addNewEntry}>Add Education</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        Complete the details for each education entry.
      </p>
      
      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry.id}>
            <CardContent className="p-4">
              <Collapsible 
                open={openEntries.includes(entry.id)} 
                onOpenChange={() => toggleEntry(entry.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="p-2 h-auto">
                        {openEntries.includes(entry.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <span className="font-medium">
                      {entry.degree || 'Degree'} - {entry.university || 'University'}
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CollapsibleContent className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${entry.id}-degree`}>Degree</Label>
                        <Input
                          id={`${entry.id}-degree`}
                          value={entry.degree || ''}
                          onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)}
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-field`}>Field of Study</Label>
                        <Input
                          id={`${entry.id}-field`}
                          value={entry.fieldOfStudy || ''}
                          onChange={(e) => updateEntry(entry.id, 'fieldOfStudy', e.target.value)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${entry.id}-country`}>Country</Label>
                      <Select
                        value={entry.country || ''}
                        onValueChange={(value) => updateEntry(entry.id, 'country', value)}
                      >
                        <SelectTrigger id={`${entry.id}-country`}>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {entry.country && (
                      <div>
                        <Label htmlFor={`${entry.id}-state`}>State/Province</Label>
                        <Select
                          value={entry.state || ''}
                          onValueChange={(value) => updateEntry(entry.id, 'state', value)}
                        >
                          <SelectTrigger id={`${entry.id}-state`}>
                            <SelectValue placeholder="Select a state or province" />
                          </SelectTrigger>
                          <SelectContent>
                            {(STATES_BY_COUNTRY[entry.country] || []).map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {entry.state && !entry.customUniversity && (
                      <div>
                        <Label htmlFor={`${entry.id}-university`}>University</Label>
                        <Select
                          value={entry.university || ''}
                          onValueChange={(value) => updateEntry(entry.id, 'university', value)}
                        >
                          <SelectTrigger id={`${entry.id}-university`}>
                            <SelectValue placeholder="Select a university" />
                          </SelectTrigger>
                          <SelectContent>
                            {(UNIVERSITIES_BY_STATE[entry.state] || []).map(uni => (
                              <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                            ))}
                            <SelectItem value="other">Other (not listed)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {(entry.university === 'other' || entry.customUniversity) && (
                      <div>
                        <Label htmlFor={`${entry.id}-custom-university`}>Custom University Name</Label>
                        <Input
                          id={`${entry.id}-custom-university`}
                          value={entry.customUniversity ? (entry.university || '') : ''}
                          onChange={(e) => {
                            updateEntry(entry.id, 'customUniversity', true);
                            updateEntry(entry.id, 'university', e.target.value);
                          }}
                          placeholder="Enter university name"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${entry.id}-start-date`}>Start Date (MM/YYYY)</Label>
                        <Input
                          id={`${entry.id}-start-date`}
                          value={entry.startDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-end-date`}>End Date (MM/YYYY or "Present")</Label>
                        <Input
                          id={`${entry.id}-end-date`}
                          value={entry.endDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          placeholder="MM/YYYY or Present"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={addNewEntry}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>
      </div>
    </div>
  );
};
