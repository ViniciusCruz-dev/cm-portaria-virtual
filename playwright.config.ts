import { defineConfig, devices } from '@playwright/test';

const PORTA = 4321;
const BASE = '/cm-portaria-virtual/';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORTA}${BASE}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'celular', use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORTA}`,
    url: `http://localhost:${PORTA}${BASE}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
