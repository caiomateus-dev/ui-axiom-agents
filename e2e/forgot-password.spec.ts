import { expect, test } from "@playwright/test";

import { mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Forgot Password page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test("shows forgot password form", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /enviar link/i })).toBeVisible();
  });

  test("shows validation error on empty email", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await page.getByRole("button", { name: /enviar link/i }).click();
    await expect(page.locator("text=obrigatório").first()).toBeVisible();
  });

  test("does not submit with invalid email format", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await page.locator('input[type="email"]').fill("not-an-email");
    await page.getByRole("button", { name: /enviar link/i }).click();
    // Browser native validation prevents submission, no success message shown
    await expect(page.locator("text=receberá um link")).not.toBeVisible();
  });

  test("shows success message after valid submission", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await page.locator('input[type="email"]').fill("test@test.com");
    await page.getByRole("button", { name: /enviar link/i }).click();
    await expect(page.locator("text=receberá um link")).toBeVisible();
  });

  test("has link back to login", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await expect(page.getByRole("link", { name: /voltar para o login/i })).toBeVisible();
  });

  test("navigates to login when clicking back link", async ({ page }) => {
    await page.goto("/esqueci-senha");
    await page.getByRole("link", { name: /voltar para o login/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});
