
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface SectionTabsProps {
  sections: ResumeSection[];
  currentSection: string | null;
  onSectionSelect: (sectionId: string) => void;
  onAddSection: () => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  sections,
  currentSection,
  onSectionSelect,
  onAddSection
}) => {
  return (
    <div className="flex items-center gap-2 pb-2 border-b">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddSection}
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add Section
      </Button>
      
      <div className="flex-1 overflow-x-auto">
        <Tabs 
          value={currentSection || ''} 
          onValueChange={onSectionSelect}
          className="w-full"
        >
          <TabsList className="inline-flex h-9 w-auto">
            {sections.map(section => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="h-8 px-3"
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
