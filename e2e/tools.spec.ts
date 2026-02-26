import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Tools", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows tools page with table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/tools");
    await expect(authenticatedPage.locator("text=Tools").first()).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /sincronizar/i })).toBeVisible();
  });

  test("shows tool data in table", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/tools");
    await expect(authenticatedPage.locator("text=Web Search").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Calculator").first()).toBeVisible();
  });

  test("shows active and inactive badges", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/tools");
    await expect(authenticatedPage.locator("text=Ativa").first()).toBeVisible();
    await expect(authenticatedPage.locator("text=Inativa").first()).toBeVisible();
  });

  test("opens edit modal", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/tools");
    await authenticatedPage.locator("table tbody tr").first().locator("button").first().click();
    await expect(authenticatedPage.getByText("Editar Tool")).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /salvar/i })).toBeVisible();
  });
});
