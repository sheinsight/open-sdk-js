import { OpenRequest, SignatureOptions, SignatureResult } from '../src/index';
import { SheinSignatureGenerator } from '../src/utils/signature';

describe('Index exports', () => {
  it('should export OpenRequest class', () => {
    expect(OpenRequest).toBeDefined();
    expect(typeof OpenRequest).toBe('function');
  });

  it('should export SheinSignatureGenerator', () => {
    expect(SheinSignatureGenerator).toBeDefined();
    expect(typeof SheinSignatureGenerator.generateSignature).toBe('function');
  });

  it('should export types', () => {
    const options: SignatureOptions = {
      openKeyId: 'test',
      secretKey: 'test',
      path: '/test',
      timestamp: 1234567890,
      randomKey: 'test',
    };

    const result: SignatureResult = {
      signature: 'test',
      timestamp: 1234567890,
      randomKey: 'test',
    };

    expect(options).toBeDefined();
    expect(result).toBeDefined();
  });

  it('should have all expected exports available', () => {
    expect(OpenRequest).toBeDefined();
    expect(SheinSignatureGenerator).toBeDefined();
    expect(typeof SheinSignatureGenerator.generateSignature).toBe('function');
  });
});
