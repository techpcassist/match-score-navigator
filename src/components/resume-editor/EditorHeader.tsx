
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileDown, Save } from 'lucide-react';

interface EditorHeaderProps {
  resumeTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onExport: (format: 'pdf' | 'docx') => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  resumeTitle,
  onTitleChange,
  onSave,
  onExport
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/resumes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Input
          value={resumeTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="font-bold text-xl h-10 w-64"
          placeholder="Resume Title"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport('docx')}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export DOCX
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport('pdf')}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button 
          size="sm"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
