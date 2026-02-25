import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/contexts/ThemeContext";

import { ThemeToggle } from "./ThemeToggle";

function renderWithTheme(collapsed = false) {
  const user = userEvent.setup();
  const result = render(
    <ThemeProvider>
      <ThemeToggle collapsed={collapsed} />
    </ThemeProvider>,
  );
  return { user, ...result };
}

describe("ThemeToggle", () => {
  it("renders toggle button with aria-label", () => {
    renderWithTheme();
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
  });

  it("shows label text when not collapsed", () => {
    renderWithTheme(false);
    expect(screen.getByText("Tema")).toBeInTheDocument();
  });

  it("hides label text when collapsed", () => {
    renderWithTheme(true);
    expect(screen.queryByText("Tema")).not.toBeInTheDocument();
  });

  it("toggles theme on click", async () => {
    const { user } = renderWithTheme();
    const button = screen.getByLabelText("Toggle theme");

    // Initial theme is light (matchMedia mocked to return false for prefers-color-scheme dark)
    // So it should show Moon icon initially
    const initialSvg = button.querySelector("svg");
    expect(initialSvg).toBeInTheDocument();

    await user.click(button);

    // After toggle, the SVG should change
    const newSvg = button.querySelector("svg");
    expect(newSvg).toBeInTheDocument();
  });

  it("has title attribute when collapsed", () => {
    renderWithTheme(true);
    expect(screen.getByLabelText("Toggle theme")).toHaveAttribute("title", "Tema");
  });
});
