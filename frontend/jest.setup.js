// // Mock ThemedView
// jest.mock('@/components/themed-view', () => ({
//   ThemedView: 'ThemedView',
// }));

// // Mock ThemedText
// jest.mock('@/components/themed-text', () => ({
//   ThemedText: 'ThemedText',
// }));

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

// jest.setup.js
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => <React.Fragment>{props.name}</React.Fragment>,
    MaterialIcons: (props) => <React.Fragment>{props.name}</React.Fragment>,
    // add whichever icon sets you use
  };
});

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|expo-router|@react-native|@expo|expo)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);