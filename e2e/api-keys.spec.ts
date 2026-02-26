import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("API Keys", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("lists api keys", async ({ authenticatedPage: page }) => {
    await page.goto("/api-keys");
    await expect(page.getByText("Key Production")).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage: page }) => {
    await page.goto("/api-keys");
    await page.getByRole("button", { name: /nova api key/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("creates a new api key", async ({ authenticatedPage: page }) => {
    await page.goto("/api-keys");
    await page.getByRole("button", { name: /nova api key/i }).click();

    // Select application
    await page.locator("select#application_id").selectOption({ index: 1 });
    await page.locator('input[name="name"]').fill("New Key");
    await page.getByRole("dialog").getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });
});
