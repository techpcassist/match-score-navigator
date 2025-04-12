import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { useResumeEditor } from '@/hooks/use-resume-editor';
import { SectionTabs } from '@/components/resume-editor/SectionTabs';
import { EditorHeader } from '@/components/resume-editor/EditorHeader';
import { SectionControls } from '@/components/resume-editor/SectionControls';
import { SectionEditor } from '@/components/resume-dashboard/SectionEditor';
import { ResumePreview } from '@/components/resume-dashboard/ResumePreview';
import { AddSectionDialog } from '@/components/resume-dashboard/AddSectionDialog';
import { AIAssistant } from '@/components/resume-dashboard/AIAssistant';

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
    return (
      <div className="container mx-auto py-4 flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Show Preview
                </>
              )}
            </Button>
          </div>
          
          {sections.length === 0 ? (
            <div className="bg-card p-8 rounded-lg border h-[calc(100vh-180px)] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No resume sections found. Create your first section to get started.</p>
                <Button onClick={() => setShowAddSectionDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Section
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border h-[calc(100vh-180px)] overflow-hidden">
              <SectionTabs
                sections={sections}
                currentSection={currentSection}
                onSectionSelect={setCurrentSection}
                onAddSection={() => setShowAddSectionDialog(true)}
              />
              
              <div className="flex-1 overflow-y-auto">
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
              </div>
            </div>
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
