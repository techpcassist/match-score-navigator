
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
  sections?: any[];
}

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
  formatDate: (date: Date) => string;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onDelete, formatDate }) => {
  return (
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
        <Button variant="outline" size="sm" onClick={() => onDelete(resume.id)}>
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
  );
};
