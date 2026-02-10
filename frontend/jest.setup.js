// Mock ThemedView
jest.mock('@/components/themed-view', () => ({
  ThemedView: 'ThemedView',
}));

// Mock ThemedText
jest.mock('@/components/themed-text', () => ({
  ThemedText: 'ThemedText',
}));

// Mock expo modules that cause runtime issues
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(),
      uri: 'mock-uri',
    })),
  },
}));
