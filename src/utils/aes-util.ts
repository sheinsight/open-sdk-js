import CryptoJS from 'crypto-js';

/**
 * AesUtil using crypto-js
 */
export class AesUtil {
  private static readonly IV_LENGTH = 16;
  private static readonly DEFAULT_IV_SEED = 'space-station-de';

  private constructor() {}

  /**
   * Decrypt data using default IV
   * Uses a predefined IV seed for decryption. This method is suitable for
   * decrypting data that was encrypted with the same default IV.
   *
   * @param content Base64 encoded encrypted content
   * @param key decryption key
   * @returns decrypted string, or null if decryption fails
   */
  public static decrypt(content: string, key: string): string {
    // Create IV from default seed (take first 16 bytes)
    const ivWords = CryptoJS.enc.Utf8.parse(this.DEFAULT_IV_SEED).words.slice(0, 4);
    const iv = CryptoJS.lib.WordArray.create(ivWords);

    return this.decryptWithIv(content, key, iv, false);
  }

  /**
   * Decrypt response data with dynamic IV extraction
   * This method is specifically designed for decrypting SHEIN gateway response data.
   * The encrypted content contains the IV (Initialization Vector) in the first 16 bytes,
   * followed by the actual encrypted data.
   *
   * @param content Base64 encoded encrypted content (IV + encrypted data)
   * @param key decryption key
   * @returns decrypted response string
   * @throws Error if content or key is null/empty, or if ciphertext format is invalid
   */
  public static decryptResponse(content: string, key: string): string {
    if (!content || !key) {
      throw new Error('Ciphertext and key cannot be empty');
    }

    // Decode base64 content
    const decoded = CryptoJS.enc.Base64.parse(content);

    if (decoded.sigBytes <= this.IV_LENGTH) {
      throw new Error('Ciphertext Error');
    }

    // Extract IV (first 16 bytes)
    const ivWords = decoded.words.slice(0, 4); // 16 bytes = 4 words
    const iv = CryptoJS.lib.WordArray.create(ivWords, this.IV_LENGTH);

    // Extract real data (remaining bytes)
    const realDataWords = decoded.words.slice(4);
    const realDataLength = decoded.sigBytes - this.IV_LENGTH;
    const realData = CryptoJS.lib.WordArray.create(realDataWords, realDataLength);
    const realDataBase64 = CryptoJS.enc.Base64.stringify(realData);

    return this.decryptWithIv(realDataBase64, key, iv, false);
  }

  /**
   * Decrypt data with custom IV and key generation options
   * Core decryption method that supports both deterministic and secure random key generation.
   *
   * @param content Base64 encoded encrypted content
   * @param key decryption key
   * @param iv initialization vector for CBC mode
   * @param useSecureRandom whether to use secure random for key generation (false = deterministic)
   * @returns decrypted string, or throws error if decryption fails
   */
  private static decryptWithIv(content: string, key: string, iv: CryptoJS.lib.WordArray, useSecureRandom: boolean): string {
    if (!content || !key) {
      throw new Error('Ciphertext and key cannot be empty');
    }

    try {
      const secretKey = this.getSecretKey(key, useSecureRandom);

      // Decrypt using AES-CBC
      const decrypted = CryptoJS.AES.decrypt(content, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(`AES decryption failed: ${error}`);
    }
  }

  /**
   * Generate AES secret key
   * Creates a WordArray for AES encryption/decryption with two generation modes.
   *
   * @param key the source key string
   * @param randomKey true for secure random generation, false for deterministic generation
   * @returns WordArray for AES operations
   * @throws Error if key generation fails
   */
  private static getSecretKey(key: string, randomKey: boolean): CryptoJS.lib.WordArray {
    try {
      if (randomKey) {
        return this.generateRandomSecretKey(key);
      } else {
        // Deterministic key derivation - pad or truncate to 16 bytes
        const keyUtf8 = CryptoJS.enc.Utf8.parse(key);

        if (keyUtf8.sigBytes >= 16) {
          // Truncate to 16 bytes
          return CryptoJS.lib.WordArray.create(keyUtf8.words.slice(0, 4), 16);
        } else {
          // Pad to 16 bytes with zeros
          const paddedWords = [...keyUtf8.words];
          const wordsNeeded = 4 - Math.ceil(keyUtf8.sigBytes / 4);
          for (let i = 0; i < wordsNeeded; i++) {
            paddedWords.push(0);
          }
          return CryptoJS.lib.WordArray.create(paddedWords, 16);
        }
      }
    } catch (error) {
      throw new Error(`AES key generation failed: ${error}`);
    }
  }

  /**
   * Generate secure random AES secret key
   * Uses PBKDF2 with key-based seeding to generate a cryptographically secure key.
   * This provides better security than deterministic key derivation.
   *
   * @param key source key string used for seeding
   * @returns WordArray generated using secure method
   * @throws Error if key generation fails
   */
  private static generateRandomSecretKey(key: string): CryptoJS.lib.WordArray {
    try {
      // Use PBKDF2 for key derivation
      const salt = CryptoJS.enc.Utf8.parse(key);
      return CryptoJS.PBKDF2(key, salt, {
        keySize: 4, // 4 words = 16 bytes = 128 bits
        iterations: 1000,
        hasher: CryptoJS.algo.SHA256,
      });
    } catch (error) {
      throw new Error(`Secure key generation failed: ${error}`);
    }
  }
}
