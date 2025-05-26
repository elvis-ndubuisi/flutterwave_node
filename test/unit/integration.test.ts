import { ApiClient } from "@/core/client";
import { BanksService } from "@/services/banks";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Integration Tests", () => {
	let apiClient: ApiClient;
	let banksService: BanksService;

	beforeEach(() => {
		vi.clearAllMocks();
		apiClient = new ApiClient({
			secretKey: "flw_sk_test_integration_key",
			timeout: 30000,
		});
		banksService = new BanksService(apiClient);
	});

	describe("Banks Service Integration", () => {
		it("should integrate ApiClient with BanksService for listing banks", async () => {
			const mockResponse = {
				status: "success",
				message: "Banks retrieved successfully",
				data: [
					{
						id: 1,
						code: "044",
						name: "Access Bank",
					},
					{
						id: 2,
						code: "023",
						name: "Citibank Nigeria",
					},
				],
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const banks = await banksService.list("NG");

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.flutterwave.com/v3/banks/NG",
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({
						Authorization: "Bearer flw_sk_test_integration_key",
					}),
				}),
			);

			expect(banks).toEqual(mockResponse.data);
			expect(banks).toHaveLength(2);
			expect(banks[0]).toHaveProperty("code", "044");
		});

		it("should integrate ApiClient with BanksService for bank branches", async () => {
			const mockResponse = {
				status: "success",
				message: "Bank branches retrieved successfully",
				data: [
					{
						id: 1,
						branch_code: "001",
						branch_name: "Head Office Lagos",
					},
				],
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const branches = await banksService.branches(44);

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.flutterwave.com/v3/banks/44/branches",
				expect.objectContaining({
					method: "GET",
				}),
			);

			expect(branches).toEqual(mockResponse.data);
			expect(branches).toHaveLength(1);
			expect(branches[0]).toHaveProperty("branch_code", "001");
		});
	});

	describe("Error Handling Integration", () => {
		it("should handle API errors end-to-end", async () => {
			const errorResponse = {
				status: "error",
				message: "Invalid country code",
				code: "INVALID_COUNTRY",
				data: null,
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				json: () => Promise.resolve(errorResponse),
			});

			await expect(banksService.list("INVALID")).rejects.toThrow(
				"Invalid country code",
			);
		});
	});
});
