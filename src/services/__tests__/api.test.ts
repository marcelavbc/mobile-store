import { Phone, PhoneDetail } from '@/types';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables before importing the module
const originalEnv = process.env;

describe('api service', () => {
  let getPhones: typeof import('../api').getPhones;
  let getPhoneById: typeof import('../api').getPhoneById;

  beforeAll(() => {
    // Set environment variables before importing
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    process.env.NEXT_PUBLIC_API_KEY = 'test-api-key';
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    // Reset modules to re-import with new env vars
    jest.resetModules();
    const apiModule = await import('../api');
    getPhones = apiModule.getPhones;
    getPhoneById = apiModule.getPhoneById;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getPhones', () => {
    const mockPhones: Phone[] = [
      {
        id: '1',
        brand: 'Apple',
        name: 'iPhone 15',
        basePrice: 999,
        imageUrl: 'https://example.com/iphone15.jpg',
      },
      {
        id: '2',
        brand: 'Samsung',
        name: 'Galaxy S24',
        basePrice: 899,
        imageUrl: 'https://example.com/galaxy.jpg',
      },
    ];

    it('fetches phones without search parameter', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockPhones,
      });

      const result = await getPhones();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/products',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
          }),
        })
      );
      expect(result).toEqual(mockPhones);
    });

    it('fetches phones with search parameter', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => [mockPhones[0]],
      });

      const result = await getPhones('iPhone');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/products?search=iPhone',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
          }),
        })
      );
      expect(result).toEqual([mockPhones[0]]);
    });

    it('handles API URL with trailing slash', async () => {
      // Set env var and re-import
      const originalUrl = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com/';
      jest.resetModules();
      const apiModule = await import('../api');
      const getPhonesWithSlash = apiModule.getPhones;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockPhones,
      });

      await getPhonesWithSlash();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/products',
        expect.any(Object)
      );

      // Restore
      process.env.NEXT_PUBLIC_API_URL = originalUrl;
    });

    it('throws error on 401 unauthorized', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(getPhones()).rejects.toThrow('Invalid API key');
    });

    it('throws error on other API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getPhones()).rejects.toThrow('API Error: 500 Internal Server Error');
    });

    it('handles empty search string', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockPhones,
      });

      await getPhones('');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/products',
        expect.any(Object)
      );
    });
  });

  describe('getPhoneById', () => {
    const mockPhoneDetail: PhoneDetail = {
      id: '1',
      brand: 'Apple',
      name: 'iPhone 15 Pro',
      description: 'The latest iPhone',
      basePrice: 999,
      rating: 4.5,
      specs: {
        screen: '6.1"',
        resolution: '2556 x 1179',
        processor: 'A17 Pro',
        mainCamera: '48MP',
        selfieCamera: '12MP',
        battery: '3274 mAh',
        os: 'iOS 17',
        screenRefreshRate: '120Hz',
      },
      colorOptions: [
        {
          name: 'Blue',
          hexCode: '#0000FF',
          imageUrl: 'https://example.com/blue.jpg',
        },
      ],
      storageOptions: [
        { capacity: '128GB', price: 999 },
        { capacity: '256GB', price: 1099 },
      ],
      similarProducts: [],
    };

    it('fetches phone details by id', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockPhoneDetail,
      });

      const result = await getPhoneById('1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/products/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
          }),
        })
      );
      expect(result).toEqual(mockPhoneDetail);
    });

    it('throws error on 401 unauthorized', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(getPhoneById('1')).rejects.toThrow('Invalid API key');
    });

    it('throws error on 404 not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getPhoneById('999')).rejects.toThrow('API Error: 404 Not Found');
    });

    it('handles missing API key', async () => {
      // Set env var and re-import
      const originalKey = process.env.NEXT_PUBLIC_API_KEY;
      process.env.NEXT_PUBLIC_API_KEY = '';
      jest.resetModules();
      const apiModule = await import('../api');
      const getPhoneByIdNoKey = apiModule.getPhoneById;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => mockPhoneDetail,
      });

      await getPhoneByIdNoKey('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': '',
          }),
        })
      );

      // Restore
      process.env.NEXT_PUBLIC_API_KEY = originalKey;
    });
  });
});
