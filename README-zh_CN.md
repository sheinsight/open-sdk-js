# Shein Open SDK

[![npm version](https://badge.fury.io/js/@sheinsight/open-sdk-js.svg)](https://badge.fury.io/js/@sheinsight/open-sdk-js)
[![CI](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml/badge.svg)](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个全面的 TypeScript SDK，用于 SHEIN 开放 API 集成，提供 HTTP 请求工具、数据解密方法和灵活的配置管理。

[English Documentation](README.md)

## 特性

- 🌐 **HTTP 请求客户端** - 内置 GET/POST 方法，使用 axios 提供出色的跨平台兼容性
- 📁 **灵活配置** - 简单的对象配置方式
- 🔓 **数据解密** - 用于解密事件数据、响应和密钥的方法
- 📝 **完整 TypeScript 支持** - 完整的类型定义，提供更好的开发体验
- 🌍 **Node.js 优化** - 专为服务端应用设计
- ✅ **输入验证** - 对所有配置和请求参数进行全面验证
- 🧪 **100% 测试覆盖** - 使用 Jest 进行全面测试
- 📦 **多种格式** - CommonJS、ES Module 和 UMD 构建
- 🛠️ **开发者友好** - 丰富的示例和清晰的错误消息

## 安装

```bash
npm install @sheinsight/open-sdk-js
```

或使用 yarn：

```bash
yarn add @sheinsight/open-sdk-js
```

或使用 pnpm：

```bash
pnpm add @sheinsight/open-sdk-js
```

## 快速开始

### 基本用法

```javascript
const { OpenRequest, decryptEventData, decryptResponse, decryptSecretKey, getByToken } = require('@sheinsight/open-sdk-js');

// 使用配置对象初始化
const openRequest = new OpenRequest({
    domain: "your-api-domain",
    openKeyId: "your-open-key-id",
    secretKey: "your-secret-key",
    appid: "your-app-id",
    appSecretKey: "your-app-secret-key",
});

// 发送 GET 请求
const response = await openRequest.get('/api/endpoint', {
  query: { page: 1, size: 10 }
});
console.log(response);

// 发送 POST 请求
const result = await openRequest.post('/api/endpoint', {
  body: {
    param1: "value1",
    param2: "value2",
  }
});
console.log(result);

// 使用 getByToken 进行身份验证
const authResult = await getByToken(
  { domain: "your-api-domain" },
  { tempToken: "your-temp-token" }
);
console.log(authResult);
```

### TypeScript 用法

```typescript
import { OpenRequest, OpenRequestConfig, getByToken, decryptEventData, decryptResponse, decryptSecretKey } from '@sheinsight/open-sdk-js';

// 配置接口定义
const config: OpenRequestConfig = {
    domain: "your-api-domain",
    openKeyId: "your-open-key-id",
    secretKey: "your-secret-key",
    appid: "your-app-id",
    appSecretKey: "your-app-secret-key",
};

// API 响应接口
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

// 类型安全的 GET 请求
const response = await openRequest.get<ApiResponse>('/api/endpoint', {
  query: { page: "1", size: "10" }
});
console.log(response.info?.data); // 类型安全访问

// 类型安全的 POST 请求
const result = await openRequest.post('/api/endpoint', {
  body: {
    param1: "value1",
    param2: "value2"
  }
});
console.log(result);

// 数据解密
const decryptedData: string = decryptEventData("encrypted-data", "secret-key");
const decryptedResponse: string = decryptResponse("encrypted-response", "password");
const decryptedKey: string = decryptSecretKey("encrypted-key", "app-secret-key");
```

## Axios 集成

SDK 使用 [axios](https://axios-http.com/) 作为底层 HTTP 客户端，提供：

- **跨平台兼容性** - 在 Node.js、浏览器和 React Native 中都可以工作
- **请求/响应拦截器** - 自动错误处理和请求转换
- **内置超时支持** - 30 秒默认超时，支持自定义选项
- **自动 JSON 处理** - 智能内容类型检测和解析
- **增强错误消息** - 详细的错误信息用于调试

### Axios 配置

您可以自定义 SDK 使用的 axios 实例：

```javascript
const client = new OpenRequest(config);

// 配置 axios 默认设置
client.configureAxios({
  timeout: 60000, // 60 秒
  headers: {
    'User-Agent': 'MyApp/1.0.0'
  }
});

// 或者获取 axios 实例的直接访问权限进行高级配置
const axiosInstance = client.getAxiosInstance();
axiosInstance.interceptors.request.use(config => {
  console.log('发送请求到:', config.url);
  return config;
});
```

## 配置

#### 构造函数

```typescript
new OpenRequest(config: OpenRequestConfig)
```

- `config`: 包含 API 凭证和设置的配置对象

#### 方法

##### `get<T>(path, options?)`

发送 GET 请求。

```typescript
async get<T = any>(
  path: string,
  options?: GetRequestOptions
): Promise<T>
```

**参数:**

- `path`: API 端点路径
- `options` (可选): 请求选项对象
  - `query`: 查询参数键值对
  - `headers`: 自定义 HTTP 请求头

**示例:**

```javascript
const response = await openRequest.get('/api/endpoint', {
  query: { page: 1, size: 10 },
  headers: { 'Authorization': 'Bearer token' }
});
```

##### `post<T>(path, options?)`

发送 POST 请求。

```typescript
async post<T = any>(
  path: string,
  options?: PostRequestOptions
): Promise<T>
```

**参数:**

- `path`: API 端点路径
- `options` (可选): 请求选项对象
  - `body`: 请求体数据
  - `headers`: 自定义 HTTP 请求头
  - `query`: 查询参数键值对

**示例:**

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

获取当前配置。

```typescript
getConfig(): OpenRequestConfig
```

**示例:**

```javascript
const config = openRequest.getConfig();
console.log(config.domain); // "your-api-domain"
```

#### 配置对象

`OpenRequestConfig` 接口定义了配置对象的结构：

```typescript
interface OpenRequestConfig {
  /** API 域名 (必需) */
  domain: string;
  /** 开放密钥ID (可选，调用需要签名的接口时必需) */
  openKeyId?: string;
  /** 密钥 (可选，调用需要签名的接口时必需) */
  secretKey?: string;
  /** App ID (可选，调用需要签名的接口时必需) */
  appid?: string;
  /** App Secret Key (可选，用于解密响应数据) */
  appSecretKey?: string;
}
```

## 数据解密方法

SDK 包含用于解密来自 API 的各种类型加密数据的方法：

### `decryptEventData(encryptedData, password)`

解密加密的事件数据。

```javascript
const { decryptEventData } = require('@sheinsight/open-sdk-js');

const decryptedData = decryptEventData(encryptedEventData, password);
console.log(decryptedData);
```

### `decryptResponse(encryptedResponse, password)`

解密加密的 API 响应。

```javascript
const { decryptResponse } = require('@sheinsight/open-sdk-js');

const decryptedResponse = decryptResponse(encryptedApiResponse, password);
console.log(decryptedResponse);
```

### `decryptSecretKey(encryptedKey, password)`

解密来自令牌交换响应的加密密钥。

```javascript
const { decryptSecretKey } = require('@sheinsight/open-sdk-js');

const decryptedKey = decryptSecretKey(encryptedSecretKey, password);
console.log(decryptedKey);
```

## 错误处理

SDK 提供带有描述性消息的全面错误处理：

### 配置错误

```javascript
try {
  const openRequest = new OpenRequest({ domain: '' });
} catch (error) {
  console.error(error.message);
  // "Configuration must include a valid 'domain' field..."
}
```

### 请求错误

```javascript
try {
  const response = await openRequest.get('/api/invalid-endpoint');
} catch (error) {
  console.error('请求失败:', error.message);
}
```

### 验证错误

```javascript
try {
  const invalidRequest = new OpenRequest({ domain: 'invalid-domain' });
  await invalidRequest.get('/test');
} catch (error) {
  console.error(error.message);
  // "openKeyId is required for signed requests"
}
```

## 示例

### 完整的错误处理示例

```javascript
const { OpenRequest, getByToken, decryptEventData, decryptResponse, decryptSecretKey } = require('@sheinsight/open-sdk-js');

async function example() {
  try {
    // 使用配置初始化客户端
    const openRequest = new OpenRequest({
      domain: "your-api-domain",
      openKeyId: "your-open-key-id",
      secretKey: "your-secret-key", 
      appid: "your-app-id",
      appSecretKey: "your-app-secret-key",
    });
    
    // 获取当前配置
    const config = openRequest.getConfig();
    console.log('使用 API 域名:', config.domain);
    
    // 获取数据列表
    const dataList = await openRequest.get('/api/list', {
      query: { page: 1, size: 10 }
    });
    
    console.log('数据列表响应:', dataList);
    
    // 创建或更新数据
    const result = await openRequest.post('/api/data', {
      body: {
        name: "example",
        type: "sample"
      }
    });
    
    console.log('操作结果:', result);
    
    // 使用 getByToken 进行身份验证
    const authResult = await getByToken(
      { domain: "your-api-domain" },
      { tempToken: "your-temp-token" }
    );
    
    console.log('认证结果:', authResult);
    
    // 数据解密示例
    const decryptedData = decryptEventData("encrypted-event-data", "your-secret-key");
    const decryptedResponse = decryptResponse("encrypted-response", "password");
    const decryptedSecretKey = decryptSecretKey("encrypted-key", "your-app-secret-key");
    
  } catch (error) {
    console.error('API 错误:', error.message);
  }
}

example();
```

### TypeScript 类型定义

SDK 包含全面的 TypeScript 定义：

```typescript
// 配置接口
interface OpenRequestConfig {
  domain: string;
  openKeyId?: string;
  secretKey?: string;
  appid?: string;
  appSecretKey?: string;
}

// 请求选项接口
interface GetRequestOptions {
  query?: Record<string, any>;
  headers?: Record<string, any>;
}

interface PostRequestOptions {
  body?: any;
  headers?: Record<string, any>;
  query?: Record<string, any>;
}

// getByToken 接口
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

## 包格式

此包提供多种构建格式：

- **`dist/index.js`** - CommonJS 包 (默认)
- **`dist/index.esm.js`** - ES Module 包
- **`dist/index.umd.js`** - UMD 包用于浏览器
- **`lib/`** - 单独的 CommonJS 模块用于 tree-shaking

## 浏览器支持

虽然主要为 Node.js 设计，但 SDK 也可以在浏览器环境中工作。但是请注意：

- CORS 策略可能限制跨域请求
- 配置必须以编程方式提供（无文件系统访问）

## 贡献

欢迎贡献！请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解详情。

## 许可证

此项目根据 MIT 许可证授权 - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 支持

- 📖 [文档](https://github.com/sheinsight/open-sdk-js#readme)
- 🐛 [问题跟踪](https://github.com/sheinsight/open-sdk-js/issues)
- 💬 [讨论](https://github.com/sheinsight/open-sdk-js/discussions)

## 更新日志

请查看 [CHANGELOG.md](CHANGELOG.md) 了解每个版本的更改列表。
