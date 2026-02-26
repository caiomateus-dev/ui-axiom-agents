import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("MCP Servers", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows MCP servers page with table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/mcp-servers");
    await expect(authenticatedPage.locator("text=MCP Servers").first()).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /novo server/i })).toBeVisible();
  });

  test("shows server data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/mcp-servers");
    await expect(authenticatedPage.getByText("File System Server")).toBeVisible();
    await expect(authenticatedPage.locator("table").getByText("stdio").first()).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/mcp-servers");
    await authenticatedPage.getByRole("button", { name: /novo server/i }).click();
    await expect(authenticatedPage.getByRole("heading", { name: "Novo MCP Server" })).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /criar/i })).toBeVisible();
  });

  test("opens edit modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/mcp-servers");
    await authenticatedPage.locator("table tbody tr").first().locator("button").first().click();
    await expect(authenticatedPage.getByText("Editar MCP Server")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /salvar/i })).toBeVisible();
  });

  test("opens delete confirmation", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/mcp-servers");
    await authenticatedPage.locator("table tbody tr").first().locator("button").nth(1).click();
    await expect(authenticatedPage.getByText("Confirmar Exclusão")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /excluir/i })).toBeVisible();
  });
});
