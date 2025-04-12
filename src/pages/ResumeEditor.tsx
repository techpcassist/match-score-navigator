
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, PlusCircle } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { useResumeEditor } from '@/hooks/use-resume-editor';
import { SectionTabs } from '@/components/resume-editor/SectionTabs';
import { EditorHeader } from '@/components/resume-editor/EditorHeader';
import { SectionControls } from '@/components/resume-editor/SectionControls';
import { SectionEditor } from '@/components/resume-dashboard/SectionEditor';
import { ResumePreview } from '@/components/resume-dashboard/ResumePreview';
import { AddSectionDialog } from '@/components/resume-dashboard/AddSectionDialog';
import { AIAssistant } from '@/components/resume-dashboard/AIAssistant';
import { EditorEmptyState } from '@/components/resume-editor/EditorEmptyState';
import { EditorLoading } from '@/components/resume-editor/EditorLoading';
import { EditorMainContent } from '@/components/resume-editor/EditorMainContent';
import { EditorPreviewToggle } from '@/components/resume-editor/EditorPreviewToggle';

// Define standard section types
const sectionTypes = [
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
  "languages",
  "interests",
  "references",
  "custom"
];

const ResumeEditor = () => {
  const {
    resumeTitle,
    setResumeTitle,
    sections,
    currentSection,
    setCurrentSection,
    loading,
    showAddSectionDialog,
    setShowAddSectionDialog,
    showPreview,
    setShowPreview,
    setIsEditing,
    saveResume,
    handleExport,
    handleSectionUpdate,
    handleAddSection,
    handleDeleteSection,
    handleMoveSection,
    handleAISuggestion
  } = useResumeEditor();

  // If we're loading, show a loading state
  if (loading) {
    return <EditorLoading />;
  }

  return (
    <div className="container mx-auto py-4">
      <EditorHeader
        resumeTitle={resumeTitle}
        onTitleChange={(title) => {
          setResumeTitle(title);
          setIsEditing(true);
        }}
        onSave={saveResume}
        onExport={handleExport}
      />
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Editor</h2>
            <EditorPreviewToggle 
              showPreview={showPreview} 
              setShowPreview={setShowPreview} 
            />
          </div>
          
          {sections.length === 0 ? (
            <EditorEmptyState onAddSection={() => setShowAddSectionDialog(true)} />
          ) : (
            <EditorMainContent
              sections={sections}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              onAddSection={() => setShowAddSectionDialog(true)}
              handleSectionUpdate={handleSectionUpdate}
              handleMoveSection={handleMoveSection}
              handleDeleteSection={handleDeleteSection}
              handleAISuggestion={handleAISuggestion}
              sectionTypes={sectionTypes}
            />
          )}
        </div>
        
        {showPreview && (
          <div className="lg:w-1/2">
            <h2 className="text-lg font-medium mb-2">Preview</h2>
            <div className="bg-white p-6 rounded-lg border min-h-[calc(100vh-180px)] overflow-y-auto shadow-sm">
              <ResumePreview 
                title={resumeTitle}
                sections={sections}
              />
            </div>
          </div>
        )}
      </div>
      
      <AddSectionDialog
        open={showAddSectionDialog}
        onOpenChange={setShowAddSectionDialog}
        onAdd={handleAddSection}
      />
    </div>
  );
};

export default ResumeEditor;
