
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Check, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onFileSelected: (file: File | null) => void;
  acceptedTypes: string;
  selectedFile: File | null;
}

const FileUploader = ({
  title,
  description,
  icon,
  onFileSelected,
  acceptedTypes,
  selectedFile
}: FileUploaderProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const clearSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelected(null);
  };

  return (
    <Card>
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center h-64 p-6 border-2 border-dashed rounded-lg cursor-pointer",
          isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
          selectedFile ? "bg-muted/50" : "hover:bg-muted/50"
        )}
        onClick={selectedFile ? undefined : handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptedTypes}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium mb-1">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground mb-4">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelectedFile}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              {description}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Upload className="h-4 w-4 mr-2" /> Drag & Drop or Click to Upload
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
