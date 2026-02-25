import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Theme", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("toggles dark mode", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel(/toggle theme|tema/i);
    await themeButton.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(true);
  });

  test("toggles back to light mode", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel(/toggle theme|tema/i);
    await themeButton.click();
    await themeButton.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(false);
  });

  test("persists theme across navigation", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel(/toggle theme|tema/i);
    await themeButton.click();

    // Navigate to another page
    await page.getByRole("link", { name: /agents/i }).click();
    await page.waitForURL(/agents/);

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(true);
  });
});
