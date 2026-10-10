import { defineConfig, devices } from "@playwright/test";

const port = 4733;

export default defineConfig({
  testDir: "e2e",
  reporter: "list",
  timeout: 180_000,
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx vite --port ${port} --strictPort`,
    port,
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["iPhone 14 Pro Max"], viewport: { width: 390, height: 844 } } },
  ],
});
