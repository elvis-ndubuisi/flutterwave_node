import type { ApiClient } from "@/core/client";
import type { GenerateOtpPayload, GenerateOtpResult } from "@/definitions/opt";

export class OTPServices {
	private client: ApiClient;

	constructor(apiClient: ApiClient) {
		this.client = apiClient;
	}

	/**
	 * Create OTP strings of varying lengths.
	 */
	async generate(payload: GenerateOtpPayload): Promise<GenerateOtpResult> {
		return this.client.post("otps", payload as unknown as Record<string, unknown>);
	}

	/**
	 * Validate an OTP
	 * @param otp The one time password sent to the customer.
	 */
	async validate(payload: { otp: string }) {
		return this.client.post(`otps/${crypto.randomUUID()}/validate`, payload);
	}
}
