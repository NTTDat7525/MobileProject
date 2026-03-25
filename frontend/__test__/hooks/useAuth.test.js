import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';

jest.mock('@react-native-async-storage/async-storage');

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  test('should initialize with null user and loading true', async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  test('should load user from AsyncStorage on mount', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  test('should have logout function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.logout).toBe('function');
  });

  test('should clear user and tokens on logout', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    AsyncStorage.removeItem.mockResolvedValue(null);

    await act(async () => {
      await result.current.logout();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
  });

  test('should handle AsyncStorage errors gracefully', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
