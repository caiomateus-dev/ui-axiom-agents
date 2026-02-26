import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Agents", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("lists agents", async ({ authenticatedPage: page }) => {
    await page.goto("/agents");
    await expect(page.getByText("Agent GPT-4")).toBeVisible();
    await expect(page.getByText("Agent GPT-3.5")).toBeVisible();
  });

  test("opens create agent modal", async ({ authenticatedPage: page }) => {
    await page.goto("/agents");
    await page.getByRole("button", { name: /novo agent/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("creates a new agent", async ({ authenticatedPage: page }) => {
    await page.goto("/agents");
    await page.getByRole("button", { name: /novo agent/i }).click();

    await page.locator('input[name="name"]').fill("New Agent");
    await page.locator('input[name="model"]').fill("gpt-4");
    await page.getByRole("dialog").getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });

  test("navigates to agent detail", async ({ authenticatedPage: page }) => {
    await page.goto("/agents");
    await page.locator("table tbody tr").first().click();
    await expect(page).toHaveURL(/agents\/1/);
  });
});
