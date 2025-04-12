
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCompareResumeRequest } from "./handlers/request-handler.ts";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Process the main request
  return handleCompareResumeRequest(req);
});
