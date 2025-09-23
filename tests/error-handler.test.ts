import axios, { AxiosError } from 'axios';
import { SDKError, handleAxiosError, handleError, getSafeErrorMessage } from '../src/utils/error-handler';

describe('SDKError', () => {
  it('should create error with default parameters', () => {
    const error = new SDKError('Test message');

    expect(error.name).toBe('SDKError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.status).toBeUndefined();
    expect(error.originalError).toBeUndefined();
  });

  it('should create error with all parameters', () => {
    const originalError = new Error('Original');
    const error = new SDKError('Test message', 'TEST_CODE', 400, originalError);

    expect(error.name).toBe('SDKError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.status).toBe(400);
    expect(error.originalError).toBe(originalError);
  });
});

describe('handleAxiosError', () => {
  it('should handle 401 authentication error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
      message: 'Request failed with status code 401',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('Authentication failed. Please check your API credentials.');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('AUTH_ERROR');
      expect((error as SDKError).status).toBe(401);
    }
  });

  it('should handle 403 permission error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 403,
        data: { message: 'Permission denied' },
      },
      message: 'Request failed with status code 403',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('Access forbidden. Please check your API permissions.');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('PERMISSION_ERROR');
      expect((error as SDKError).status).toBe(403);
    }
  });

  it('should handle 404 not found error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 404,
        data: {},
      },
      message: 'Request failed with status code 404',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('API endpoint not found.');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('NOT_FOUND_ERROR');
      expect((error as SDKError).status).toBe(404);
    }
  });

  it('should handle 429 rate limit error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 429,
        data: {},
      },
      message: 'Request failed with status code 429',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('Rate limit exceeded. Please retry after some time.');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('RATE_LIMIT_ERROR');
      expect((error as SDKError).status).toBe(429);
    }
  });

  it('should handle 500+ server errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
      message: 'Request failed with status code 500',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('Server error occurred. Please try again later.');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('SERVER_ERROR');
      expect((error as SDKError).status).toBe(500);
    }
  });

  it('should handle generic HTTP errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { message: 'Bad request' },
      },
      message: 'Request failed with status code 400',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow(SDKError);
    expect(() => handleAxiosError(axiosError)).toThrow('Bad request');

    try {
      handleAxiosError(axiosError);
    } catch (error) {
      expect((error as SDKError).code).toBe('HTTP_ERROR');
      expect((error as SDKError).status).toBe(400);
    }
  });

  it('should handle axios error without response data message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {},
      },
      message: 'Original error message',
    } as AxiosError;

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(() => handleAxiosError(axiosError)).toThrow('Original error message');
  });

  it('should handle non-axios Error objects', () => {
    const error = new Error('Regular error');
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    expect(() => handleAxiosError(error)).toThrow(SDKError);
    expect(() => handleAxiosError(error)).toThrow('Regular error');

    try {
      handleAxiosError(error);
    } catch (sdkError) {
      expect((sdkError as SDKError).code).toBe('REQUEST_ERROR');
      expect((sdkError as SDKError).status).toBeUndefined();
    }
  });

  it('should handle unknown error types', () => {
    const error = 'string error';
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    expect(() => handleAxiosError(error)).toThrow(SDKError);
    expect(() => handleAxiosError(error)).toThrow('An unknown error occurred');

    try {
      handleAxiosError(error);
    } catch (sdkError) {
      expect((sdkError as SDKError).code).toBe('UNKNOWN_ERROR');
      expect((sdkError as SDKError).status).toBeUndefined();
    }
  });
});

describe('handleError', () => {
  it('should re-throw SDKError as-is', () => {
    const sdkError = new SDKError('SDK error', 'TEST_CODE');

    expect(() => handleError(sdkError)).toThrow(sdkError);
  });

  it('should handle Error with context', () => {
    const error = new Error('Test error');

    expect(() => handleError(error, 'Test context')).toThrow(SDKError);
    expect(() => handleError(error, 'Test context')).toThrow('Test context: Test error');

    try {
      handleError(error, 'Test context');
    } catch (sdkError) {
      expect((sdkError as SDKError).code).toBe('GENERAL_ERROR');
    }
  });

  it('should handle Error without context', () => {
    const error = new Error('Test error');

    expect(() => handleError(error)).toThrow(SDKError);
    expect(() => handleError(error)).toThrow('Test error');
  });

  it('should handle unknown error with context', () => {
    const error = 'string error';

    expect(() => handleError(error, 'Test context')).toThrow(SDKError);
    expect(() => handleError(error, 'Test context')).toThrow('Test context: Unknown error occurred');

    try {
      handleError(error, 'Test context');
    } catch (sdkError) {
      expect((sdkError as SDKError).code).toBe('UNKNOWN_ERROR');
    }
  });

  it('should handle unknown error without context', () => {
    const error = { some: 'object' };

    expect(() => handleError(error)).toThrow(SDKError);
    expect(() => handleError(error)).toThrow('Unknown error occurred');
  });
});

describe('getSafeErrorMessage', () => {
  it('should return SDKError message', () => {
    const error = new SDKError('SDK error message');

    expect(getSafeErrorMessage(error)).toBe('SDK error message');
  });

  it('should return Error message', () => {
    const error = new Error('Regular error message');

    expect(getSafeErrorMessage(error)).toBe('Regular error message');
  });

  it('should return default message for unknown errors', () => {
    const error = 'string error';

    expect(getSafeErrorMessage(error)).toBe('An unknown error occurred');
  });

  it('should return default message for null/undefined', () => {
    expect(getSafeErrorMessage(null)).toBe('An unknown error occurred');
    expect(getSafeErrorMessage(undefined)).toBe('An unknown error occurred');
  });
});
