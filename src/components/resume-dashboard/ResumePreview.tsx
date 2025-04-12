
import React from 'react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface ResumePreviewProps {
  title: string;
  sections: ResumeSection[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ title, sections }) => {
  // Function to format text with markdown-like syntax
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // Replace **text** with bold text
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace _text_ with italic text
    formattedContent = formattedContent.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Replace bullet points with HTML list items
    formattedContent = formattedContent.replace(/^•\s*(.*?)$/gm, '<li>$1</li>');
    
    // Replace numbered lists with HTML ordered list items
    formattedContent = formattedContent.replace(/^\d+\.\s*(.*?)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in proper HTML list tags
    if (formattedContent.includes('<li>')) {
      // Add ul tags around bullet points
      formattedContent = formattedContent.replace(
        /(<li>.*?<\/li>)(\n<li>.*?<\/li>)*/g, 
        match => match.includes('• ') ? `<ul>${match}</ul>` : `<ol>${match}</ol>`
      );
    }
    
    // Convert newlines to <br> tags
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  };

  return (
    <div className="font-sans max-w-[800px] mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">{title || 'Resume'}</h1>
      
      {sections.map(section => (
        <div key={section.id} className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b pb-1 mb-2">
            {section.title}
          </h2>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
          />
        </div>
      ))}
    </div>
  );
};
