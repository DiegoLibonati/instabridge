import { requireEnv } from "@/helpers/require_env.helper";

describe("require_env.helper", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  describe("requireEnv", () => {
    it("should return the value when the variable is set", () => {
      process.env.TEST_VAR = "hello";

      const result: string = requireEnv("TEST_VAR");

      expect(result).toBe("hello");
    });

    it("should throw with the variable name when the variable is not set", () => {
      delete process.env.MISSING_VAR;

      expect(() => requireEnv("MISSING_VAR")).toThrow(
        "Missing required environment variable: MISSING_VAR"
      );
    });

    it("should throw when the variable is an empty string", () => {
      process.env.EMPTY_VAR = "";

      expect(() => requireEnv("EMPTY_VAR")).toThrow();
    });

    it("should return the value for variables with whitespace", () => {
      process.env.SPACED_VAR = "  value  ";

      const result: string = requireEnv("SPACED_VAR");

      expect(result).toBe("  value  ");
    });
  });
});
