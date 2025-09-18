import { SheinSignatureGenerator } from '../src/utils/signature';
import { SignatureOptions } from '../src/types';

describe('SheinSignatureGenerator', () => {
  // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
  const testOptions: SignatureOptions = {
    openKeyId: 'B96C15416C9240DF96BAA0BC9B367C6D',
    secretKey: '6BEC9C4B668B4B14B17EEF106BB98AE5',
    path: '/open-api/order/purchase-order-info',
    timestamp: 1740709414000,
    randomKey: 'test1',
  };

  describe('generateSignature', () => {
    it('should generate the correct signature for given test data', () => {
      const result = SheinSignatureGenerator.generateSignature(testOptions);

      expect(result.signature).toBeDefined();
      expect(result.signature).toMatch(/^test1/); // Should start with randomKey
      expect(result.timestamp).toBe(testOptions.timestamp);
      expect(result.randomKey).toBe(testOptions.randomKey);
    });

    it('should generate consistent signatures for the same input', () => {
      const result1 = SheinSignatureGenerator.generateSignature(testOptions);
      const result2 = SheinSignatureGenerator.generateSignature(testOptions);

      expect(result1.signature).toBe(result2.signature);
      expect(result1.timestamp).toBe(result2.timestamp);
      expect(result1.randomKey).toBe(result2.randomKey);
    });

    it('should generate different signatures for different inputs', () => {
      const options1 = { ...testOptions };
      const options2 = { ...testOptions, randomKey: 'test2' };

      const result1 = SheinSignatureGenerator.generateSignature(options1);
      const result2 = SheinSignatureGenerator.generateSignature(options2);

      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should generate different signatures for different timestamps', () => {
      const options1 = { ...testOptions };
      const options2 = { ...testOptions, timestamp: 1740709415000 };

      const result1 = SheinSignatureGenerator.generateSignature(options1);
      const result2 = SheinSignatureGenerator.generateSignature(options2);

      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should generate different signatures for different paths', () => {
      const options1 = { ...testOptions };
      const options2 = {
        ...testOptions,
        path: '/open-api/order/different-path',
      };

      const result1 = SheinSignatureGenerator.generateSignature(options1);
      const result2 = SheinSignatureGenerator.generateSignature(options2);

      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should generate different signatures for different openKeyIds', () => {
      const options1 = { ...testOptions };
      const options2 = { ...testOptions, openKeyId: 'DIFFERENT_OPEN_KEY_ID' };

      const result1 = SheinSignatureGenerator.generateSignature(options1);
      const result2 = SheinSignatureGenerator.generateSignature(options2);

      expect(result1.signature).not.toBe(result2.signature);
    });

    it('should generate different signatures for different secretKeys', () => {
      const options1 = { ...testOptions };
      const options2 = { ...testOptions, secretKey: 'DIFFERENT_SECRET_KEY' };

      const result1 = SheinSignatureGenerator.generateSignature(options1);
      const result2 = SheinSignatureGenerator.generateSignature(options2);

      expect(result1.signature).not.toBe(result2.signature);
    });
  });

  describe('generateSignatureWithDefaults', () => {
    it('should generate signature with auto-generated timestamp', () => {
      const result = SheinSignatureGenerator.generateSignatureWithDefaults(testOptions.openKeyId, testOptions.secretKey, testOptions.path);

      expect(result.signature).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.randomKey).toBeDefined();
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should use custom random key if provided', () => {
      const customRandomKey = 'custom123';
      const result = SheinSignatureGenerator.generateSignatureWithDefaults(testOptions.openKeyId, testOptions.secretKey, testOptions.path, customRandomKey);

      expect(result.randomKey).toBe(customRandomKey);
      expect(result.signature).toMatch(new RegExp(`^${customRandomKey}`));
    });

    it('should generate different timestamps for consecutive calls', done => {
      const result1 = SheinSignatureGenerator.generateSignatureWithDefaults(testOptions.openKeyId, testOptions.secretKey, testOptions.path);

      setTimeout(() => {
        const result2 = SheinSignatureGenerator.generateSignatureWithDefaults(testOptions.openKeyId, testOptions.secretKey, testOptions.path);

        expect(result2.timestamp).toBeGreaterThanOrEqual(result1.timestamp);
        done();
      }, 1);
    });
  });

  describe('generateRandomKey', () => {
    it('should generate random key with default length', () => {
      const randomKey = SheinSignatureGenerator.generateRandomKey();

      expect(randomKey).toBeDefined();
      expect(randomKey.length).toBe(32);
      expect(randomKey).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate random key with custom length', () => {
      const length = 16;
      const randomKey = SheinSignatureGenerator.generateRandomKey(length);

      expect(randomKey.length).toBe(length);
      expect(randomKey).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate different random keys', () => {
      const key1 = SheinSignatureGenerator.generateRandomKey();
      const key2 = SheinSignatureGenerator.generateRandomKey();

      expect(key1).not.toBe(key2);
    });

    it('should handle edge case of length 0', () => {
      const randomKey = SheinSignatureGenerator.generateRandomKey(0);

      expect(randomKey).toBe('');
    });

    it('should handle edge case of length 1', () => {
      const randomKey = SheinSignatureGenerator.generateRandomKey(1);

      expect(randomKey.length).toBe(1);
      expect(randomKey).toMatch(/^[A-Za-z0-9]$/);
    });
  });

  describe('validateOptions', () => {
    it('should pass validation for valid options', () => {
      expect(() => {
        SheinSignatureGenerator.validateOptions(testOptions);
      }).not.toThrow();
    });

    it('should throw error for missing openKeyId', () => {
      const invalidOptions = { ...testOptions, openKeyId: '' };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('openKeyId is required and must be a string');
    });

    it('should throw error for non-string openKeyId', () => {
      const invalidOptions = { ...testOptions, openKeyId: 123 as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('openKeyId is required and must be a string');
    });

    it('should throw error for missing secretKey', () => {
      const invalidOptions = { ...testOptions, secretKey: '' };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('secretKey is required and must be a string');
    });

    it('should throw error for non-string secretKey', () => {
      const invalidOptions = { ...testOptions, secretKey: null as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('secretKey is required and must be a string');
    });

    it('should throw error for missing path', () => {
      const invalidOptions = { ...testOptions, path: '' };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('path is required and must be a string');
    });

    it('should throw error for path not starting with /', () => {
      const invalidOptions = { ...testOptions, path: 'invalid-path' };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('path must start with "/"');
    });

    it('should throw error for missing timestamp', () => {
      const invalidOptions = { ...testOptions, timestamp: '' as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('timestamp must be a valid positive number');
    });

    it('should throw error for invalid timestamp', () => {
      const invalidOptions = { ...testOptions, timestamp: 'invalid' as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('timestamp must be a valid positive number');
    });

    it('should throw error for negative timestamp', () => {
      const invalidOptions = { ...testOptions, timestamp: '-123' as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('timestamp must be a valid positive number');
    });

    it('should throw error for missing randomKey', () => {
      const invalidOptions = { ...testOptions, randomKey: '' };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('randomKey is required and must be a string');
    });

    it('should throw error for non-string randomKey', () => {
      const invalidOptions = { ...testOptions, randomKey: undefined as any };

      expect(() => {
        SheinSignatureGenerator.validateOptions(invalidOptions);
      }).toThrow('randomKey is required and must be a string');
    });
  });
});
