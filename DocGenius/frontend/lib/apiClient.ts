/**
 * Centralized API client for DocGenius frontend
 * All backend communication must go through this module
 */

// Cache for API base URL to avoid repeated validation
let cachedApiBaseUrl: string | null = null

/**
 * Get API base URL from environment (cached after first call)
 * @throws Error if NEXT_PUBLIC_API_BASE_URL is not configured
 */
function getApiBaseUrl(): string {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  
  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL environment variable is required but not set. ' +
      'Please configure it in your .env.local file or deployment settings.'
    )
  }
  
  cachedApiBaseUrl = baseUrl
  return baseUrl
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
  const url = `${getApiBaseUrl()}${endpoint}`
  
  // Set default headers for JSON requests
  const headers: Record<string, string> = {}
  
  // Copy existing headers if any
  if (options.headers) {
    const existingHeaders = new Headers(options.headers)
    existingHeaders.forEach((value, key) => {
      headers[key] = value
    })
  }
  
  // Only add Content-Type for JSON bodies (string bodies assumed to be JSON from JSON.stringify)
  // FormData and other body types will set their own Content-Type
  // Check case-insensitively for Content-Type header
  const hasContentType = Object.keys(headers).some(
    key => key.toLowerCase() === 'content-type'
  )
  
  if (options.body && typeof options.body === 'string' && !hasContentType) {
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
    
    // Handle network errors - check for common indicators
    if (error instanceof TypeError) {
      // Network errors are typically TypeErrors with specific characteristics
      const errorStr = error.message.toLowerCase()
      if (errorStr.includes('fetch') || errorStr.includes('network') || errorStr.includes('failed to fetch')) {
        throw new ApiError(
          'Unable to connect to the server. Please check your connection and try again.'
        )
      }
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
