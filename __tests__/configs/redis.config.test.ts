interface FakeClient {
  on: jest.Mock;
}

interface FakeRedisModule {
  createClient: jest.Mock;
}

interface MockLogger {
  info: jest.Mock;
  warn: jest.Mock;
}

const mockLogger: MockLogger = { info: jest.fn(), warn: jest.fn() };

jest.mock("@/configs/logger.config", () => ({ logger: mockLogger }));

const loadConfig = (fakeClient: FakeClient): { module: FakeRedisModule; exported: unknown } => {
  let module: FakeRedisModule = { createClient: jest.fn() };
  let exported: unknown;

  jest.isolateModules((): void => {
    jest.doMock("redis", () => {
      const createClient: jest.Mock = jest.fn().mockReturnValue(fakeClient);
      module = { createClient };
      return { createClient };
    });

    const mod: { default: unknown } = jest.requireActual("@/configs/redis.config");
    exported = mod.default;
  });

  return { module, exported };
};

const getHandler = (fakeClient: FakeClient, event: string): ((error?: Error) => void) => {
  const call = fakeClient.on.mock.calls.find((args) => args[0] === event);

  return call![1] as (error?: Error) => void;
};

describe("redis.config", () => {
  beforeEach((): void => {
    mockLogger.info.mockReset();
    mockLogger.warn.mockReset();
  });

  it("should create the redis client with the URL built from REDIS_HOST and REDIS_PORT", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    const { module } = loadConfig(fakeClient);

    expect(module.createClient).toHaveBeenCalledWith({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
  });

  it("should register an error listener and a ready listener on the redis client", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    expect(fakeClient.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(fakeClient.on).toHaveBeenCalledWith("ready", expect.any(Function));
  });

  it("should log a warn with the error, host and port when the redis client emits an error", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    const error: Error = new Error("boom");
    getHandler(fakeClient, "error")(error);

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      { err: error, host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
      expect.stringContaining("Redis connection error")
    );
  });

  it("should log the connection error only once while the connection stays down", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    const onError: (error?: Error) => void = getHandler(fakeClient, "error");
    onError(new Error("boom"));
    onError(new Error("boom again"));
    onError(new Error("and again"));

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
  });

  it("should log an info when the connection is restored after an error", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    getHandler(fakeClient, "error")(new Error("boom"));
    getHandler(fakeClient, "ready")();

    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith(
      { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
      "Redis connection restored."
    );
  });

  it("should not log an info on ready when no error was logged before", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    getHandler(fakeClient, "ready")();

    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it("should warn again on the next outage after the connection was restored", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    const onError: (error?: Error) => void = getHandler(fakeClient, "error");
    onError(new Error("boom"));
    getHandler(fakeClient, "ready")();
    onError(new Error("boom again"));

    expect(mockLogger.warn).toHaveBeenCalledTimes(2);
  });

  it("should expose the redis client as the default export", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    const { exported } = loadConfig(fakeClient);

    expect(exported).toBe(fakeClient);
  });
});
