import { expect, test } from "@playwright/test";

import { mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Reset Password page", () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test("shows error when no token in URL", async ({ page }) => {
    await page.goto("/redefinir-senha");
    await expect(page.locator("text=Token de redefinição não encontrado")).toBeVisible();
  });

  test("shows reset form when token is present", async ({ page }) => {
    await page.goto("/redefinir-senha?token=valid-test-token");
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.getByRole("button", { name: /redefinir senha/i })).toBeVisible();
  });

  test("validates minimum password length", async ({ page }) => {
    await page.goto("/redefinir-senha?token=valid-test-token");
    await page.locator('input[type="password"]').first().fill("123");
    await page.locator('input[type="password"]').nth(1).fill("123");
    await page.getByRole("button", { name: /redefinir senha/i }).click();
    await expect(page.locator("text=mínimo").first()).toBeVisible();
  });

  test("validates password mismatch", async ({ page }) => {
    await page.goto("/redefinir-senha?token=valid-test-token");
    await page.locator('input[type="password"]').first().fill("password123");
    await page.locator('input[type="password"]').nth(1).fill("different123");
    await page.getByRole("button", { name: /redefinir senha/i }).click();
    await expect(page.locator("text=não coincidem").first()).toBeVisible();
  });

  test("shows success on valid reset", async ({ page }) => {
    await page.goto("/redefinir-senha?token=valid-test-token");
    await page.locator('input[type="password"]').first().fill("newpassword123");
    await page.locator('input[type="password"]').nth(1).fill("newpassword123");
    await page.getByRole("button", { name: /redefinir senha/i }).click();
    await expect(page.locator("text=Senha redefinida com sucesso")).toBeVisible();
  });

  test("shows error on invalid token", async ({ page }) => {
    await page.goto("/redefinir-senha?token=invalid-token");
    await page.locator('input[type="password"]').first().fill("newpassword123");
    await page.locator('input[type="password"]').nth(1).fill("newpassword123");
    await page.getByRole("button", { name: /redefinir senha/i }).click();
    await expect(page.locator("text=inválido ou expirado")).toBeVisible();
  });

  test("has link to login after success", async ({ page }) => {
    await page.goto("/redefinir-senha?token=valid-test-token");
    await page.locator('input[type="password"]').first().fill("newpassword123");
    await page.locator('input[type="password"]').nth(1).fill("newpassword123");
    await page.getByRole("button", { name: /redefinir senha/i }).click();
    await expect(page.getByRole("link", { name: /ir para o login/i })).toBeVisible();
  });
});
