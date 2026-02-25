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
    await page.getByRole("button", { name: /criar|nova|new|add/i }).click();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test("creates a new api key", async ({ authenticatedPage: page }) => {
    await page.goto("/api-keys");
    await page.getByRole("button", { name: /criar|nova|new|add/i }).click();

    await page.locator('input[name="name"]').fill("New Key");

    // Select application if there's a select field
    const select = page.locator('select[name="application_id"]');
    if (await select.isVisible()) {
      await select.selectOption({ index: 1 });
    }

    await page.getByRole("button", { name: /criar|salvar|save|submit/i }).last().click();
    await expect(page.getByText(/sucesso|success/i)).toBeVisible();
  });
});
