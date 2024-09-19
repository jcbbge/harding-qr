module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest' // Ensure this is set for JavaScript files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: [
    '**/@test/**/*.test.js', // Update to include the new test directory
    '**/?(*.)+(spec|test).[jt]s?(x)' // Keep existing patterns if needed
  ]
};
