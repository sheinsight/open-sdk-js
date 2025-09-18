import { AesUtil } from './utils/aes-util';

/**
 * Decrypt the encrypted key in the token exchange response.
 * @descriptionCN 解密令牌交换响应中的加密密钥
 * @param encryptedData
 * @param secretKey
 */
function decryptSecretKey(encryptedData: string, secretKey: string): string {
  return AesUtil.decrypt(encryptedData, secretKey);
}

export default decryptSecretKey;
