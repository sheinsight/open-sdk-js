import { decryptEventData, decryptResponse, decryptSecretKey, getByToken } from '../src/index';

describe('Decrypt Functions', () => {
  describe('decryptEventData', () => {
    it('should decrypt event data successfully', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedData = 'k7S6rPbAXNt49tlZ76+owTUu/s6miBP8Dp60/FSiOXA=';
      const secretKey = '283598F3DEA847688A947DB2A54F5878';

      const result = decryptEventData(encryptedData, secretKey);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });

    it('should handle empty encrypted data', () => {
      const secretKey = '283598F3DEA847688A947DB2A54F5878';

      expect(() => decryptEventData('', secretKey)).toThrow('Ciphertext and key cannot be empty');
    });

    it('should handle empty secret key', () => {
      const encryptedData = 'k7S6rPbAXNt49tlZ76+owTUu/s6miBP8Dp60/FSiOXA=';

      expect(() => decryptEventData(encryptedData, '')).toThrow('Ciphertext and key cannot be empty');
    });
  });

  describe('decryptResponse', () => {
    it('should decrypt response data successfully', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedResponse =
        'fu+/vQLvv70Bbu+/vXjvv93y/bnh4FmYK9LIqmE/FwSJgX7n7QWMgkZnP8uWYwhp90bRfPAku+yLd4XgPNagGVaVuhO/3bYi7RrqEMVwRfNyj9ECayw7sIUumzseXr7fzfBkoiDpzOyExAUSCAOObZyVBmGw8A4CcZwkFe3XErN9kDLN8CJ2pKNt/XoXV17usdnUafFITR1AjELZhiAI7uis9e9jsZnb++ivBOx85SBO8AE/IDF0sBaZokZxnT/9mtQQLZtqbQTqCeo+rI2nFdB6bxDBcs/1T6Ivs83EdA+Il0RbKV5Gd0E2FwZKWMWOWiXGOpYwx1z9FX4RhZay6D9N+VbATZ8/fTvCm5SZ3Mz83wOWWxPxENuc567aS8w+PTLf8f+9twkRaYWBU7Q4o8bQnzL9qPcxETI7hquZp29UVqWaM3kx1n13Hvz25HC1wVu7j3eYE6SQubnfx0YPHcFmNCluSFLJnCNfKUXDsf8BhRWqD2yDQ0FkiU0tiXvBgEZAJ4wiUuxzZ7ddFMtCoZthv4Dx06FR5kzddSmyoVg2+A1FqP42w+i4FXhkb6j2o1SbmYLTk/zYN4l8hizZsOOEl9pCNc7KDbYz43NenR6G+NOLWe/mqtMd6OPzZEkvcDoAk2FkoM27wP8d61UUY0YEKtlPslFLNAiCVVM1LgaL6EuoWsHAthy4U0F1Rqsc';
      const password = '64544A12A1F147A4A6A73534A125836A';

      const result = decryptResponse(encryptedResponse, password);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });

    it('should handle empty encrypted response', () => {
      const password = '64544A12A1F147A4A6A73534A125836A';

      expect(() => decryptResponse('', password)).toThrow('Ciphertext and key cannot be empty');
    });

    it('should handle empty password', () => {
      const encryptedResponse = 'fu+/vQLvv70Bbu+/vXjvv93y/bnh4FmYK9LIqmE/FwSJgX7n7QWMgkZnP8uWYwhp';

      expect(() => decryptResponse(encryptedResponse, '')).toThrow('Ciphertext and key cannot be empty');
    });
  });

  describe('decryptSecretKey', () => {
    it('should decrypt secret key successfully', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedKey = 'tRaAgVm76SGoW3Uv8+BQze8v5QT2DD37Qj4BxRG8TB13BeNOl1BYbaBBGkXROxoQ';
      const password = 'CD220D80B31E48A69FEC0FB6D7223421';

      const result = decryptSecretKey(encryptedKey, password);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });

    it('should handle empty encrypted key', () => {
      const password = 'CD220D80B31E48A69FEC0FB6D7223421';

      expect(() => decryptSecretKey('', password)).toThrow('Ciphertext and key cannot be empty');
    });

    it('should handle empty password', () => {
      const encryptedKey = 'tRaAgVm76SGoW3Uv8+BQze8v5QT2DD37Qj4BxRG8TB13BeNOl1BYbaBBGkXROxoQ';

      expect(() => decryptSecretKey(encryptedKey, '')).toThrow('Ciphertext and key cannot be empty');
    });
  });

  describe('getByToken', () => {
    it('should create request with domain config', () => {
      const domainConfig = {
        domain: 'http://openapi-test01.sheincorp.cn',
      };
      const params = {
        tempToken: '11111111',
      };

      expect(() => {
        getByToken(domainConfig, params);
      }).not.toThrow();
    });

    it('should return a promise', () => {
      const domainConfig = {
        domain: 'http://openapi-test01.sheincorp.cn',
      };
      const params = {
        tempToken: 'test-token-123',
      };

      const result = getByToken(domainConfig, params);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle requests with different token types', () => {
      const domainConfig = {
        domain: 'http://openapi-test01.sheincorp.cn',
      };

      const testTokens = ['short-token', 'very-long-token-with-many-characters-1234567890', 'token-with-special-chars!@#$%', '12345678901234567890'];

      testTokens.forEach(token => {
        const params = { tempToken: token };
        expect(() => {
          getByToken(domainConfig, params);
        }).not.toThrow();
      });
    });

    it('should handle domain configurations with different protocols', () => {
      const configs = [
        { domain: 'http://openapi-test01.sheincorp.cn' },
        { domain: 'https://openapi.sheincorp.com' },
        { domain: 'https://openapi.sheincorp.cn' },
      ];

      const params = { tempToken: 'test-token' };

      configs.forEach(config => {
        expect(() => {
          getByToken(config, params);
        }).not.toThrow();
      });
    });
  });
});
