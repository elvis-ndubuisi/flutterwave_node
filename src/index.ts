import { ApiClient } from "./core/client";
import type { FlutterwaveConfig } from "./core/config";
import { BanksService } from "./services/banks";
import { ChargeService } from "./services/charge";
import { OTPServices } from "./services/otp";
import { PaymentService } from "./services/payments";

export class Flutterwave {
	private apiClient: ApiClient;

	public banks: BanksService;
	public payments: PaymentService;
	public otp: OTPServices;
	public charges: ChargeService;

	constructor(config: FlutterwaveConfig) {
		if (!config || !config.secretKey) {
			throw new Error("Flutterwave configuration with secretKey is required.");
		}

		this.apiClient = new ApiClient(config);

		// Initialize services
		this.banks = new BanksService(this.apiClient);
		this.payments = new PaymentService(this.apiClient);
		this.otp = new OTPServices(this.apiClient);
		this.charges = new ChargeService(this.apiClient);
	}

	async ping(): Promise<{ status: string; message: string }> {
		try {
			// A simple way to check connectivity, e.g., get banks for a common country
			await this.banks.list("NG");
			return {
				status: "success",
				message: "Flutterwave API connection successful.",
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			return {
				status: "error",
				message: `Flutterwave API connection failed: ${message}`,
			};
		}
	}
}

// Export definitions
export type { FlutterwaveConfig };
export * from "./definitions/banks";
export * from "./definitions/common";
export * from "./definitions/payments";
export * from "./definitions/opt";
export * from "./errors/flutterwave-error";
export * from "./definitions/charges";
// Exorts flutter as default or named (for CJS/ESM compatibility if needed)
export default Flutterwave;
