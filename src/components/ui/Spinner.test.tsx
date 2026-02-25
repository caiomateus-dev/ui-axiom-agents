import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has animate-spin class", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("applies sm size class", () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-4", "h-4");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-5", "h-5");
  });

  it("applies lg size class", () => {
    const { container } = render(<Spinner size="lg" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-8", "h-8");
  });
});
