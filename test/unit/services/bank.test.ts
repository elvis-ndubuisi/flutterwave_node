import { ApiClient } from "@/core/client";
import { BanksService } from "@/services/banks";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mocked("../../src/core/client.ts");

describe("Bank service", () => {
	let banksService: BanksService;
	let mockApiClient: any;

	beforeEach(() => {
		mockApiClient = {
			get: vi.fn(),
		};
		banksService = new BanksService(mockApiClient);
	});

	describe("list", () => {
		it("should fetch banks for a specific country", async () => {
			const mockBanks = [
				{ id: 1, code: "044", name: "Access Bank" },
				{ id: 2, code: "023", name: "Citibank Nigeria" },
			];

			mockApiClient.get.mockResolvedValueOnce(mockBanks);

			const result = await banksService.list("NG");

			expect(mockApiClient.get).toHaveBeenCalledWith("banks/NG");
			expect(result).toEqual(mockBanks);
		});

		it("should handle different country codes", async () => {
			const mockBanks = [{ id: 3, code: "GCB", name: "GCB Bank Limited" }];

			mockApiClient.get.mockResolvedValueOnce(mockBanks);

			await banksService.list("GH");

			expect(mockApiClient.get).toHaveBeenCalledWith("banks/GH");
		});

		it("should propagate API client errors", async () => {
			const error = new Error("API Error");
			mockApiClient.get.mockRejectedValueOnce(error);

			await expect(banksService.list("NG")).rejects.toThrow("API Error");
		});
	});

	describe("branches", () => {
		it("should fetch branches for a bank using string ID", async () => {
			const mockBranches = [
				{ id: 1, branch_code: "001", branch_name: "Head Office" },
				{ id: 2, branch_code: "002", branch_name: "Victoria Island" },
			];

			mockApiClient.get.mockResolvedValueOnce(mockBranches);

			const result = await banksService.branches("ACCESS_BANK");

			expect(mockApiClient.get).toHaveBeenCalledWith(
				"banks/ACCESS_BANK/branches",
			);
			expect(result).toEqual(mockBranches);
		});

		it("should fetch branches for a bank using numeric ID", async () => {
			const mockBranches = [
				{ id: 1, branch_code: "001", branch_name: "Main Branch" },
			];

			mockApiClient.get.mockResolvedValueOnce(mockBranches);

			const result = await banksService.branches(123);

			expect(mockApiClient.get).toHaveBeenCalledWith("banks/123/branches");
			expect(result).toEqual(mockBranches);
		});

		it("should propagate API client errors", async () => {
			const error = new Error("Bank not found");
			mockApiClient.get.mockRejectedValueOnce(error);

			await expect(banksService.branches("INVALID_BANK")).rejects.toThrow(
				"Bank not found",
			);
		});
	});
});
