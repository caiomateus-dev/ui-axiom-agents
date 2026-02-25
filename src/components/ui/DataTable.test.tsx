import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ColumnDef } from "./DataTable";
import { DataTable } from "./DataTable";

interface TestRow {
  id: number;
  name: string;
  value: number;
}

const columns: ColumnDef<TestRow>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  {
    id: "value",
    header: "Value",
    accessor: (row) => row.value,
    sortable: true,
    sortFn: (a, b) => a.value - b.value,
  },
];

const data: TestRow[] = [
  { id: 1, name: "Alpha", value: 30 },
  { id: 2, name: "Beta", value: 10 },
  { id: 3, name: "Gamma", value: 20 },
];

describe("DataTable", () => {
  it("renders loading skeleton", () => {
    const { container } = render(
      <DataTable columns={columns} data={undefined} rowKey={(r) => r.id} isLoading />,
    );
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders custom number of skeleton rows", () => {
    render(
      <DataTable
        columns={columns}
        data={undefined}
        rowKey={(r) => r.id}
        isLoading
        skeletonRows={3}
      />,
    );
    const rows = screen.getAllByRole("row");
    // 1 header row + 3 skeleton rows
    expect(rows).toHaveLength(4);
  });

  it("renders error state", () => {
    render(
      <DataTable columns={columns} data={undefined} rowKey={(r) => r.id} isError />,
    );
    expect(screen.getByText(/Erro ao carregar dados/)).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(
      <DataTable
        columns={columns}
        data={undefined}
        rowKey={(r) => r.id}
        isError
        errorMessage="Custom error"
      />,
    );
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<DataTable columns={columns} data={[]} rowKey={(r) => r.id} />);
    expect(screen.getByText(/Nenhum registro encontrado/)).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("sorts data when sortable column header is clicked", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);

    const valueHeader = screen.getByText("Value");
    await user.click(valueHeader);

    const cells = screen.getAllByRole("cell");
    const valueTexts = cells
      .filter((_, i) => i % 2 === 1)
      .map((c) => c.textContent);
    expect(valueTexts).toEqual(["10", "20", "30"]);
  });

  it("reverses sort on second click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);

    const valueHeader = screen.getByText("Value");
    await user.click(valueHeader);
    await user.click(valueHeader);

    const cells = screen.getAllByRole("cell");
    const valueTexts = cells
      .filter((_, i) => i % 2 === 1)
      .map((c) => c.textContent);
    expect(valueTexts).toEqual(["30", "20", "10"]);
  });

  it("renders pagination controls", () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
        totalRecords={15}
      />,
    );
    expect(screen.getByText(/Pagina 1 de 3/)).toBeInTheDocument();
    expect(screen.getByText(/15 registros/)).toBeInTheDocument();
  });

  it("calls onPageChange on next button click", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );
    await user.click(screen.getByText("Proximo"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous button on first page", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Anterior").closest("button")).toBeDisabled();
  });

  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    await user.click(screen.getByText("Alpha"));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
