import axios from 'axios';

/**
 * Standardized error handling for the SHEIN Open SDK
 */
export class SDKError extends Error {
  public readonly code: string;
  public readonly status: number | undefined;
  public readonly originalError?: unknown;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status?: number, originalError?: unknown) {
    super(message);
    this.name = 'SDKError';
    this.code = code;
    this.status = status;
    this.originalError = originalError;
  }
}

/**
 * Handle axios errors and convert them to standardized SDK errors
 */
export function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      throw new SDKError('Authentication failed. Please check your API credentials.', 'AUTH_ERROR', status, error);
    }

    if (status === 403) {
      throw new SDKError('Access forbidden. Please check your API permissions.', 'PERMISSION_ERROR', status, error);
    }

    if (status === 404) {
      throw new SDKError('API endpoint not found.', 'NOT_FOUND_ERROR', status, error);
    }

    if (status === 429) {
      throw new SDKError('Rate limit exceeded. Please retry after some time.', 'RATE_LIMIT_ERROR', status, error);
    }

    if (status && status >= 500) {
      throw new SDKError('Server error occurred. Please try again later.', 'SERVER_ERROR', status, error);
    }

    throw new SDKError(message, 'HTTP_ERROR', status, error);
  }

  if (error instanceof Error) {
    throw new SDKError(error.message, 'REQUEST_ERROR', undefined, error);
  }

  throw new SDKError('An unknown error occurred', 'UNKNOWN_ERROR', undefined, error);
}

/**
 * Handle general errors with consistent formatting
 */
export function handleError(error: unknown, context: string = ''): never {
  if (error instanceof SDKError) {
    throw error;
  }

  if (error instanceof Error) {
    const message = context ? `${context}: ${error.message}` : error.message;
    throw new SDKError(message, 'GENERAL_ERROR', undefined, error);
  }

  const message = context ? `${context}: Unknown error occurred` : 'Unknown error occurred';
  throw new SDKError(message, 'UNKNOWN_ERROR', undefined, error);
}

/**
 * Check if error is safe to display to user (doesn't contain sensitive info)
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof SDKError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
