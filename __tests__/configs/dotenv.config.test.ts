import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getEnvFileCandidates, loadEnvFiles } from "@/configs/dotenv.config";

const ORIGINAL_ENV: NodeJS.ProcessEnv = process.env;

let tempDir: string;

const writeEnvFile = (file: string, content: string): void => {
  writeFileSync(join(tempDir, file), content);
};

describe("dotenv.config", () => {
  beforeEach((): void => {
    process.env = { ...ORIGINAL_ENV };
    tempDir = mkdtempSync(join(tmpdir(), "dotenv-config-"));
    jest.spyOn(process, "cwd").mockReturnValue(tempDir);
  });

  afterEach((): void => {
    jest.restoreAllMocks();
    process.env = ORIGINAL_ENV;
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("getEnvFileCandidates", () => {
    it("should return the four candidates in precedence order for development", () => {
      const candidates: string[] = getEnvFileCandidates("development");

      expect(candidates).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
    });

    it("should return the four candidates in precedence order for production", () => {
      const candidates: string[] = getEnvFileCandidates("production");

      expect(candidates).toEqual([
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env",
      ]);
    });

    it("should return only the two test candidates for test", () => {
      const candidates: string[] = getEnvFileCandidates("test");

      expect(candidates).toEqual([".env.test.local", ".env.test"]);
    });
  });

  describe("loadEnvFiles", () => {
    it("should return an empty list when no env files exist", () => {
      process.env.NODE_ENV = "development";

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([]);
    });

    it("should load variables from .env", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env");
    });

    it("should not override variables already present in process.env", () => {
      process.env.NODE_ENV = "development";
      process.env.DOTENV_TEST_KEY = "from-process";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-file\n");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("from-process");
    });

    it("should prefer .env.local over .env", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env\n");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-env-local\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.local", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-local");
    });

    it("should prefer the mode file over .env", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env\n");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-env-development\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.development", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-development");
    });

    it("should prefer .env.local over the mode file", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-env-development\n");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-env-local\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.local", ".env.development"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-local");
    });

    it("should prefer the local mode file over every other file", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env\n");
      writeEnvFile(".env.local", "DOTENV_TEST_KEY=from-env-local\n");
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-env-development\n");
      writeEnvFile(".env.development.local", "DOTENV_TEST_KEY=from-env-development-local\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.development.local", ".env.local", ".env.development", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-development-local");
    });

    it("should prefer the process NODE_ENV over the one declared in files", () => {
      process.env.NODE_ENV = "production";
      writeEnvFile(".env", "NODE_ENV=development\nDOTENV_TEST_KEY=from-env\n");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-env-production\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.production", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-production");
      expect(process.env.NODE_ENV).toBe("production");
    });

    it("should resolve NODE_ENV from .env when the process does not define it", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env", "NODE_ENV=production\n");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-env-production\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.production", ".env"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-production");
      expect(process.env.NODE_ENV).toBe("production");
    });

    it("should prefer the NODE_ENV declared in .env.local over the one in .env", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env", "NODE_ENV=development\n");
      writeEnvFile(".env.local", "NODE_ENV=production\n");
      writeEnvFile(".env.production", "DOTENV_TEST_KEY=from-env-production\n");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-production");
      expect(process.env.NODE_ENV).toBe("production");
    });

    it("should default to development when NODE_ENV is not defined anywhere", () => {
      delete process.env.NODE_ENV;
      writeEnvFile(".env.development", "DOTENV_TEST_KEY=from-env-development\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.development"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-development");
    });

    it("should ignore .env and .env.local when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env", "DOTENV_TEST_KEY=from-env\n");
      writeEnvFile(".env.local", "DOTENV_OTHER_KEY=from-env-local\n");
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=from-env-test\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-test");
      expect(process.env.DOTENV_OTHER_KEY).toBeUndefined();
    });

    it("should prefer .env.test.local over .env.test when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env.test", "DOTENV_TEST_KEY=from-env-test\n");
      writeEnvFile(".env.test.local", "DOTENV_TEST_KEY=from-env-test-local\n");

      const loaded: string[] = loadEnvFiles();

      expect(loaded).toEqual([".env.test.local", ".env.test"]);
      expect(process.env.DOTENV_TEST_KEY).toBe("from-env-test-local");
    });
  });
});
