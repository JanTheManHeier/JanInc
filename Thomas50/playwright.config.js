import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8765/Thomas50/',
    headless: true,
    viewport: { width: 414, height: 800 },
  },
  webServer: {
    command: 'node tests/serve.js',
    url: 'http://localhost:8765/Thomas50/',
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 414, height: 800 } } },
  ],
});
