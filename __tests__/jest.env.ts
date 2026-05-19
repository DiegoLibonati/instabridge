import { mockEnvs } from "@tests/__mocks__/envs.mock";

process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.PORT = mockEnvs.PORT;
process.env.API_VERSION = mockEnvs.API_VERSION;
process.env.INSTAGRAM_API = mockEnvs.INSTAGRAM_API;
process.env.INSTAGRAM_API_VERSION = mockEnvs.INSTAGRAM_API_VERSION;
process.env.INSTAGRAM_SECRET_CLIENT = mockEnvs.INSTAGRAM_SECRET_CLIENT;
process.env.INSTAGRAM_USER_ACCESS_TOKEN = mockEnvs.INSTAGRAM_USER_ACCESS_TOKEN;
process.env.REDIS_HOST = mockEnvs.REDIS_HOST;
process.env.REDIS_PORT = mockEnvs.REDIS_PORT;
