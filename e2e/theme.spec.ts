import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Theme", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("toggles dark mode", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel("Toggle theme");
    await themeButton.click();

    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    expect(isDark).toBe(true);
  });

  test("toggles back to light mode", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel("Toggle theme");
    await themeButton.click();
    await themeButton.click();

    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    expect(isDark).toBe(false);
  });

  test("persists theme across navigation", async ({ authenticatedPage: page }) => {
    await page.goto("/");

    const themeButton = page.getByLabel("Toggle theme");
    await themeButton.click();

    // Navigate to another page
    await page.getByRole("link", { name: /agents/i }).click();
    await expect(page).toHaveURL(/agents/);

    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    expect(isDark).toBe(true);
  });
});
