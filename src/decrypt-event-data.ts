import { AesUtil } from './utils/aes-util';

/**
 * Decrypt the encrypted event data using the provided password.
 * @descriptionCN 使用提供的密码解密加密的事件数据
 * @param encryptedData - The encrypted event data as a string.
 * @param secretKey - The secretKey used for decryption.
 * @returns The decrypted event data as a string.
 */
function decryptEventData(encryptedData: string, secretKey: string): string {
  return AesUtil.decrypt(encryptedData, secretKey);
}

export default decryptEventData;
