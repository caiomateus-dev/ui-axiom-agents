import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Applications", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("lists applications", async ({ authenticatedPage: page }) => {
    await page.goto("/applications");
    await expect(page.getByText("App Production")).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage: page }) => {
    await page.goto("/applications");
    await page.getByRole("button", { name: /nova application/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("creates a new application", async ({ authenticatedPage: page }) => {
    await page.goto("/applications");
    await page.getByRole("button", { name: /nova application/i }).click();

    await page.locator('input[name="name"]').fill("New App");
    await page.getByRole("dialog").getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });
});
