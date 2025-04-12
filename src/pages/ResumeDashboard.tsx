
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Edit, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
}

const ResumeDashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load resumes from localStorage
    const loadResumes = () => {
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        try {
          const parsedResumes = JSON.parse(savedResumes);
          // Convert string dates back to Date objects
          const formattedResumes = parsedResumes.map((resume: any) => ({
            ...resume,
            lastModified: new Date(resume.lastModified)
          }));
          setResumes(formattedResumes);
        } catch (error) {
          console.error('Error parsing resumes from localStorage:', error);
          setResumes([]);
        }
      }
    };

    loadResumes();
    
    // Check if we have a newly optimized resume from the analyze feature
    const pendingOptimizedResume = localStorage.getItem('pendingOptimizedResume');
    if (pendingOptimizedResume) {
      try {
        const optimizedResume = JSON.parse(pendingOptimizedResume);
        // Create a new resume from the optimized content
        const newResume = {
          id: `resume-${Date.now()}`,
          title: optimizedResume.title || 'Optimized Resume',
          lastModified: new Date(),
          content: optimizedResume.content
        };
        
        // Add to resumes list
        const updatedResumes = [...resumes, newResume];
        setResumes(updatedResumes);
        
        // Save to localStorage
        localStorage.setItem('resumes', JSON.stringify(updatedResumes));
        
        // Clear the pending optimized resume
        localStorage.removeItem('pendingOptimizedResume');
        
        // Show success toast
        toast({
          title: "Resume added",
          description: "Your optimized resume has been added to your dashboard.",
        });
      } catch (error) {
        console.error('Error processing optimized resume:', error);
      }
    }
  }, [toast]);

  const handleCreateResume = () => {
    if (!newResumeTitle.trim()) {
      toast({
        title: "Resume title required",
        description: "Please enter a title for your resume",
        variant: "destructive"
      });
      return;
    }

    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      title: newResumeTitle,
      lastModified: new Date(),
      content: '' // Empty content for a new resume
    };

    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    
    // Save to localStorage
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    setShowNewResumeDialog(false);
    setNewResumeTitle('');
    
    // Navigate to the editor
    navigate(`/resumes/edit/${newResume.id}`);
  };

  const handleDeleteResume = (id: string) => {
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    toast({
      title: "Resume deleted",
      description: "The resume has been removed from your dashboard.",
    });
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

      {resumes.length === 0 ? (
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
            <Card key={resume.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{resume.title}</CardTitle>
                <CardDescription>
                  Last modified: {formatDate(resume.lastModified)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="h-24 overflow-hidden text-ellipsis text-sm text-muted-foreground bg-muted/20 p-3 rounded border">
                  {resume.content ? resume.content.substring(0, 200) + '...' : 'Empty resume'}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" size="sm" onClick={() => handleDeleteResume(resume.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Link to={`/resumes/edit/${resume.id}`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNewResumeDialog} onOpenChange={setShowNewResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a title to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resumeTitle">Resume Title</Label>
            <Input
              id="resumeTitle"
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
              placeholder="e.g., Software Developer Resume"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewResumeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateResume}>
              Create Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeDashboard;
