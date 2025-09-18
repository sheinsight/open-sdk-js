export interface SignatureOptions {
  openKeyId: string;
  secretKey: string;
  path: string;
  timestamp: number;
  randomKey: string;
}

export interface SignatureResult {
  signature: string;
  timestamp: number;
  randomKey: string;
}

export type OpenRequestConfig = {
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
};

export interface RequestOptions {
  method: 'GET' | 'POST';
  path: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

export declare namespace IGetByToken {
  interface IRequestBody {
    /** 获取卖家账号信息的token */
    tempToken: string;
  }

  interface IInfo {
    /** 卖家账号秘钥，需用开发者APP_Secretkey解密 */
    secretKey: string;
    /** 卖家账号openKeyId */
    openKeyId: string;
    /** 开发者APP_ID */
    appid: string;
    /** 原样返回的标识 */
    state?: string;
    /** SHEIN商户ID */
    supplierId: number;
    /** 供应商来源 */
    supplierSource: number;
    /** 供应商业务类型 */
    supplierBusinessMode?: string;
  }

  interface IResponseBody {
    /** 响应码. 0:处理成功 */
    code: string;
    /** 响应描述 */
    msg?: string;
    /** 响应内容 */
    info?: IInfo;
    /** 请求的唯一标识；用于异常报错跟踪 */
    traceId?: string;
  }
}
