import { expect, test } from "@playwright/test";

import { mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test("shows login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /login|entrar/i })).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /entrar|login|sign in/i }).click();
    await expect(page.getByText(/obrigatório/i).first()).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"]').fill("wrong@test.com");
    await page.locator('input[type="password"], input[name="password"]').fill("wrong");
    await page.getByRole("button", { name: /entrar|login|sign in/i }).click();
    await expect(page.getByText(/inválidas|invalid/i)).toBeVisible();
  });

  test("redirects to dashboard on successful login", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"]').fill("test@test.com");
    await page.locator('input[type="password"], input[name="password"]').fill("password");
    await page.getByRole("button", { name: /entrar|login|sign in/i }).click();
    await page.waitForURL("**/");
    await expect(page).not.toHaveURL(/login/);
  });
});
