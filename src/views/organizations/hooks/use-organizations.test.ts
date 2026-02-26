import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";
import { createQueryWrapper } from "@/test/test-utils";

import {
  useCreateOrganization,
  useDeleteOrganization,
  useInviteMember,
  useOrganizationMembers,
  useOrganizations,
  useRemoveMember,
  useUpdateOrganization,
} from "./use-organizations";

const API_URL = "http://localhost:3000";

describe("useOrganizations", () => {
  it("fetches the list of organizations", async () => {
    const { result } = renderHook(() => useOrganizations(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0].name).toBe("Default Org");
    expect(result.current.data![1].slug).toBe("second");
  });
});

describe("useOrganizationMembers", () => {
  it("fetches members for an organization", async () => {
    const { result } = renderHook(() => useOrganizationMembers(1), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].user_name).toBe("Test User");
    expect(result.current.data![0].role).toBe("admin");
  });

  it("does not fetch when orgId is null", () => {
    const { result } = renderHook(() => useOrganizationMembers(null), {
      wrapper: createQueryWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateOrganization", () => {
  it("creates a new organization", async () => {
    const { result } = renderHook(() => useCreateOrganization(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      name: "New Org",
      slug: "new-org",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("handles creation error", async () => {
    server.use(
      http.post(`${API_URL}/organizations`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCreateOrganization(), {
      wrapper: createQueryWrapper(),
    });

    await expect(result.current.mutateAsync({ name: "Fail", slug: "fail" })).rejects.toThrow();
  });
});

describe("useUpdateOrganization", () => {
  it("updates an organization", async () => {
    const { result } = renderHook(() => useUpdateOrganization(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      id: 1,
      data: { name: "Updated Org" },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useDeleteOrganization", () => {
  it("deletes an organization", async () => {
    const { result } = renderHook(() => useDeleteOrganization(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useInviteMember", () => {
  it("invites a member to an organization", async () => {
    const { result } = renderHook(() => useInviteMember(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({
      orgId: 1,
      data: {
        name: "New Member",
        email: "member@test.com",
        password: "123456",
        role: "member",
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useRemoveMember", () => {
  it("removes a member from an organization", async () => {
    const { result } = renderHook(() => useRemoveMember(), {
      wrapper: createQueryWrapper(),
    });

    await result.current.mutateAsync({ orgId: 1, userId: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
