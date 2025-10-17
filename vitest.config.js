import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        'dist/',
        'build/'
      ],
      all: true,
      lines: 85,
      functions: 90,
      branches: 80,
      statements: 85
    },
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules', 'dist', 'build']
  }
});
