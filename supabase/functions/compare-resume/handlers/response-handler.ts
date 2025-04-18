
import { ComparisonResponse } from "./types.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Create a standardized error response with CORS headers
 */
export function createErrorResponse(message: string, status: number): Response {
  // Add more user-friendly error messages for common issues
  let userMessage = message;
  
  if (message.includes("AI service") || message.includes("API key") || message.includes("timed out")) {
    userMessage = "Our AI service is currently unavailable. " + 
      "A simplified analysis will be provided. Please try again later.";
  }
  
  // Add retry information for certain error types
  const shouldRetry = status === 429 || status === 503 || status === 504;
  
  return new Response(
    JSON.stringify({ 
      error: userMessage,
      shouldRetry,
      technicalDetails: message 
    }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status
    }
  );
}

/**
 * Create a standardized success response with CORS headers
 */
export function createSuccessResponse(data: ComparisonResponse): Response {
  // Add a flag to indicate if the result was generated using the AI service
  // or the fallback mechanism
  const responseData = {
    ...data,
    serviceStatus: data.isAIGenerated 
      ? "AI_GENERATED" 
      : "FALLBACK_GENERATED"
  };
  
  return new Response(
    JSON.stringify(responseData),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    }
  );
}
