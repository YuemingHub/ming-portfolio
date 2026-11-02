import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 6,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/results.json" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: [/mobile\.spec\.ts/, /journeys\.spec\.ts/],
    },
    {
      name: "firefox",
      // This Windows headless Firefox build freezes under parallel axe/keyboard
      // runs (SWGL "failed mapping default framebuffer" and dropped first Tab).
      // Run it after the other projects so it gets exclusive resources.
      workers: 1,
      dependencies: ["chromium", "webkit", "journeys", "mobile"],
      use: { ...devices["Desktop Firefox"] },
      testIgnore: [/mobile\.spec\.ts/, /journeys\.spec\.ts/],
    },
    {
      name: "webkit",
      workers: 2,
      use: { ...devices["Desktop Safari"] },
      testIgnore: [/mobile\.spec\.ts/, /journeys\.spec\.ts/],
    },
    {
      name: "journeys",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /journeys\.spec\.ts/,
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: "node tests/server.mjs",
    url: `${BASE_URL}/ming/`,
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
