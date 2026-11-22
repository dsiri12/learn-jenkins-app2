// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const baseURL = process.env.CI_ENVIRONMENT_URL || 'http://localhost:3000';
const localBaseURLMatch = /^(https?:\/\/(?:localhost|127\.0\.0\.1))(?::(\d+))?(?:\/|$)/i.exec(baseURL);
const localServerPort =
  localBaseURLMatch && localBaseURLMatch[2]
    ? localBaseURLMatch[2]
    : baseURL.startsWith('https:')
      ? '443'
      : '80';
const localServerURL = localBaseURLMatch
  ? `${localBaseURLMatch[1]}:${localServerPort}`
  : undefined;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  ...(localServerURL
    ? {
        webServer: {
          command: `npx serve -s build -l ${localServerPort}`,
          url: localServerURL,
          reuseExistingServer: !process.env.CI,
        },
      }
    : {}),
});

