
/**
 * Text processing utility functions for resume analysis
 */

/**
 * Cleans text by converting to lowercase and replacing special characters with spaces
 */
export const cleanText = (text: string): string => {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ');
};

/**
 * Extracts basic keywords from text for fallback analysis
 */
export const extractBasicKeywords = (text: string): string[] => {
  // Convert to lowercase and remove special characters
  const cleanedText = cleanText(text);
  
  // Common stop words to filter out
  const stopWords = new Set([
    'and', 'the', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 
    'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 
    'as', 'your', 'have', 'more', 'has', 'an', 'was', 'we', 'will', 'can', 'all', 'use'
  ]);
  
  // Extract words, filter stop words and short words
  const words = cleanedText.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  // Count frequency of each word
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedWords.slice(0, 50); // Return top 50 keywords
};
