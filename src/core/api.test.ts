import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it } from "vitest";

import { server } from "@/test/mocks/server";

import { api } from "./api";

const API_URL = "http://localhost:3000";

describe("api", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("attaches Bearer token from localStorage", async () => {
    localStorage.setItem("access_token", "my-token");

    let capturedAuth = "";
    server.use(
      http.get(`${API_URL}/test`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization") ?? "";
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get("/test");
    expect(capturedAuth).toBe("Bearer my-token");
  });

  it("does not attach Authorization when no token", async () => {
    let capturedAuth: string | null = null;
    server.use(
      http.get(`${API_URL}/test`, ({ request }) => {
        capturedAuth = request.headers.get("Authorization");
        return HttpResponse.json({ ok: true });
      }),
    );

    await api.get("/test");
    expect(capturedAuth).toBeNull();
  });

  it("refreshes token on 401 and retries", async () => {
    localStorage.setItem("access_token", "expired-token");
    localStorage.setItem("refresh_token", "mock-refresh-token");

    let callCount = 0;
    server.use(
      http.get(`${API_URL}/test`, ({ request }) => {
        callCount++;
        const auth = request.headers.get("Authorization");
        if (auth === "Bearer new-access-token") {
          return HttpResponse.json({ ok: true });
        }
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const response = await api.get("/test");
    expect(response.data).toEqual({ ok: true });
    expect(callCount).toBe(2);
  });

  it("clears tokens on 401 when refresh fails", async () => {
    localStorage.setItem("access_token", "expired-token");
    localStorage.setItem("refresh_token", "invalid-refresh");

    server.use(
      http.get(`${API_URL}/test`, () => {
        return new HttpResponse(null, { status: 401 });
      }),
      http.post(`${API_URL}/auth/refresh`, () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    await expect(api.get("/test")).rejects.toThrow();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("clears tokens on 401 when no refresh token exists", async () => {
    localStorage.setItem("access_token", "expired-token");

    server.use(
      http.get(`${API_URL}/test`, () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    await expect(api.get("/test")).rejects.toThrow();
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
