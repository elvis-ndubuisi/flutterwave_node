import type {
	FlutterwaveErrorResponse,
	FlutterwaveResponse,
} from "@/definitions/common";
import { FlutterwaveError } from "@/errors/flutterwave-error";
import { FLUTTERWAVE_BASE_URL, type FlutterwaveConfig } from "./config";

export class ApiClient {
	private secretKey: string;
	private baseUrl: string;
	private timeout: number;

	constructor(config: FlutterwaveConfig) {
		if (!config.secretKey) {
			throw new Error("Flutterwave secret key is required.");
		}
		this.secretKey = config.secretKey;
		this.baseUrl = FLUTTERWAVE_BASE_URL;
		this.timeout = config.timeout || 60000; // 60 seconds
	}

	private async request<T>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		endpoint: string,
		payload?: Record<string, unknown>,
	): Promise<T> {
		let url = `${this.baseUrl}/${endpoint}`;
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.secretKey}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		};

		const options: RequestInit = {
			method,
			headers,
		};

		if (payload) {
			if (method === "PUT" || method === "POST") {
				options.body = JSON.stringify(payload);
			} else if (method === "GET" || method === "DELETE") {
				// For GET/DELETE requests, append params to URL
				const queryParams = new URLSearchParams(
					// Ensure payload values are strings or numbers for URLSearchParams
					Object.entries(payload).reduce(
						(acc, [key, value]) => {
							if (value !== undefined && value !== null) {
								acc[key] = String(value);
							}
							return acc;
						},
						{} as Record<string, string>,
					),
				).toString();

				if (queryParams) {
					url = `${url}?${queryParams}`;
				}
			}
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);
		options.signal = controller.signal;

		try {
			const response: Response = await fetch(url, options);
			clearTimeout(timeoutId); // Clear timeout if the request completes

			if (!response.ok) {
				let errorData: FlutterwaveErrorResponse | string;
				try {
					// Attempt to parse as JSON, Flutterwave usually sends JSON errors
					errorData = await response.json();
				} catch (e) {
					// Fallback to text if JSON parsing fails or if the response wasn't JSON
					errorData = await response.text();
				}

				const message =
					typeof errorData === "string"
						? errorData || `API request failed with status ${response.status}`
						: (errorData as FlutterwaveErrorResponse).message ||
							`API request failed with status ${response.status}`;
				const code =
					typeof errorData !== "string"
						? (errorData as FlutterwaveErrorResponse).code
						: undefined;
				const data =
					typeof errorData !== "string"
						? (errorData as FlutterwaveErrorResponse).data
						: undefined;

				throw new FlutterwaveError(
					message,
					String(response.status),
					code,
					data,
				);
			}

			// Handle cases where Flutterwave might return 200 OK but with an error status in the body
			// Or successful responses that might not always have a 'data' field directly (e.g. delete operations returning 204 with no content or different structure)
			if (response.status === 204) {
				// Handle No Content responses
				return {} as T; // Or an appropriate empty success object/value
			}

			const responseData = await response.json(); // Expect FlutterwaveResponse<T> or FlutterwaveErrorResponse

			if (responseData.status && responseData.status === "error") {
				const typedErrorData = responseData as FlutterwaveErrorResponse;
				throw new FlutterwaveError(
					typedErrorData.message,
					"API Error",
					typedErrorData.code,
					typedErrorData.data,
				);
			}

			// If the response is expected to be FlutterwaveResponse<T>, return data
			// If it's a direct data object, return as is (adapt as per actual API responses)
			return (responseData as FlutterwaveResponse<T>).data !== undefined
				? (responseData as FlutterwaveResponse<T>).data
				: (responseData as T);
		} catch (error) {
			clearTimeout(timeoutId); // Ensure timeout is cleared on any error
			if (error instanceof FlutterwaveError) {
				throw error;
			}
			if (error instanceof Error && error.name === "AbortError") {
				throw new FlutterwaveError(
					`Request timed out after ${this.timeout}ms`,
					"TimeoutError",
				);
			}
			// Handle other network errors or unexpected issues
			throw new FlutterwaveError(
				error instanceof Error
					? error.message
					: "An unexpected network error occurred",
				"NetworkError",
			);
		}
	}

	public get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		return this.request<T>("GET", endpoint, params);
	}

	public post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
		return this.request<T>("POST", endpoint, data);
	}

	public put<T>(endpoint: string, data: Record<string, any>): Promise<T> {
		return this.request<T>("PUT", endpoint, data);
	}

	public delete<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
		return this.request<T>("DELETE", endpoint, data);
	}
}
