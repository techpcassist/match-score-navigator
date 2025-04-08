
import { supabase } from "@/integrations/supabase/client";

// Extract text from file (PDF or DOCX)
export const extractTextFromFile = async (file: File): Promise<string> => {
  // In a real implementation, this would use a proper PDF/DOCX parser
  // For now, we'll just read text files directly and mock the extraction for other formats
  if (file.type === 'text/plain') {
    return await file.text();
  } else {
    // Mock extraction - in a real app, you'd use a PDF/DOCX library or API
    return `Extracted content from ${file.name}. In a production app, this would use a proper PDF/DOCX parser.`;
  }
};

// Upload file to Supabase Storage
export const uploadResumeFile = async (file: File): Promise<string | null> => {
  try {
    // Generate a unique file path using timestamp and original name
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${timestamp}_${file.name}`;
    
    // Upload the file to the 'resumes' bucket
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Return the file path for future reference
    return data.path;
  } catch (error) {
    console.error('Error in uploadResumeFile:', error);
    return null;
  }
};

// Get public URL for a stored resume file
export const getResumeFileUrl = (filePath: string): string | null => {
  if (!filePath) return null;
  
  const { data } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
