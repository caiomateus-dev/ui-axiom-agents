import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Users", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows users page with table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    await expect(authenticatedPage.locator("text=Usuarios").first()).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /novo usuario/i })).toBeVisible();
  });

  test("shows user data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    await expect(authenticatedPage.getByText("Admin User")).toBeVisible();
    await expect(authenticatedPage.getByText("admin@test.com")).toBeVisible();
    await expect(authenticatedPage.getByText("Regular User")).toBeVisible();
  });

  test("shows role badges", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    await expect(authenticatedPage.getByText("Superuser").first()).toBeVisible();
  });

  test("has search input", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    await expect(authenticatedPage.locator("input[placeholder*=Buscar]")).toBeVisible();
  });

  test("opens create modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    await authenticatedPage.getByRole("button", { name: /novo usuario/i }).click();
    await expect(authenticatedPage.getByRole("heading", { name: "Novo Usuario" })).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /criar/i })).toBeVisible();
  });

  test("opens delete confirmation", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/users");
    // Users row has: edit (pencil), lock/unlock, delete (trash) - delete is the 3rd button
    await authenticatedPage.locator("table tbody tr").first().locator("button").nth(2).click();
    await expect(authenticatedPage.getByText("Excluir Usuario")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /excluir/i })).toBeVisible();
  });
});
