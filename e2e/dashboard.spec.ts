import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows dashboard heading", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.locator("h1", { hasText: "Dashboard" })).toBeVisible();
    await expect(authenticatedPage.getByText("Bem-vindo ao Axiom Agents")).toBeVisible();
  });

  test("shows stat cards", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.getByText("Total de Eventos")).toBeVisible();
    await expect(authenticatedPage.getByText("Total de Tokens")).toBeVisible();
  });

  test("shows API Keys stat", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
    await expect(authenticatedPage.locator("main").getByText("API Keys")).toBeVisible();
  });
});
