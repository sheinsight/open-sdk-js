import { OpenRequest } from '../src/open-request';
import { decryptEventData, decryptResponse, decryptSecretKey, getByToken } from '../src/index';

describe('OpenRequest', () => {
  // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
  const mockConfig = {
    domain: 'http://openapi-test01.sheincorp.cn',
    openKeyId: '5C83782096BA46008D66C424CB39803F',
    secretKey: '283598F3DEA847688A947DB2A54F5878',
    appid: '11795D14130008FA5B4FF15DFCADB',
    appSecretKey: 'CD220D80B31E48A69FEC0FB6D7223421',
  };

  describe('constructor', () => {
    it('should create instance with valid config', () => {
      const openRequest = new OpenRequest(mockConfig);
      expect(openRequest).toBeInstanceOf(OpenRequest);
      expect(openRequest.getConfig()).toEqual(mockConfig);
    });

    it('should throw error for missing domain when making requests', async () => {
      const invalidRequest = new OpenRequest({ domain: '' } as any);
      await expect(invalidRequest.get('/test')).rejects.toThrow('Configuration must include a valid "domain" field');
    });
  });

  describe('HTTP methods', () => {
    let openRequest: OpenRequest;

    beforeEach(() => {
      openRequest = new OpenRequest(mockConfig);
    });

    it('should have get method', () => {
      expect(typeof openRequest.get).toBe('function');
    });

    it('should have post method', () => {
      expect(typeof openRequest.post).toBe('function');
    });

    it('should have purePost method', () => {
      expect(typeof openRequest.purePost).toBe('function');
    });

    it('should validate required fields for signed requests', async () => {
      const invalidConfig = { domain: mockConfig.domain };
      const invalidRequest = new OpenRequest(invalidConfig);

      await expect(invalidRequest.get('/test')).rejects.toThrow('openKeyId is required for signed requests');
    });
  });

  describe('configuration', () => {
    it('should return copy of config', () => {
      const openRequest = new OpenRequest(mockConfig);
      const config = openRequest.getConfig();

      expect(config).toEqual(mockConfig);
      expect(config).not.toBe(mockConfig); // Should be a copy
    });

    it('should provide axios instance', () => {
      const openRequest = new OpenRequest(mockConfig);
      const axiosInstance = openRequest.getAxiosInstance();

      expect(axiosInstance).toBeDefined();
      expect(typeof axiosInstance.get).toBe('function');
      expect(typeof axiosInstance.post).toBe('function');
    });
  });
});

describe('Decryption functions', () => {
  describe('decryptEventData', () => {
    it('should decrypt event data', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedData = 'k7S6rPbAXNt49tlZ76+owTUu/s6miBP8Dp60/FSiOXA=';
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const secretKey = '283598F3DEA847688A947DB2A54F5878';

      const result = decryptEventData(encryptedData, secretKey);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });
  });

  describe('decryptSecretKey', () => {
    it('should decrypt secret key', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedKey = 'tRaAgVm76SGoW3Uv8+BQze8v5QT2DD37Qj4BxRG8TB13BeNOl1BYbaBBGkXROxoQ';
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const password = 'CD220D80B31E48A69FEC0FB6D7223421';

      const result = decryptSecretKey(encryptedKey, password);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });
  });

  describe('decryptResponse', () => {
    it('should decrypt response data', () => {
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const encryptedResponse =
        'fu+/vQLvv70Bbu+/vXjvv93y/bnh4FmYK9LIqmE/FwSJgX7n7QWMgkZnP8uWYwhp90bRfPAku+yLd4XgPNagGVaVuhO/3bYi7RrqEMVwRfNyj9ECayw7sIUumzseXr7fzfBkoiDpzOyExAUSCAOObZyVBmGw8A4CcZwkFe3XErN9kDLN8CJ2pKNt/XoXV17usdnUafFITR1AjELZhiAI7uis9e9jsZnb++ivBOx85SBO8AE/IDF0sBaZokZxnT/9mtQQLZtqbQTqCeo+rI2nFdB6bxDBcs/1T6Ivs83EdA+Il0RbKV5Gd0E2FwZKWMWOWiXGOpYwx1z9FX4RhZay6D9N+VbATZ8/fTvCm5SZ3Mz83wOWWxPxENuc567aS8w+PTLf8f+9twkRaYWBU7Q4o8bQnzL9qPcxETI7hquZp29UVqWaM3kx1n13Hvz25HC1wVu7j3eYE6SQubnfx0YPHcFmNCluSFLJnCNfKUXDsf8BhRWqD2yDQ0FkiU0tiXvBgEZAJ4wiUuxzZ7ddFMtCoZthv4Dx06FR5kzddSmyoVg2+A1FqP42w+i4FXhkb6j2o1SbmYLTk/zYN4l8hizZsOOEl9pCNc7KDbYz43NenR6G+NOLWe/mqtMd6OPzZEkvcDoAk2FkoM27wP8d61UUY0YEKtlPslFLNAiCVVM1LgaL6EuoWsHAthy4U0F1Rqsc';
      // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
      const password = '64544A12A1F147A4A6A73534A125836A';

      const result = decryptResponse(encryptedResponse, password);
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });
  });
});

describe('getByToken', () => {
  it('should make request with only domain config', () => {
    // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
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

  it('should accept tempToken parameter', () => {
    // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
    const domainConfig = {
      domain: 'http://openapi-test01.sheincorp.cn',
    };
    // 🚨 WARNING: This is a TEST secretKey, do NOT use it in production! 🚨
    const params = {
      tempToken: 'test-token-123',
    };

    const result = getByToken(domainConfig, params);
    expect(result).toBeInstanceOf(Promise);
  });
});
