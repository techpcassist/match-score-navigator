
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResumeCard } from '@/components/resume-dashboard/ResumeCard';
import { NewResumeDialog } from '@/components/resume-dashboard/NewResumeDialog';
import { useResumes } from '@/hooks/use-resumes';

const ResumeDashboard = () => {
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { resumes, loading, createResume, deleteResume } = useResumes();

  const handleCreateResume = (title: string) => {
    if (!title.trim()) {
      toast({
        title: "Resume title required",
        description: "Please enter a title for your resume",
        variant: "destructive"
      });
      return;
    }

    const newResume = createResume(title);
    setShowNewResumeDialog(false);
    
    // Navigate to the editor
    navigate(`/resumes/edit/${newResume.id}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Button onClick={() => setShowNewResumeDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No resumes yet</h3>
          <p className="text-muted-foreground mb-6">Create your first resume to get started</p>
          <Button onClick={() => setShowNewResumeDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Resume
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <ResumeCard 
              key={resume.id} 
              resume={resume} 
              onDelete={deleteResume} 
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      <NewResumeDialog
        open={showNewResumeDialog}
        onOpenChange={setShowNewResumeDialog}
        onCreateResume={handleCreateResume}
      />
    </div>
  );
};

export default ResumeDashboard;
