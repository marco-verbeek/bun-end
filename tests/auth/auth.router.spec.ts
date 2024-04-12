import { describe, expect, it } from "bun:test";
import app from "../../src";
import { generateUser } from "../fixtures/user.fixture";

describe("Auth Router", () => {
  describe("POST /auth/login", () => {
    it("should successfully log a user in returning an auth token", async () => {
      const username = "user-login-name";
      const password = "user-login-pw-123!";

      await generateUser({ username, password });

      const res = await app.request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toHaveProperty("token");
    });

    it("should return a 403 if the password is incorrect", async () => {
      const username = "user-login-name";
      const password = "user-login-pw-123!";

      await generateUser({ username, password });

      const res = await app.request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: "incorrect-password",
        }),
      });

      expect(res.status).toBe(403);
    });

    it("should return a 403 if the username does not exist", async () => {
      const res = await app.request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "non-existent-user",
          password: "password",
        }),
      });

      expect(res.status).toBe(403);
    });
  });

  describe("POST /auth/register", () => {
    it("should successfully register a user", async () => {
      const username = "user-register-name";
      const password = "user-register-pw-123!";

      const res = await app.request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toHaveProperty("token");
    });

    it("should return a 400 if the username is already taken", async () => {
      const username = "user-register-name";
      const password = "user-register-pw-123!";

      await generateUser({ username, password });

      const res = await app.request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      expect(res.status).toBe(400);
    });
  });
});
