import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Organizations", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("lists organizations", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    await expect(page.getByText("Default Org")).toBeVisible();
    await expect(page.getByText("Second Org")).toBeVisible();
  });

  test("opens create organization modal", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: /nova organiza/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("creates a new organization", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    await page.getByRole("button", { name: /nova organiza/i }).click();

    await page.locator('input[name="name"]').fill("New Org");
    await page.locator('input[name="slug"]').fill("new-org");
    await page.getByRole("dialog").getByRole("button", { name: /criar/i }).click();

    await expect(page.getByText(/sucesso/i)).toBeVisible();
  });

  test("opens edit organization modal", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    // Click the edit button (Pencil icon) in the first data row
    const firstRow = page.locator("table tbody tr").first();
    await firstRow.locator("button").nth(1).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("opens delete confirmation modal", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    // Click the delete button (Trash icon) in the first data row
    const firstRow = page.locator("table tbody tr").first();
    await firstRow.locator("button").nth(2).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/excluir/i).first()).toBeVisible();
  });

  test("opens members modal", async ({ authenticatedPage: page }) => {
    await page.goto("/organizations");
    // Click the members button (Users icon) in the first data row
    const firstRow = page.locator("table tbody tr").first();
    await firstRow.locator("button").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Test User")).toBeVisible();
  });

  test("shows org switcher in sidebar", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    // The org switcher should show the current org name
    await expect(page.getByText("Default Org").first()).toBeVisible();
  });

  test("shows organizations nav item for superuser", async ({ authenticatedPage: page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /organizations/i })).toBeVisible();
  });
});
