import type { Profile } from "@/types/app";
import type { ResponseDirect, ResponseDirectAuthId } from "@/types/responses";

import { InstagramService } from "@/services/instagram.service";

import { mockMe } from "@tests/__mocks__/me.mock";
import { mockProfile } from "@tests/__mocks__/profile.mock";

describe("instagram.service", () => {
  describe("getAuthId", () => {
    it("should return auth id data when fetch succeeds", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMe),
      } as unknown as globalThis.Response);

      const result: ResponseDirect<ResponseDirectAuthId> =
        await InstagramService.getAuthId("valid_token");

      expect(result).toEqual(mockMe);
    });

    it("should throw with the HTTP status when response is not ok", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      } as globalThis.Response);

      await expect(InstagramService.getAuthId("bad_token")).rejects.toThrow(
        "HTTP error! status: 401"
      );
    });

    it("should throw when fetch rejects", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network failure"));

      await expect(InstagramService.getAuthId("token")).rejects.toThrow("Network failure");
    });

    it("should call fetch with the access token in the URL", async () => {
      const mockFetch: jest.SpyInstance = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMe),
      } as unknown as globalThis.Response);

      await InstagramService.getAuthId("my_token");

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("access_token=my_token"));
    });
  });

  describe("getProfile", () => {
    it("should return profile data when fetch succeeds", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProfile),
      } as unknown as globalThis.Response);

      const result: ResponseDirect<Profile> = await InstagramService.getProfile(
        "valid_token",
        "12345"
      );

      expect(result).toEqual(mockProfile);
    });

    it("should throw with the HTTP status when response is not ok", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      } as globalThis.Response);

      await expect(InstagramService.getProfile("token", "12345")).rejects.toThrow(
        "HTTP error! status: 500"
      );
    });

    it("should throw when fetch rejects", async () => {
      jest.spyOn(global, "fetch").mockRejectedValue(new Error("Connection refused"));

      await expect(InstagramService.getProfile("token", "12345")).rejects.toThrow(
        "Connection refused"
      );
    });

    it("should call fetch with the user ID and access token in the URL", async () => {
      const mockFetch: jest.SpyInstance = jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProfile),
      } as unknown as globalThis.Response);

      await InstagramService.getProfile("my_token", "user_99");

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("user_99"));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("access_token=my_token"));
    });
  });
});
