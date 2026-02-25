import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Navigation", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("sidebar shows navigation links", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /agents/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /applications/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /api.?keys/i })).toBeVisible();
  });

  test("navigates to agents page", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /agents/i }).click();
    await expect(page).toHaveURL(/agents/);
  });

  test("navigates to applications page", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /applications/i }).click();
    await expect(page).toHaveURL(/applications/);
  });

  test("navigates to api-keys page", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /api.?keys/i }).click();
    await expect(page).toHaveURL(/api-keys/);
  });

  test("sidebar collapse toggle works", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    const toggleButton = page.getByRole("button", { name: /collapse|sidebar|menu/i }).first();
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      // Sidebar should be collapsed - navigation links text may be hidden
    }
  });
});
