import { ApiClient } from "@/core/client";
import { FLUTTERWAVE_BASE_URL, type FlutterwaveConfig } from "@/core/config";
import { FlutterwaveError } from "@/errors/flutterwave-error";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock AbortController
const mockAbort = vi.fn();
class MockAbortController {
	signal = {
		aborted: false,
		reason: undefined,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
		onabort: null,
	};
	abort = mockAbort;
}
global.AbortController = MockAbortController as any;

describe("Api Client", () => {
	const mockConfig: FlutterwaveConfig = {
		secretKey: "test_secret_key",
		timeout: 1000, // 1 second for easier testing
	};
	let apiClient: ApiClient;

	beforeEach(() => {
		vi.clearAllMocks(); // Clears mock call history and implementations
		apiClient = new ApiClient(mockConfig);
		// Reset AbortController mock parts if necessary for specific tests
		(global.AbortController as any).prototype.signal = {
			aborted: false,
			reason: undefined,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
			onabort: null,
		};
		(global.AbortController as any).prototype.abort = mockAbort;
	});

	afterEach(() => {
		vi.useRealTimers(); // Ensure real timers are restored after tests that use fake timers
	});

	describe("constructor", () => {
		it("should throw an error if secretKey is not provided", () => {
			expect(() => new ApiClient({} as FlutterwaveConfig)).toThrow(
				"Flutterwave secret key is required.",
			);
		});

		it("should initialize with default timeout if not provided", () => {
			const clientWithDefaultTimeout = new ApiClient({
				secretKey: "test_secret",
			});
			expect((clientWithDefaultTimeout as any).timeout).toBe(60000);
		});

		it("should create an instance with a valid config", () => {
			const client = new ApiClient({ secretKey: "test_key", timeout: 3000 });
			expect(client).toBeInstanceOf(ApiClient);
			expect((client as any).timeout).toBe(3000);
		});

		it("should initialize with provided config", () => {
			expect((apiClient as any).secretKey).toBe(mockConfig.secretKey);
			expect((apiClient as any).baseUrl).toBe(FLUTTERWAVE_BASE_URL);
			expect((apiClient as any).timeout).toBe(mockConfig.timeout);
		});
	});

	describe("GET requests", () => {
		it("should make a successful get request", async () => {
			const mockResponse = { id: 1, name: "Get tste" };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await apiClient.get("test-endpoint");

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/test-endpoint`,
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({
						Authorization: "Bearer test_secret_key",
						"Content-Type": "application/json",
						Accept: "application/json",
					}),
				}),
			);

			expect(result).toEqual(mockResponse);
		});

		it("should append query params to GET requests", async () => {
			const mockResponse = { data: [] };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			await apiClient.get("banks/NG", { page: 1, limit: 10 });

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/banks/NG?page=1&limit=10`,
				expect.any(Object),
			);
		});

		it("should handle query parameters with null/undefined values", async () => {
			const mockResponse = { data: [] };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			await apiClient.get("test", {
				param1: "value",
				param2: null,
				param3: undefined,
			});

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/test?param1=value`,
				expect.any(Object),
			);
		});
	});

	describe("POST requests", () => {
		it("should make successful POST request", async () => {
			const mockResponse = { data: { id: 1, status: "created" } };
			const payload = { name: "Test", email: "test@example.com" };

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await apiClient.post("payments", payload);

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/payments`,
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(payload),
					headers: expect.objectContaining({
						Authorization: "Bearer test_secret_key",
						"Content-Type": "application/json",
					}),
				}),
			);
			expect(result).toEqual(mockResponse.data);
		});
	});

	describe("PUT requests", () => {
		it("should make a successful PUT  request", async () => {
			const mockResponse = { data: { id: 1, status: "updated" } };
			const payload = { status: "active" };

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await apiClient.put("users/1", payload);

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/users/1`,
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify(payload),
				}),
			);
			expect(result).toEqual(mockResponse.data);
		});
	});

	describe("DELETE requests", () => {
		it("should make successful DELETE request", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
			});

			const result = await apiClient.delete("users/1");

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/users/1`,
				expect.objectContaining({
					method: "DELETE",
				}),
			);
			expect(result).toEqual({});
		});

		it("should append query parameters for DELETE request", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
			});

			await apiClient.delete("users/1", { force: true });

			expect(mockFetch).toHaveBeenCalledWith(
				`${FLUTTERWAVE_BASE_URL}/users/1?force=true`,
				expect.any(Object),
			);
		});
	});
});
