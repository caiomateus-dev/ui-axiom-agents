import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Webhooks", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await mockApiRoutes(authenticatedPage);
  });

  test("shows webhooks page", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/webhooks");
    await expect(authenticatedPage.locator("text=Webhooks").first()).toBeVisible();
  });

  test("shows application selector", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/webhooks");
    await expect(authenticatedPage.locator("select#application_filter")).toBeVisible();
  });

  test("shows webhooks after selecting application", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/webhooks");
    await authenticatedPage.locator("select#application_filter").selectOption("1");
    await expect(authenticatedPage.getByText("example.com/webhook")).toBeVisible();
  });

  test("opens create modal after selecting application", async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/webhooks");
    await authenticatedPage.locator("select#application_filter").selectOption("1");
    await authenticatedPage.getByRole("button", { name: /novo webhook/i }).click();
    await expect(authenticatedPage.getByRole("heading", { name: "Novo Webhook" })).toBeVisible();
    await expect(authenticatedPage.getByRole("button", { name: /criar/i })).toBeVisible();
  });
});
