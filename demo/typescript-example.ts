import { decryptEventData, decryptResponse, decryptSecretKey, OpenRequest, getByToken, OpenRequestConfig } from '../src/index';

// 配置接口定义
const config: OpenRequestConfig = {
  domain: 'http://openapi-test01.sheincorp.cn',
  openKeyId: '5C83782096BA46008D66C424CB39803F',
  secretKey: '283598F3DEA847688A947DB2A54F5878',
  appid: '11795D14130008FA5B4FF15DFCADB',
  appSecretKey: 'CD220D80B31E48A69FEC0FB6D7223421',
};

// 初始化 OpenRequest 实例
const openRequest = new OpenRequest(config);

// 产品详情接口响应类型
interface ProductDetailResponse {
  code: string;
  msg?: string;
  info?: {
    products?: Array<{
      skuCode: string;
      productName: string;
      // 其他产品字段...
    }>;
  };
}

// 品牌列表接口响应类型
interface BrandListResponse {
  code: string;
  msg?: string;
  info?: {
    brands?: Array<{
      brandId: number;
      brandName: string;
      // 其他品牌字段...
    }>;
    total?: number;
  };
}

// POST 请求示例 - 获取产品详情
const testPost = async (): Promise<void> => {
  try {
    const res = await openRequest.post<ProductDetailResponse>('/open-api/openapi-business-backend/product/full-detail', {
      body: {
        skuCodes: [''],
        language: '',
      },
    });
    console.log('testPost response:', res);
  } catch (error) {
    console.error('testPost error:', (error as Error).message);
  }
};

// GET 请求示例 - 获取品牌列表
const testGet = async (): Promise<void> => {
  try {
    const res = await openRequest.get<BrandListResponse>('/open-api/goods-brand/whole-brands', {
      query: {
        page_num: '1',
        page_size: '10',
      },
    });
    console.log('testGet response:', res);
  } catch (error) {
    console.error('testGet error:', (error as Error).message);
  }
};

// getByToken 示例
const testGetByToken = async (): Promise<void> => {
  try {
    const res = await getByToken(
      {
        domain: 'http://openapi-test01.sheincorp.cn',
      },
      {
        tempToken: '11111111',
      }
    );
    console.log('getByToken response:', res);
  } catch (error) {
    console.error('getByToken error:', (error as Error).message);
  }
};

// 数据解密示例
const testDecryption = (): void => {
  try {
    // 解密事件数据
    const decryptedData: string = decryptEventData('k7S6rPbAXNt49tlZ76+owTUu/s6miBP8Dp60/FSiOXA=', '283598F3DEA847688A947DB2A54F5878');
    console.log('Decrypted event data:', decryptedData);

    // 解密密钥
    const decryptedSecretKey: string = decryptSecretKey('tRaAgVm76SGoW3Uv8+BQze8v5QT2DD37Qj4BxRG8TB13BeNOl1BYbaBBGkXROxoQ', 'CD220D80B31E48A69FEC0FB6D7223421');
    console.log('Decrypted secret key:', decryptedSecretKey);

    // 解密响应数据
    const body =
      'fu+/vQLvv70Bbu+/vXjvv93y/bnh4FmYK9LIqmE/FwSJgX7n7QWMgkZnP8uWYwhp90bRfPAku+yLd4XgPNagGVaVuhO/3bYi7RrqEMVwRfNyj9ECayw7sIUumzseXr7fzfBkoiDpzOyExAUSCAOObZyVBmGw8A4CcZwkFe3XErN9kDLN8CJ2pKNt/XoXV17usdnUafFITR1AjELZhiAI7uis9e9jsZnb++ivBOx85SBO8AE/IDF0sBaZokZxnT/9mtQQLZtqbQTqCeo+rI2nFdB6bxDBcs/1T6Ivs83EdA+Il0RbKV5Gd0E2FwZKWMWOWiXGOpYwx1z9FX4RhZay6D9N+VbATZ8/fTvCm5SZ3Mz83wOWWxPxENuc567aS8w+PTLf8f+9twkRaYWBU7Q4o8bQnzL9qPcxETI7hquZp29UVqWaM3kx1n13Hvz25HC1wVu7j3eYE6SQubnfx0YPHcFmNCluSFLJnCNfKUXDsf8BhRWqD2yDQ0FkiU0tiXvBgEZAJ4wiUuxzZ7ddFMtCoZthv4Dx06FR5kzddSmyoVg2+A1FqP42w+i4FXhkb6j2o1SbmYLTk/zYN4l8hizZsOOEl9pCNc7KDbYz43NenR6G+NOLWe/mqtMd6OPzZEkvcDoAk2FkoM27wP8d61UUY0YEKtlPslFLNAiCVVM1LgaL6EuoWsHAthy4U0F1Rqsc';
    const res: string = decryptResponse(body, '64544A12A1F147A4A6A73534A125836A');
    console.log('Decrypted response data:', res);
  } catch (error) {
    console.error('Decryption error:', (error as Error).message);
  }
};

// 运行示例
async function runExamples(): Promise<void> {
  console.log('=== SHEIN Open SDK TypeScript Examples ===\n');

  console.log('1. Testing getByToken...');
  await testGetByToken();

  console.log('\n2. Testing POST request...');
  await testPost();

  console.log('\n3. Testing GET request...');
  await testGet();

  console.log('\n4. Testing data decryption...');
  testDecryption();

  console.log('\n=== TypeScript Examples completed ===');
}

// 执行示例
runExamples().catch(console.error);
