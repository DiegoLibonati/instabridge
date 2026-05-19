import { logger } from "@/configs/logger.config";
import { envs } from "@/configs/env.config";

describe("logger.config", () => {
  it("should export a pino logger instance", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.fatal).toBe("function");
    expect(typeof logger.trace).toBe("function");
  });

  it("should configure the logger with the LOG_LEVEL from envs", () => {
    expect(logger.level).toBe(envs.LOG_LEVEL);
  });

  it("should support child loggers", () => {
    const child = logger.child({ scope: "test" });

    expect(child).toBeDefined();
    expect(typeof child.info).toBe("function");
  });
});
