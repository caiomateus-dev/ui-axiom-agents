import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Prompts", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows prompts page with table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/prompts");
    await expect(authenticatedPage.locator("text=Prompts").first()).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /novo prompt/i })).toBeVisible();
  });

  test("shows prompt data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/prompts");
    await expect(authenticatedPage.locator("text=Agent GPT-4").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Ativo").first()).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/prompts");
    await authenticatedPage.getByRole("button", { name: /novo prompt/i }).click();
    await expect(authenticatedPage.getByRole("heading", { name: "Novo Prompt" })).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /criar/i })).toBeVisible();
  });

  test("opens edit modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/prompts");
    await authenticatedPage.locator("table tbody tr").first().locator("button").first().click();
    await expect(authenticatedPage.getByText("Editar Prompt")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /salvar/i })).toBeVisible();
  });

  test("opens delete confirmation", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/prompts");
    await authenticatedPage.locator("table tbody tr").first().locator("button").nth(1).click();
    await expect(authenticatedPage.getByText("Confirmar Exclusão")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /excluir/i })).toBeVisible();
  });
});
