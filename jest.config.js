const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.js',
  ],
  // Handle ESM modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(remark|remark-parse|remark-html|unified|unist-util-visit|unist-util-is|bail|is-plain-obj|trough|vfile|vfile-message|mdast-util-to-hast|mdast-util-definitions|unist-util-position|unist-util-generated|hast-util-to-html|html-void-elements|property-information|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch|ccount|escape-string-regexp|character-entities-legacy|character-entities-html4|character-reference-invalid|character-entities)/)',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
