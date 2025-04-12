
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface SectionEditorProps {
  section: ResumeSection;
  onUpdate: (updatedSection: ResumeSection) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  const [content, setContent] = useState(section.content);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdate({ ...section, content: e.target.value });
  };

  // Text formatting helpers
  const formatText = (formatter: 'bold' | 'italic' | 'bullet' | 'numbered') => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = content.substring(selectionStart, selectionEnd);
    
    let newContent = content;
    let newCursorPos = selectionEnd;
    
    switch (formatter) {
      case 'bold':
        if (selectedText) {
          const formattedText = `**${selectedText}**`;
          newContent = content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd);
          newCursorPos = selectionStart + formattedText.length;
        } else {
          const boldMarker = '**';
          newContent = content.substring(0, selectionStart) + boldMarker + boldMarker + content.substring(selectionEnd);
          newCursorPos = selectionStart + 2;
        }
        break;
        
      case 'italic':
        if (selectedText) {
          const formattedText = `_${selectedText}_`;
          newContent = content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd);
          newCursorPos = selectionStart + formattedText.length;
        } else {
          const italicMarker = '_';
          newContent = content.substring(0, selectionStart) + italicMarker + italicMarker + content.substring(selectionEnd);
          newCursorPos = selectionStart + 1;
        }
        break;
        
      case 'bullet':
        // Find the beginning of the line
        let lineStart = selectionStart;
        while (lineStart > 0 && content[lineStart - 1] !== '\n') {
          lineStart--;
        }
        
        // Add bullet point to the beginning of the line
        if (!content.substring(lineStart, lineStart + 2).includes('• ')) {
          newContent = content.substring(0, lineStart) + '• ' + content.substring(lineStart);
          newCursorPos = selectionEnd + 2;
        }
        break;
        
      case 'numbered':
        // For selected multiple lines, add numbers to each line
        if (selectedText && selectedText.includes('\n')) {
          const lines = selectedText.split('\n');
          const numberedLines = lines.map((line, index) => {
            // Skip empty lines
            if (!line.trim()) return line;
            
            // Remove existing numbering if present
            const trimmedLine = line.replace(/^\d+\.\s+/, '');
            return `${index + 1}. ${trimmedLine}`;
          });
          
          const formattedText = numberedLines.join('\n');
          newContent = content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd);
          newCursorPos = selectionStart + formattedText.length;
        } else {
          // Find the beginning of the line
          let lineStart = selectionStart;
          while (lineStart > 0 && content[lineStart - 1] !== '\n') {
            lineStart--;
          }
          
          // Add numbering to the beginning of the line if not already numbered
          if (!content.substring(lineStart, lineStart + 3).match(/^\d+\.\s/)) {
            newContent = content.substring(0, lineStart) + '1. ' + content.substring(lineStart);
            newCursorPos = selectionEnd + 3;
          }
        }
        break;
    }
    
    setContent(newContent);
    onUpdate({ ...section, content: newContent });
    
    // Set the cursor position after the update
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 pb-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => formatText('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => formatText('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => formatText('bullet')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => formatText('numbered')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        ref={textAreaRef}
        value={content}
        onChange={handleContentChange}
        placeholder={`Enter your ${section.title.toLowerCase()} content here...`}
        className="min-h-[200px] resize-none font-mono"
      />
    </div>
  );
};
