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

  it("should coerce PORT to a number", () => {
    expect(envs.PORT).toBe(5050);
    expect(typeof envs.PORT).toBe("number");
  });

  it("should expose API_VERSION as a string", () => {
    expect(envs.API_VERSION).toBe("0.0.1");
  });

  it("should default ENV to test when NODE_ENV is test", () => {
    expect(envs.ENV).toBe("test");
  });

  it("should default LOG_LEVEL from env (silent in tests)", () => {
    expect(envs.LOG_LEVEL).toBe("silent");
  });

  it("should default RATE_LIMIT_MAX to 0 when not provided", () => {
    expect(envs.RATE_LIMIT_MAX).toBe(0);
  });

  it("should default RATE_LIMIT_WINDOW_MS to 15 minutes when not provided", () => {
    expect(envs.RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000);
  });

  it("should default BODY_LIMIT to 1gb when not provided", () => {
    expect(envs.BODY_LIMIT).toBe("1gb");
  });

  it("should default SEED_DEFAULT_DATA to false when not provided", () => {
    expect(envs.SEED_DEFAULT_DATA).toBe(false);
  });

  it("should default BASE_URL to empty string when not provided", () => {
    expect(envs.BASE_URL).toBe("");
  });

  it("should export a correctly shaped Envs object", () => {
    const keys: (keyof Envs)[] = [
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
      "LOG_LEVEL",
      "RATE_LIMIT_WINDOW_MS",
      "RATE_LIMIT_MAX",
      "BODY_LIMIT",
      "SEED_DEFAULT_DATA",
    ];

    for (const key of keys) {
      expect(envs).toHaveProperty(key);
    }
  });

  it("should throw when a required variable is missing at load time", () => {
    const originalInstagramApi: string = process.env.INSTAGRAM_API ?? "";
    delete process.env.INSTAGRAM_API;

    jest.isolateModules((): void => {
      expect(() => {
        jest.requireActual<{ envs: Envs }>("@/configs/env.config");
      }).toThrow(/Invalid environment variables/);
    });

    process.env.INSTAGRAM_API = originalInstagramApi;
  });

  it("should throw when a required variable is an empty string", () => {
    const originalRedisHost: string = process.env.REDIS_HOST ?? "";
    process.env.REDIS_HOST = "";

    jest.isolateModules((): void => {
      expect(() => {
        jest.requireActual<{ envs: Envs }>("@/configs/env.config");
      }).toThrow(/REDIS_HOST/);
    });

    process.env.REDIS_HOST = originalRedisHost;
  });
});
