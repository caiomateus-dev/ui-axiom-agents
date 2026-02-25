import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("links label to input via htmlFor", () => {
    render(<Input id="email" label="Email" />);
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", "email");
  });

  it("displays error message when provided", () => {
    render(<Input error="Field is required" />);
    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });

  it("forwards ref to input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies error border class when error is present", () => {
    render(<Input error="Required" placeholder="test" />);
    const input = screen.getByPlaceholderText("test");
    expect(input).toHaveClass("border-error-border");
  });
});
