import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Chat", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("shows chat interface", async ({ authenticatedPage: page }) => {
    await page.goto("/chat");
    await expect(page.locator('input[type="text"], input[type="number"]').first()).toBeVisible();
  });

  test("sends a message and receives response", async ({ authenticatedPage: page }) => {
    await page.goto("/chat");

    // Set agent ID (input type="number")
    await page.locator("input#agent_id").fill("1");

    // Type message in the chat input
    const chatInput = page.locator('input[type="text"]');
    await chatInput.fill("Hello");
    await chatInput.press("Enter");

    await expect(page.getByText("Hello! I am an AI assistant.")).toBeVisible();
  });
});
