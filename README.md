# Shein Open SDK

[![npm version](https://badge.fury.io/js/@sheinsight/open-sdk-js.svg)](https://badge.fury.io/js/@sheinsight/open-sdk-js)
[![CI](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml/badge.svg)](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript SDK for SHEIN Open API integration, providing HTTP request utilities, data decryption methods, and flexible configuration management.

[中文文档](README-zh_CN.md)

## Features

- 🌐 **HTTP Request Client** - Built-in GET/POST methods with axios for excellent cross-platform compatibility
- 📁 **Flexible Configuration** - Simple object-based configuration
- 🔓 **Data Decryption** - Methods for decrypting event data, responses, and secret keys
- 📝 **Full TypeScript Support** - Complete type definitions for better development experience
- 🌍 **Node.js Optimized** - Designed specifically for server-side applications
- ✅ **Input Validation** - Comprehensive validation for all configuration and request parameters
- 🧪 **100% Test Coverage** - Thoroughly tested with Jest
- 📦 **Multiple Formats** - CommonJS, ES Module, and UMD builds
- 🛠️ **Developer Friendly** - Rich examples and clear error messages

## Installation

```bash
npm install @sheinsight/open-sdk-js
```

Or using yarn:

```bash
yarn add @sheinsight/open-sdk-js
```

Or using pnpm:

```bash
pnpm add @sheinsight/open-sdk-js
```

## Quick Start

### Basic Usage

```javascript
const { OpenRequest, decryptEventData, decryptResponse, decryptSecretKey, getByToken } = require('@sheinsight/open-sdk-js');

// Initialize with configuration object
const openRequest = new OpenRequest({
    domain: "your-api-domain",
    openKeyId: "your-open-key-id",
    secretKey: "your-secret-key",
    appid: "your-app-id",
    appSecretKey: "your-app-secret-key",
});

// Make GET request with query parameters
const response = await openRequest.get('/api/endpoint', {
  query: { page: 1, size: 10 }
});
console.log(response);

// Make POST request with body
const result = await openRequest.post('/api/endpoint', {
  body: {
    param1: "value1",
    param2: "value2",
  }
});
console.log(result);

// Use getByToken for authentication
const authResult = await getByToken(
  { domain: "your-api-domain" },
  { tempToken: "your-temp-token" }
);
console.log(authResult);
```

### TypeScript Usage

```typescript
import { OpenRequest, OpenRequestConfig, getByToken, decryptEventData, decryptResponse, decryptSecretKey } from '@sheinsight/open-sdk-js';

// Configuration interface
const config: OpenRequestConfig = {
    domain: "your-api-domain",
    openKeyId: "your-open-key-id",
    secretKey: "your-secret-key",
    appid: "your-app-id",
    appSecretKey: "your-app-secret-key",
};

// API response interfaces
interface ApiResponse {
    code: string;
    msg?: string;
    info?: {
        data?: Array<{
            id: number;
            name: string;
        }>;
        total?: number;
    };
}

const openRequest = new OpenRequest(config);

// Typed GET request
const response = await openRequest.get<ApiResponse>('/api/endpoint', {
  query: { page: "1", size: "10" }
});
console.log(response.info?.data); // Type-safe access

// Typed POST request
const result = await openRequest.post('/api/endpoint', {
  body: {
    param1: "value1",
    param2: "value2"
  }
});
console.log(result);

// Data decryption
const decryptedData: string = decryptEventData("encrypted-data", "secret-key");
const decryptedResponse: string = decryptResponse("encrypted-response", "password");
const decryptedKey: string = decryptSecretKey("encrypted-key", "app-secret-key");
```

## Axios Integration

The SDK uses [axios](https://axios-http.com/) as the underlying HTTP client, providing:

- **Cross-platform compatibility** - Works in Node.js, browsers, and React Native
- **Request/Response interceptors** - Automatic error handling and request transformation  
- **Built-in timeout support** - 30-second default timeout with customization options
- **Automatic JSON handling** - Intelligent content-type detection and parsing
- **Enhanced error messages** - Detailed error information for debugging

### Axios Configuration

You can customize the axios instance used by the SDK:

```javascript
const client = new OpenRequest();

// Configure axios defaults
client.configureAxios({
  timeout: 60000, // 60 seconds
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  }
});

// Or get direct access to the axios instance for advanced configuration
const axiosInstance = client.getAxiosInstance();
axiosInstance.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});
```

## Configuration

#### Constructor

```typescript
new OpenRequest(config: OpenRequestConfig)
```

- `config`: Configuration object containing API credentials and settings

#### Methods

##### `get<T>(path, options?)`

Make a GET request.

```typescript
async get<T = any>(
  path: string,
  options?: GetRequestOptions
): Promise<T>
```

**Parameters:**

- `path`: API endpoint path
- `options` (optional): Request options object
  - `query`: Query parameters as key-value pairs
  - `headers`: Custom HTTP headers

**Example:**

```javascript
const response = await openRequest.get('/api/endpoint', {
  query: { page: 1, size: 10 },
  headers: { 'Authorization': 'Bearer token' }
});
```

##### `post<T>(path, options?)`

Make a POST request.

```typescript
async post<T = any>(
  path: string,
  options?: PostRequestOptions
): Promise<T>
```

**Parameters:**

- `path`: API endpoint path
- `options` (optional): Request options object
  - `body`: Request body data
  - `headers`: Custom HTTP headers
  - `query`: Query parameters as key-value pairs

**Example:**

```javascript
const response = await openRequest.post('/api/endpoint', {
  body: {
    param1: "value1",
    param2: "value2"
  },
  headers: { 'Content-Type': 'application/json' }
});
```

##### `getConfig()`

Get the current configuration.

```typescript
getConfig(): OpenRequestConfig
```

**Example:**

```javascript
const config = openRequest.getConfig();
console.log(config.domain); // "your-api-domain"
```

#### Configuration Object

The `OpenRequestConfig` interface defines the structure for the configuration object:

```typescript
interface OpenRequestConfig {
  /** SHEIN开放平台域名 (必需) */
  domain: string;
  /** 您的开放密钥ID (可选，调用需要签名的接口时必需) */
  openKeyId?: string;
  /** 您的密钥 (可选，调用需要签名的接口时必需) */
  secretKey?: string;
  /** App ID (可选，调用需要签名的接口时必需) */
  appid?: string;
  /** App Secret Key (可选，用于解密响应数据) */
  appSecretKey?: string;
}
```

## Data Decryption Methods

The SDK includes methods for decrypting various types of encrypted data from SHEIN APIs:

### `decryptEventData(encryptedData, password)`

Decrypt encrypted event data.

```javascript
const { decryptEventData } = require('@sheinsight/open-sdk-js');

const decryptedData = decryptEventData(encryptedEventData, password);
console.log(decryptedData);
```

### `decryptResponse(encryptedResponse, password)`

Decrypt encrypted API responses.

```javascript
const { decryptResponse } = require('@sheinsight/open-sdk-js');

const decryptedResponse = decryptResponse(encryptedApiResponse, password);
console.log(decryptedResponse);
```

### `decryptSecretKey(encryptedKey, password)`

Decrypt encrypted secret keys from token exchange responses.

```javascript
const { decryptSecretKey } = require('@sheinsight/open-sdk-js');

const decryptedKey = decryptSecretKey(encryptedSecretKey, password);
console.log(decryptedKey);
```

## Response Format

All HTTP requests return a standardized response format:

```typescript
interface RequestResponse<T> {
  data: T;              // Response data (parsed JSON or raw text)
  status: number;       // HTTP status code
  statusText: string;   // HTTP status message
  headers: Record<string, string>; // Response headers
}
```

**Example:**

```javascript
const response = await client.get('/api/users');
console.log(response.status);     // 200
console.log(response.statusText); // "OK"
console.log(response.data);       // { users: [...] }
console.log(response.headers);    // { "content-type": "application/json" }
```

## Error Handling

The SDK provides comprehensive error handling with descriptive messages:

### Configuration Errors

```javascript
try {
  const client = new OpenRequest('./missing-config.js');
} catch (error) {
  console.error(error.message);
  // "Configuration file not found. Please create a configuration file..."
}
```

### Request Errors

```javascript
try {
  const response = await client.get('/api/invalid-endpoint');
} catch (error) {
  console.error('Request failed:', error.message);
}
```

### Validation Errors

```javascript
try {
  const client = new OpenRequest('./invalid-config.js');
} catch (error) {
  console.error(error.message);
  // "Configuration must include a valid 'domain' field (string)"
}
```

## Examples

### Complete Example with Error Handling

```javascript
const { OpenRequest, getByToken, decryptEventData, decryptResponse, decryptSecretKey } = require('@sheinsight/open-sdk-js');

async function example() {
  try {
    // Initialize client with configuration
    const openRequest = new OpenRequest({
      domain: "your-api-domain",
      openKeyId: "your-open-key-id",
      secretKey: "your-secret-key", 
      appid: "your-app-id",
      appSecretKey: "your-app-secret-key",
    });
    
    // Get current configuration
    const config = openRequest.getConfig();
    console.log('Using API domain:', config.domain);
    
    // Get data list
    const dataList = await openRequest.get('/api/list', {
      query: { page: 1, size: 10 }
    });
    
    console.log('Data list response:', dataList);
    
    // Create or update data
    const result = await openRequest.post('/api/data', {
      body: {
        name: "example",
        type: "sample"
      }
    });
    
    console.log('Operation result:', result);
    
    // Use getByToken for authentication
    const authResult = await getByToken(
      { domain: "your-api-domain" },
      { tempToken: "your-temp-token" }
    );
    
    console.log('Auth result:', authResult);
    
    // Decrypt data examples
    const decryptedData = decryptEventData("encrypted-event-data", "your-secret-key");
    const decryptedResponse = decryptResponse("encrypted-response", "password");
    const decryptedSecretKey = decryptSecretKey("encrypted-key", "your-app-secret-key");
    
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

example();
```

### TypeScript Definitions

The SDK includes comprehensive TypeScript definitions:

```typescript
// Configuration interface
interface OpenRequestConfig {
  domain: string;
  openKeyId?: string;
  secretKey?: string;
  appid?: string;
  appSecretKey?: string;
}

// Request options interfaces
interface GetRequestOptions {
  query?: Record<string, any>;
  headers?: Record<string, any>;
}

interface PostRequestOptions {
  body?: any;
  headers?: Record<string, any>;
  query?: Record<string, any>;
}

// getByToken interfaces
interface IGetByToken {
  interface IRequestBody {
    tempToken: string;
  }
  
  interface IResponseBody {
    code: string;
    msg?: string;
    info?: {
      secretKey: string;
      openKeyId: string;
      appid: string;
      state?: string;
      supplierId: number;
      supplierSource: number;
      supplierBusinessMode?: string;
    };
    traceId?: string;
  }
}
```

## Package Formats

This package provides multiple build formats:

- **`dist/index.js`** - CommonJS bundle (default)
- **`dist/index.esm.js`** - ES Module bundle
- **`dist/index.umd.js`** - UMD bundle for browsers
- **`lib/`** - Individual CommonJS modules for tree-shaking

## Browser Support

While primarily designed for Node.js, the SDK can work in browser environments. However, note that:

- CORS policies may restrict cross-origin requests
- Configuration must be provided programmatically (no file system access)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/sheinsight/open-sdk-js#readme)
- 🐛 [Issue Tracker](https://github.com/sheinsight/open-sdk-js/issues)
- 💬 [Discussions](https://github.com/sheinsight/open-sdk-js/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.
