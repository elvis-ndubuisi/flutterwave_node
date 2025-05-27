import type { ApiClient } from "@/core/client";
import type {
	ChargeCardPayload,
	ChargeCardResponse,
} from "@/definitions/charges";

export class Charge {
	private client: ApiClient;

	constructor(apiClient: ApiClient) {
		this.client = apiClient;
	}

	/**
	 * Collect card payments with Flutterwave.
	 * We recommend you read the {@link https://developer.flutterwave.com/docs/direct-card-charge} method overview before you proceed.
	 */
	async card(payload: ChargeCardPayload): Promise<ChargeCardResponse> {
		return this.client.post(
			"charges?type=card",
			payload as unknown as Record<string, unknown>,
		);
	}

	/**
	 * Generate Flutterwave checkout to receive payments from customers.
	 * Learn more about our {@link https://developer.flutterwave.com/docs/flutterwave-standard-1}
	 */
	async standard() {}

	/**
	 * Generate dynamic virtual accounts for instant payments via bank transfers.
	 * We recommend you read the {@link https://developer.flutterwave.com/docs/bank-transfer-1} method overview before you proceed.
	 */
	async bankTransfer() {}
}
