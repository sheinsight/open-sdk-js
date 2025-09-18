# Shein Open SDK

[![npm version](https://badge.fury.io/js/@sheinsight/open-sdk-js.svg)](https://badge.fury.io/js/@sheinsight/open-sdk-js)
[![CI](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml/badge.svg)](https://github.com/sheinsight/open-sdk-js/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/@sheinsight/open-sdk-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个全面的 TypeScript SDK，用于 SHEIN 开放 API 集成，提供 HTTP 请求工具、数据解密方法和灵活的配置管理。

[English Documentation](README.md)

## 特性

- 🌐 **HTTP 请求客户端** - 内置 GET/POST 方法，使用 axios 提供出色的跨平台兼容性
- 📁 **灵活配置** - 支持对象配置，简单易用
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

- **跨平台兼容性** - 在 Node.js、浏览器和 React Native 中工作
- **请求/响应拦截器** - 内置错误处理和请求日志记录
- **自动重试** - 配置对失败请求的重试逻辑
- **请求超时** - 默认 30 秒超时，可配置
- **响应转换** - 自动 JSON 解析和错误格式化

### 自定义 Axios 配置

```javascript
const client = new OpenRequest();

// 配置 axios 实例
client.configureAxios({
  timeout: 60000, // 60 秒超时
  maxRetries: 3,
  retryDelay: 1000
});

// 获取 axios 实例进行高级配置
const axiosInstance = client.getAxiosInstance();
axiosInstance.interceptors.request.use(config => {
  console.log('发送请求:', config.url);
  return config;
});
```

#### 构造函数

```typescript
new OpenRequest(configPath?: string)
```

#### 方法

##### `get<T>(path, options?)`

发送 GET 请求。

```typescript
async get<T = any>(
  path: string,
  options: GetRequestOptions = {}
): Promise<RequestResponse<T>>
```

**参数：**

- `path`: API 端点路径
- `options` (可选): 请求选项对象
  - `query`: 查询参数，键值对格式
  - `headers`: 请求头，键值对格式

**示例：**

```javascript
const response = await client.get('/api/users', {
  query: { page: '1', limit: '10' },
  headers: { 'Authorization': 'Bearer token' }
});
```

##### `post<T>(path, options?)`

发送 POST 请求。

```typescript
async post<T = any>(
  path: string,
  options: PostRequestOptions = {}
): Promise<RequestResponse<T>>
```

**参数：**

- `path`: API 端点路径
- `options` (可选): 请求选项对象
  - `body`: 请求体数据
  - `headers`: 请求头，键值对格式
  - `query`: 查询参数，键值对格式

**示例：**

```javascript
const response = await client.post('/api/users', {
  body: { name: 'John', email: 'john@example.com' },
  headers: { 'Content-Type': 'application/json' },
  query: { source: 'sdk' }
});
```

##### `getConfig()`

获取当前配置。

```typescript
getConfig(): OpenRequestConfig
```

**示例：**

```javascript
const config = client.getConfig();
console.log(config.domain); // "https://api.example.com"
```

#### 静态方法

##### `createConfigFile(configPath, domain, openKeyId, secretKey, appid, appSecretKey, useESModules?)`

创建配置文件。

```typescript
static createConfigFile(
  configPath: string,
  domain: string,
  openKeyId: string,
  secretKey: string,
  appid: string,
  appSecretKey: string,
  useESModules?: boolean
): void
```

**参数：**

- `configPath` (必需): 配置文件路径
- `domain` (必需): SHEIN API 域名 (<https://openapi.sheincorp.com> 或 <https://openapi.sheincorp.cn>)
- `openKeyId` (必需): 您的开放密钥 ID
- `secretKey` (必需): 您的密钥
- `appid` (必需): 您的应用 ID
- `appSecretKey` (必需): 您的应用密钥
- `useESModules` (可选): 使用 ES Modules 格式而非 CommonJS。默认为 `false`

## 数据解密方法

SDK 包含用于解密来自 SHEIN API 各种类型加密数据的方法：

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

## 响应格式

所有 HTTP 请求都返回标准化的响应格式：

```typescript
interface RequestResponse<T> {
  data: T;              // 响应数据 (解析的 JSON 或原始文本)
  status: number;       // HTTP 状态码
  statusText: string;   // HTTP 状态消息
  headers: Record<string, string>; // 响应头部
}
```

**示例：**

```javascript
const response = await client.get('/api/users');
console.log(response.status);     // 200
console.log(response.statusText); // "OK"
console.log(response.data);       // { users: [...] }
console.log(response.headers);    // { "content-type": "application/json" }
```

## 错误处理

SDK 提供全面的错误处理和描述性错误消息：

### 配置错误

```javascript
try {
  const client = new OpenRequest('./missing-config.js');
} catch (error) {
  console.error(error.message);
  // "配置文件未找到。请创建配置文件..."
}
```

### 请求错误

```javascript
try {
  const response = await client.get('/api/invalid-endpoint');
} catch (error) {
  console.error('请求失败:', error.message);
}
```

### 验证错误

```javascript
try {
  const client = new OpenRequest('./invalid-config.js');
} catch (error) {
  console.error(error.message);
  // "配置必须包含有效的 'domain' 字段 (字符串)"
}
```

## 示例

### 完整的错误处理示例

```javascript
const { OpenRequest } = require('@sheinsight/open-sdk-js');

async function example() {
  try {
    // 初始化客户端
    const client = new OpenRequest();
    
    // 获取当前配置
    const config = client.getConfig();
    console.log('使用 API 域名:', config.domain);
    
    // 发送认证请求
    const users = await client.get('/api/users', 
      { page: '1' },
      { 'Authorization': `Bearer ${process.env.API_TOKEN}` }
    );
    
    console.log(`找到 ${users.data.length} 个用户`);
    
    // 创建新用户
    const newUser = await client.post('/api/users', {
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'user'
    });
    
    console.log('创建用户:', newUser.data.id);
    
  } catch (error) {
    console.error('API 错误:', error.message);
  }
}

example();
```

## TypeScript 定义

SDK 包含全面的 TypeScript 定义：

```typescript
// 主要接口
interface OpenRequestConfig {
  domain: string;
}

interface RequestOptions {
  method: 'GET' | 'POST';
  path: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

interface RequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
```

## 包格式

这个包提供多种构建格式：

- **`dist/index.js`** - CommonJS 捆绑包 (默认)
- **`dist/index.esm.js`** - ES Module 捆绑包
- **`dist/index.umd.js`** - 浏览器 UMD 捆绑包
- **`lib/`** - 用于 tree-shaking 的独立 CommonJS 模块

## 浏览器支持

虽然主要为 Node.js 设计，SDK 也可以在浏览器环境中工作。但是请注意：

- 配置文件必须打包或以编程方式提供
- CORS 策略可能限制跨域请求
- 文件系统操作不可用

## 贡献

欢迎贡献！请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解详情。

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 支持

- 📖 [文档](https://github.com/sheinsight/open-sdk-js#readme)
- 🐛 [问题跟踪](https://github.com/sheinsight/open-sdk-js/issues)
- 💬 [讨论区](https://github.com/sheinsight/open-sdk-js/discussions)

## 更新日志

参见 [CHANGELOG.md](CHANGELOG.md) 了解每个版本的更改列表。
