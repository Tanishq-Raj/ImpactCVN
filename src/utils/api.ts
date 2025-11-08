// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

// Helper function for API fetch with error handling
export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, options);
  
  if (!response.ok && response.status !== 404) {
    // Try to parse error message
    try {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    } catch {
      throw new Error(`API Error: ${response.status}`);
    }
  }
  
  return response;
};
