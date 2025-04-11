
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MissingSection } from './types';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionCheckListProps {
  missingSections: MissingSection[];
  onSelectionChange: (selectedSections: string[]) => void;
}

export const SectionCheckList = ({ missingSections, onSelectionChange }: SectionCheckListProps) => {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    missingSections.map(section => section.id)
  );
  const [openExamples, setOpenExamples] = useState<string[]>([]);
  
  const toggleSection = (id: string) => {
    setSelectedSections(prev => {
      if (prev.includes(id)) {
        return prev.filter(sectionId => sectionId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleExample = (id: string) => {
    setOpenExamples(prev => {
      if (prev.includes(id)) {
        return prev.filter(exampleId => exampleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Update parent component when selections change
  const handleSelectionConfirm = () => {
    onSelectionChange(selectedSections);
  };
  
  if (missingSections.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No missing sections detected in your resume.</p>
        <Button onClick={handleSelectionConfirm} className="mt-4">Continue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-4">
        The following sections could improve your resume based on the job description.
        Select the sections you want to add:
      </p>
      
      <div className="space-y-3">
        {missingSections.map(section => (
          <Card key={section.id} className={selectedSections.includes(section.id) ? "border-blue-300" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id={section.id} 
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor={section.id} className="text-sm font-medium cursor-pointer">
                    {section.name}
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">{section.recommendation}</p>
                  
                  {section.example && (
                    <Collapsible 
                      open={openExamples.includes(section.id)} 
                      onOpenChange={() => toggleExample(section.id)}
                      className="mt-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <span className="text-xs text-blue-600 flex items-center">
                            {openExamples.includes(section.id) ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Hide Example
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                View Example
                              </>
                            )}
                          </span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="bg-muted p-3 rounded-md mt-2 text-sm whitespace-pre-wrap">
                          {section.example}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSelectionConfirm}>
          Confirm Selections
        </Button>
      </div>
    </div>
  );
};
