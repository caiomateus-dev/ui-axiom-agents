import { expect, test } from "@playwright/test";

import { mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test("shows login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.locator("text=obrigatóri").first()).toBeVisible();
  });

  test("stays on login with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("wrong@test.com");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.getByRole("button", { name: /entrar/i }).click();
    // After invalid credentials the user remains on the login page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/login/);
  });

  test("redirects to dashboard on successful login", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("test@test.com");
    await page.locator('input[type="password"]').fill("password");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).not.toHaveURL(/login/);
  });
});
