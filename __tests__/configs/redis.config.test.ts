interface FakeClient {
  on: jest.Mock;
}

interface FakeRedisModule {
  createClient: jest.Mock;
}

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

describe("redis.config", () => {
  it("should create the redis client with the URL built from REDIS_HOST and REDIS_PORT", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    const { module } = loadConfig(fakeClient);

    expect(module.createClient).toHaveBeenCalledWith({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
  });

  it("should register an error listener on the redis client", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    loadConfig(fakeClient);

    expect(fakeClient.on).toHaveBeenCalledWith("error", expect.any(Function));
  });

  it("should log the error when the redis client emits an error", () => {
    const fakeClient: FakeClient = { on: jest.fn() };
    const spyError: jest.SpyInstance = jest.spyOn(console, "error").mockImplementation((): void => {
      // suppress
    });

    loadConfig(fakeClient);

    const handler: (err: Error) => void = fakeClient.on.mock.calls[0][1] as (err: Error) => void;
    const error: Error = new Error("boom");
    handler(error);

    expect(spyError).toHaveBeenCalledWith("Redis connection error:", error);
  });

  it("should expose the redis client as the default export", () => {
    const fakeClient: FakeClient = { on: jest.fn() };

    const { exported } = loadConfig(fakeClient);

    expect(exported).toBe(fakeClient);
  });
});
