import { test, expect, mockApiRoutes } from "./fixtures/auth.fixture";

test.describe("Chat", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await mockApiRoutes(page);
  });

  test("shows chat interface", async ({ authenticatedPage: page }) => {
    await page.goto("/chat");
    await expect(page.locator("textarea, input[type='text']").first()).toBeVisible();
  });

  test("sends a message and receives response", async ({ authenticatedPage: page }) => {
    await page.goto("/chat");

    // Select an agent first
    const agentSelect = page.locator("select").first();
    if (await agentSelect.isVisible()) {
      await agentSelect.selectOption({ index: 1 });
    }

    const input = page.locator("textarea, input[type='text']").first();
    await input.fill("Hello");

    const sendButton = page.getByRole("button", { name: /enviar|send/i });
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await input.press("Enter");
    }

    await expect(page.getByText("Hello! I am an AI assistant.")).toBeVisible();
  });
});
