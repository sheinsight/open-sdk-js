/**
 * @file get-by-token.ts
 * @description 获取卖家账号信息
 * @author SheinInsight
 * @license MIT
 */
import { IGetByToken, OpenRequestConfig } from './types';
import { OpenRequest } from './open-request';

/**
 * Get seller account information using a temporary token.
 * @param params - Request body containing the temporary token.
 * @returns Promise resolving to the response with seller account information.
 *
 */

export default function getByToken(config: Pick<OpenRequestConfig, 'domain'>, params: IGetByToken.IRequestBody): Promise<IGetByToken.IResponseBody> {
  const openRequest = new OpenRequest({ domain: config.domain });

  return openRequest.purePost<IGetByToken.IResponseBody>('/open-api/auth/get-by-token', {
    body: params,
  });
}
