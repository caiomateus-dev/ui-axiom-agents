import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Audit Logs", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows audit logs heading", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/audit-logs");
    await expect(authenticatedPage.locator("text=Audit Logs").first()).toBeVisible();
  });

  test("shows stat cards", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/audit-logs");
    await expect(authenticatedPage.locator("text=Total de Eventos").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Total de Tokens").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Top Agent").first()).toBeVisible();
  });

  test("shows audit data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/audit-logs");
    await expect(authenticatedPage.locator("text=Agent GPT-4").first()).toBeVisible();
  });

  test("has filter inputs", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/audit-logs");
    await expect(authenticatedPage.locator("input[placeholder*=agent]")).toBeVisible();
  });

  test("shows event type badges", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/audit-logs");
    await expect(authenticatedPage.locator("text=chat").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=tool").first()).toBeVisible();
  });
});
