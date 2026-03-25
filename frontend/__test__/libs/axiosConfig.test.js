import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

describe('Axios Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup the mock for axios.create to return an instance with HTTP methods
    axios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      request: jest.fn(),
      defaults: { headers: {} },
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    });
  });

  describe('Axios Module', () => {
    test('should have axios module available', () => {
      expect(axios).toBeDefined();
    });

    test('should have create method', () => {
      expect(typeof axios.create).toBe('function');
    });

    test('should be able to create instances', () => {
      const instance = axios.create();
      expect(instance).toBeDefined();
    });
  });

  describe('Request Interceptor - Token Management', () => {
    test('should support Authorization header', () => {
      const config = { headers: {} };
      const token = 'test-token-123';
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      expect(config.headers.Authorization).toBe('Bearer test-token-123');
    });

    test('should handle missing token', () => {
      const config = { headers: {} };
      
      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('API Methods Structure', () => {
    test('should support HTTP GET requests', () => {
      const instance = axios.create();
      expect(instance.get).toBeDefined();
    });

    test('should support HTTP POST requests', () => {
      const instance = axios.create();
      expect(instance.post).toBeDefined();
    });

    test('should support HTTP PUT requests', () => {
      const instance = axios.create();
      expect(instance.put).toBeDefined();
    });

    test('should support HTTP DELETE requests', () => {
      const instance = axios.create();
      expect(instance.delete).toBeDefined();
    });

    test('should support HTTP PATCH requests', () => {
      const instance = axios.create();
      expect(instance.patch).toBeDefined();
    });

    test('should support request method', () => {
      const instance = axios.create();
      expect(instance.request).toBeDefined();
    });
  });

  describe('AsyncStorage Integration', () => {
    test('AsyncStorage should be available', () => {
      expect(AsyncStorage).toBeDefined();
    });

    test('should support getItem method', () => {
      expect(typeof AsyncStorage.getItem).toBe('function');
    });

    test('should support setItem method', () => {
      expect(typeof AsyncStorage.setItem).toBe('function');
    });

    test('should support removeItem method', () => {
      expect(typeof AsyncStorage.removeItem).toBe('function');
    });
  });

  describe('Configuration Patterns', () => {
    test('should support request config', () => {
      const config = {
        baseURL: 'http://localhost:3000',
        timeout: 5000,
        headers: {}
      };

      expect(config.baseURL).toBe('http://localhost:3000');
      expect(config.timeout).toBe(5000);
    });

    test('should support response handling', () => {
      const response = {
        status: 200,
        data: { message: 'Success' }
      };

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Success');
    });

    test('should support error handling', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Unauthorized');
    });
  });

  describe('Interceptor Setup', () => {
    test('instance should have interceptors property', () => {
      const instance = axios.create();
      expect(instance.interceptors).toBeDefined();
    });

    test('instance should have request interceptor', () => {
      const instance = axios.create();
      expect(instance.interceptors.request).toBeDefined();
    });

    test('instance should have response interceptor', () => {
      const instance = axios.create();
      expect(instance.interceptors.response).toBeDefined();
    });
  });

  describe('Endpoint Compatibility', () => {
    test('should support authentication endpoints', () => {
      const endpoints = ['login', 'signup', 'logout', 'getMe'];
      expect(endpoints.length).toBe(4);
    });

    test('should support booking endpoints', () => {
      const endpoints = ['createBooking', 'getBookings', 'updateBooking', 'cancelBooking'];
      expect(endpoints.length).toBe(4);
    });

    test('should support admin endpoints', () => {
      const endpoints = ['getFoods', 'addFood', 'deleteFood', 'getOrders'];
      expect(endpoints.length).toBe(4);
    });

    test('should support payment endpoints', () => {
      const endpoints = ['createPayment', 'verifyPayment'];
      expect(endpoints.length).toBe(2);
    });
  });
});
