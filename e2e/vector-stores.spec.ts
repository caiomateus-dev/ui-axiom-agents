import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Vector Stores", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows vector stores page with table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/vector-stores");
    await expect(authenticatedPage.locator("text=Vector Stores").first()).toBeVisible();
    await expect(
      authenticatedPage.getByRole("button", { name: /novo vector store/i }),
    ).toBeVisible();
  });

  test("shows vector store data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/vector-stores");
    await expect(authenticatedPage.locator("text=Agent GPT-4").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Ativo").first()).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/vector-stores");
    await authenticatedPage.getByRole("button", { name: /novo vector store/i }).click();
    await expect(
      authenticatedPage.getByRole("heading", { name: "Novo Vector Store" }),
    ).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /criar/i })).toBeVisible();
  });

  test("opens edit modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/vector-stores");
    await authenticatedPage.locator("table tbody tr").first().locator("button").first().click();
    await expect(authenticatedPage.getByText("Editar Vector Store")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /salvar/i })).toBeVisible();
  });

  test("opens delete confirmation", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/vector-stores");
    await authenticatedPage.locator("table tbody tr").first().locator("button").nth(1).click();
    await expect(authenticatedPage.getByText("Confirmar Exclusão")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /excluir/i })).toBeVisible();
  });
});
