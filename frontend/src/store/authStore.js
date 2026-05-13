import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  login: async (user, token) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken: token });
    } catch (error) {
      console.error('Lỗi lưu thông tin đăng nhập:', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'user']);
      set({ user: null, accessToken: null });
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  },

  loadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const [token, userJson] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('user'),
      ]);
      if (token && userJson) {
        set({ accessToken: token, user: JSON.parse(userJson) });
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userData) => {
    const current = get().user;
    const updated = { ...current, ...userData };
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  },
}));

export default useAuthStore;
