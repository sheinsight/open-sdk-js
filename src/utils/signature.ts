import { HmacSHA256 } from 'crypto-js';
import { SignatureOptions, SignatureResult } from '../types';
import { Base64 } from 'js-base64';
/**
 * Internal signature generator class for SHEIN API
 * This class is for internal use only and should not be exposed to external users
 */
class SheinSignatureGenerator {
  /**
   * Generates a Shein API signature using HMAC-SHA256 algorithm
   * @internal
   * @param options - The signature generation options
   * @returns The generated signature result
   */
  public static generateSignature(options: SignatureOptions): SignatureResult {
    this.validateOptions(options);

    const { openKeyId, secretKey, path, timestamp, randomKey } = options;

    // Step 1: Assemble signature data VALUE
    const value = `${openKeyId}&${timestamp}&${path}`;

    // Step 2: Assemble signature key KEY
    const key = `${secretKey}${randomKey}`;

    // Step 3: HMAC-SHA256 calculation and convert to hexadecimal
    const hexSignature = HmacSHA256(value, key).toString();

    // Step 4: Base64 encoding
    const base64Signature = Base64.encode(hexSignature);

    // Step 5: Concatenate RandomKey
    const finalSignature = `${randomKey}${base64Signature}`;

    return {
      signature: finalSignature,
      timestamp,
      randomKey,
    };
  }

  /**
   * Generates a signature with auto-generated timestamp and random key
   * @internal
   * @param openKeyId - The open key ID
   * @param secretKey - The secret key
   * @param path - The API path
   * @param customRandomKey - Optional custom random key, if not provided, will generate one
   * @returns The generated signature result
   */
  public static generateSignatureWithDefaults(openKeyId: string, secretKey: string, path: string, customRandomKey?: string): SignatureResult {
    const timestamp = new Date().getTime();
    const randomKey = customRandomKey || this.generateRandomKey(5);

    return this.generateSignature({
      openKeyId,
      secretKey,
      path,
      timestamp,
      randomKey,
    });
  }

  /**
   * Generates a random key for signature
   * @internal
   * @param length - The length of the random key (default: 8)
   * @returns A random string
   */
  public static generateRandomKey(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvuwxyz1234567890';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validates the signature options
   * @param options - The signature options to validate
   * @throws Error if validation fails
   */
  public static validateOptions(options: SignatureOptions): void {
    const { openKeyId, secretKey, path, timestamp, randomKey } = options;

    if (!openKeyId || typeof openKeyId !== 'string') {
      throw new Error('openKeyId is required and must be a string');
    }

    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('secretKey is required and must be a string');
    }

    if (!path || typeof path !== 'string') {
      throw new Error('path is required and must be a string');
    }

    if (!randomKey || typeof randomKey !== 'string') {
      throw new Error('randomKey is required and must be a string');
    }

    // Validate timestamp is a valid number
    if (typeof timestamp !== 'number' || isNaN(timestamp) || timestamp <= 0) {
      throw new Error('timestamp must be a valid positive number');
    }

    // Validate path starts with /
    if (!path.startsWith('/')) {
      throw new Error('path must start with "/"');
    }
  }
}

// Internal export for use within the project only
export { SheinSignatureGenerator };
