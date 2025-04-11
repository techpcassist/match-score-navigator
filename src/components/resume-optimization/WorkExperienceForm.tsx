
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WorkExperienceEntry } from './types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

interface WorkExperienceFormProps {
  entries: WorkExperienceEntry[];
  onChange: (entries: WorkExperienceEntry[]) => void;
}

export const WorkExperienceForm = ({ entries, onChange }: WorkExperienceFormProps) => {
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
  
  const updateEntry = (id: string, field: keyof WorkExperienceEntry, value: string) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    
    onChange(updatedEntries);
  };
  
  const addNewEntry = () => {
    const newEntry: WorkExperienceEntry = {
      id: `job-${Date.now()}`,
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: ''
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
                      {entry.company || 'Company'} - {entry.title || 'Position'}
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
                        <Label htmlFor={`${entry.id}-company`}>Company</Label>
                        <Input
                          id={`${entry.id}-company`}
                          value={entry.company || ''}
                          onChange={(e) => updateEntry(entry.id, 'company', e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-title`}>Job Title</Label>
                        <Input
                          id={`${entry.id}-title`}
                          value={entry.title || ''}
                          onChange={(e) => updateEntry(entry.id, 'title', e.target.value)}
                          placeholder="Your position"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${entry.id}-start-date`}>Start Date (MM/YYYY)</Label>
                        <Input
                          id={`${entry.id}-start-date`}
                          value={entry.startDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)}
                          placeholder="MM/YYYY"
                          className={!entry.startDate ? "border-red-300" : ""}
                        />
                        {!entry.startDate && (
                          <p className="text-xs text-red-500 mt-1">Start date is required</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`${entry.id}-end-date`}>End Date (MM/YYYY or "Present")</Label>
                        <Input
                          id={`${entry.id}-end-date`}
                          value={entry.endDate || ''}
                          onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)}
                          placeholder="MM/YYYY or Present"
                          className={!entry.endDate ? "border-red-300" : ""}
                        />
                        {!entry.endDate && (
                          <p className="text-xs text-red-500 mt-1">End date is required</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`${entry.id}-description`}>Description & Achievements</Label>
                      <Textarea
                        id={`${entry.id}-description`}
                        value={entry.description || ''}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        placeholder="Include your responsibilities and quantifiable achievements"
                        rows={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Pro tip: Include metrics and numbers (e.g., "Increased sales by 20%") to make your achievements more impactful.
                      </p>
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
          Add Another Position
        </Button>
      </div>
    </div>
  );
};
