import { describe, expect, test } from "vitest";
import { env } from "cloudflare:workers";
import app from "../src/index";

describe("App", () => {
  test("should be return a 200 status code", async () => {
    const res = await app.request("/hello/everyone", {}, env);

    expect(res.status).toBe(200);
  });
});
