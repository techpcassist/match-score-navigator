
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SectionTabs } from './SectionTabs';
import { SectionControls } from './SectionControls';
import { SectionEditor } from '@/components/resume-dashboard/SectionEditor';
import { AIAssistant } from '@/components/resume-dashboard/AIAssistant';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface EditorMainContentProps {
  sections: ResumeSection[];
  currentSection: string | null;
  setCurrentSection: (sectionId: string) => void;
  onAddSection: () => void;
  handleSectionUpdate: (section: ResumeSection) => void;
  handleMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  handleDeleteSection: (sectionId: string) => void;
  handleAISuggestion: (sectionId: string, suggestion: string) => void;
  sectionTypes: string[];
}

export const EditorMainContent: React.FC<EditorMainContentProps> = ({
  sections,
  currentSection,
  setCurrentSection,
  onAddSection,
  handleSectionUpdate,
  handleMoveSection,
  handleDeleteSection,
  handleAISuggestion,
  sectionTypes
}) => {
  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border h-[calc(100vh-180px)] overflow-hidden">
      <SectionTabs
        sections={sections}
        currentSection={currentSection}
        onSectionSelect={setCurrentSection}
        onAddSection={onAddSection}
      />
      
      <div className="flex-1 overflow-y-auto">
        <Tabs value={currentSection || ''}>
          {sections.map((section, index) => (
            <TabsContent 
              key={section.id} 
              value={section.id}
              className="h-full m-0"
            >
              <SectionControls
                section={section}
                onUpdate={handleSectionUpdate}
                onMove={handleMoveSection}
                onDelete={handleDeleteSection}
                isFirstSection={index === 0}
                isLastSection={index === sections.length - 1}
                canDelete={sections.length > 1}
                sectionTypes={sectionTypes}
              />
              
              <SectionEditor
                section={section}
                onUpdate={handleSectionUpdate}
              />
              
              <AIAssistant
                sectionType={section.type}
                sectionId={section.id}
                existingContent={section.content}
                onSuggestionApply={handleAISuggestion}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
