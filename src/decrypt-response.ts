import { AesUtil } from './utils/aes-util';

/**
 * Decrypting the encrypted data when SHEIN proactively calls your interface.
 * @descriptionCN 解密SHEIN主动调用您的接口时的加密数据
 * @param encryptedResponse - The encrypted response as a string.
 * @param secretKey - The secretKey used for decryption.
 * @returns The decrypted response as a string.
 */
function decryptResponse(encryptedResponse: string, secretKey: string): string {
  return AesUtil.decryptResponse(encryptedResponse, secretKey);
}

export default decryptResponse;
