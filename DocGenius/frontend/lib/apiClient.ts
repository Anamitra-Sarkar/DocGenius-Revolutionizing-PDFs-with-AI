/**
 * Centralized API client for DocGenius frontend
 * All backend communication must go through this module
 */

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Validate that API_BASE_URL is configured
if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL environment variable is required but not set. ' +
    'Please configure it in your .env.local file or deployment settings.'
  )
}

/**
 * Custom error class for API errors with user-friendly messages
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Type-safe API fetch wrapper with error handling
 * 
 * @param endpoint - API endpoint (e.g., '/health', '/pdf/upload')
 * @param options - Fetch options (method, body, etc.)
 * @returns Parsed JSON response
 * @throws ApiError with user-friendly message
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Set default headers for JSON requests
  const headers: Record<string, string> = {}
  
  // Copy existing headers if any
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }
  
  // Only add Content-Type for JSON bodies (not FormData)
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })
    
    // Try to parse JSON response
    let data: any
    try {
      data = await response.json()
    } catch {
      // If response is not JSON, throw a generic error
      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status
        )
      }
      data = {}
    }
    
    // Handle error responses
    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data.error || data.detail || `Request failed with status ${response.status}`
      throw new ApiError(errorMessage, response.status, data.details)
    }
    
    return data as T
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to the server. Please check your connection and try again.'
      )
    }
    
    // Handle other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    )
  }
}

/**
 * Health check endpoint
 * @returns Health status object
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  return apiFetch('/health')
}
