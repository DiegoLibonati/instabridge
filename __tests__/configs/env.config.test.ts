import type { Envs } from "@/types/env";

import { envs } from "@/configs/env.config";

describe("env.config", () => {
  it("should export INSTAGRAM_API from environment", () => {
    expect(envs.INSTAGRAM_API).toBe("https://graph.instagram.com");
  });

  it("should export INSTAGRAM_API_VERSION from environment", () => {
    expect(envs.INSTAGRAM_API_VERSION).toBe("v19.0");
  });

  it("should export INSTAGRAM_SECRET_CLIENT from environment", () => {
    expect(envs.INSTAGRAM_SECRET_CLIENT).toBe("YOUR_SECRET_CLIENT");
  });

  it("should export INSTAGRAM_USER_ACCESS_TOKEN from environment", () => {
    expect(envs.INSTAGRAM_USER_ACCESS_TOKEN).toBe("YOUR_ACCESS_TOKEN");
  });

  it("should export REDIS_HOST from environment", () => {
    expect(envs.REDIS_HOST).toBe("redis-test-db");
  });

  it("should export REDIS_PORT from environment", () => {
    expect(envs.REDIS_PORT).toBe("6379");
  });

  it("should default PORT to 5050 when env provides 5050", () => {
    expect(envs.PORT).toBe(5050);
  });

  it("should default API_VERSION to 0.0.1 when env provides 0.0.1", () => {
    expect(envs.API_VERSION).toBe("0.0.1");
  });

  it("should export a correctly shaped Envs object", () => {
    const keys = [
      "PORT",
      "API_VERSION",
      "ENV",
      "BASE_URL",
      "INSTAGRAM_API",
      "INSTAGRAM_API_VERSION",
      "INSTAGRAM_SECRET_CLIENT",
      "INSTAGRAM_USER_ACCESS_TOKEN",
      "REDIS_HOST",
      "REDIS_PORT",
    ];

    for (const key of keys) {
      expect(envs).toHaveProperty(key);
    }
  });

  it("should throw when a required variable is missing at load time", () => {
    const originalInstagramApi: string = process.env.INSTAGRAM_API ?? "";
    delete process.env.INSTAGRAM_API;

    jest.isolateModules(() => {
      expect(() => {
        jest.requireActual<{ envs: Envs }>("@/configs/env.config");
      }).toThrow("Missing required environment variable: INSTAGRAM_API");
    });

    process.env.INSTAGRAM_API = originalInstagramApi;
  });
});
