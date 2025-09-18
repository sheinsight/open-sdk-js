import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { OpenRequestConfig } from './types';
import { SheinSignatureGenerator } from './utils/signature';
import { handleAxiosError, SDKError } from './utils/error-handler';

export interface GetRequestOptions {
  /** Query parameters */
  query?: Record<string, any>;
  /** Additional headers */
  headers?: Record<string, any>;
}

export interface PostRequestOptions {
  /** Request body data */
  body?: any;
  /** Additional headers */
  headers?: Record<string, any>;
  /** Query parameters */
  query?: Record<string, any>;
}

export class OpenRequest {
  private config: OpenRequestConfig;
  private axiosInstance = axios.create();

  constructor(config: OpenRequestConfig) {
    this.config = config;
    this.setupAxiosDefaults();
  }

  /**
   * Setup default axios configuration
   * @private
   */
  private setupAxiosDefaults(): void {
    this.axiosInstance.defaults.timeout = 30000;
    this.axiosInstance.defaults.validateStatus = status => status < 500;

    // Add request interceptor for debugging (can be disabled in production)
    this.axiosInstance.interceptors.request.use(
      config => {
        // You can add request logging here if needed
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor for consistent error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        // Enhanced error handling
        if (error.response) {
          // Server responded with error status
          const { status, statusText, data } = error.response;
          const message = data?.message || data?.msg || statusText;
          error.message = `Request failed (${status} ${statusText}): ${message}`;
        } else if (error.request) {
          // Request was made but no response received
          error.message = 'Network error: No response received from server';
        }
        return Promise.reject(error);
      }
    );
  }

  private validateDomain(domain: string): void {
    if (!domain || typeof domain !== 'string') {
      throw new SDKError('Configuration must include a valid "domain" field (string)', 'CONFIG_VALIDATION_ERROR');
    }

    // const validDomains = ['https://openapi.sheincorp.com', 'https://openapi.sheincorp.cn'];
    // if (!validDomains.includes(domain)) {
    //   throw new SDKError(`Configuration "domain" must be one of: ${validDomains.join(', ')}`, 'CONFIG_VALIDATION_ERROR');
    // }
  }

  private buildUrl(path: string, query?: Record<string, string>): string {
    const { domain } = this.config;
    this.validateDomain(domain);
    const baseUrl = domain.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let fullUrl = `${baseUrl}${cleanPath}`;

    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString();
      fullUrl += `?${queryString}`;
    }

    return fullUrl;
  }

  private async makeRequest<T = any>(config: AxiosRequestConfig): Promise<any> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance(config);
      return response?.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  private getDefaultHeaders(path: string): Record<string, string> {
    const { appid, openKeyId, secretKey } = this.config;

    if (!openKeyId || typeof openKeyId !== 'string') {
      throw new SDKError('openKeyId is required for signed requests', 'CONFIG_VALIDATION_ERROR');
    }

    if (openKeyId.trim().length === 0) {
      throw new SDKError('openKeyId cannot be empty', 'CONFIG_VALIDATION_ERROR');
    }

    if (!secretKey || typeof secretKey !== 'string') {
      throw new SDKError('secretKey is required for signed requests', 'CONFIG_VALIDATION_ERROR');
    }

    if (secretKey.trim().length === 0) {
      throw new SDKError('secretKey cannot be empty', 'CONFIG_VALIDATION_ERROR');
    }

    if (!path || typeof path !== 'string') {
      throw new SDKError('Request path must be a valid string', 'CONFIG_VALIDATION_ERROR');
    }

    const { timestamp, signature } = SheinSignatureGenerator.generateSignatureWithDefaults(openKeyId, secretKey, path);
    return {
      'x-lt-appid': appid || '',
      'x-lt-openKeyId': openKeyId || '',
      'x-lt-timestamp': String(timestamp),
      'x-lt-signature': signature,
      'Content-Type': 'application/json;charset=UTF-8',
    };
  }

  /**
   * Send a GET request
   * @param path - API endpoint path
   * @param options - Request options (query parameters, headers)
   * @returns Promise resolving to the response
   */
  public async get<T = any>(path: string, options: GetRequestOptions = {}): Promise<any> {
    const { query, headers = {} } = options;
    const url = this.buildUrl(path, query);

    const axiosConfig: AxiosRequestConfig = {
      method: 'GET',
      url,
      headers: {
        ...this.getDefaultHeaders(path),
        ...headers,
      },
    };

    return this.makeRequest<T>(axiosConfig);
  }

  public async purePost<T = any>(path: string, options: PostRequestOptions = {}): Promise<any> {
    const { body, headers = {}, query } = options;
    const url = this.buildUrl(path, query);

    const axiosConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers: {
        ...headers,
      },
      data: body,
    };

    return this.makeRequest<T>(axiosConfig);
  }

  /**
   * Send a POST request
   * @param path - API endpoint path
   * @param options - Request options (body, headers, query parameters)
   * @returns Promise resolving to the response
   */
  public async post<T = any>(path: string, options: PostRequestOptions = {}): Promise<any> {
    const { body, headers = {}, query } = options;
    const url = this.buildUrl(path, query);

    const axiosConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers: {
        ...this.getDefaultHeaders(path),
        ...headers,
      },
      data: body,
    };

    return this.makeRequest<T>(axiosConfig);
  }

  /**
   * Get current configuration
   * @returns Copy of the current configuration
   */
  public getConfig(): OpenRequestConfig {
    return { ...this.config };
  }

  /**
   * Configure axios instance with custom settings
   * @param config - Axios configuration options
   */
  public configureAxios(config: Partial<AxiosRequestConfig>): void {
    Object.assign(this.axiosInstance.defaults, config);
  }

  /**
   * Get the axios instance for advanced configuration
   * @returns The internal axios instance
   */
  public getAxiosInstance() {
    return this.axiosInstance;
  }
}
