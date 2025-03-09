import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '../integration-tests/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshots on test failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // UI tests
    {
      name: 'ui-chromium',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // API tests - no need for a browser
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.api\.spec\.ts/,
      use: {},
    },

    // Combined tests
    {
      name: 'combined-chromium',
      testMatch: /.*\/combined\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  //webServer: [
  //  {
  //    command: 'NODE_OPTIONS="--no-warnings" npm run start --workspace=web-app',
  //    url: 'http://localhost:3000',
  //    reuseExistingServer: !process.env.CI,
  //    timeout: 120000,
  //  },
  //  {
  //    command: 'NODE_OPTIONS="--no-warnings" npm run start --workspace=server',
  //    url: 'http://localhost:3001',
  //    reuseExistingServer: !process.env.CI,
  //    timeout: 120000,
  //  },
  //],
});
