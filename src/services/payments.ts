import type { ApiClient } from "@/core/client";
import type {
	PaymentInitPayload,
	PaymentInitResponse,
} from "@/definitions/payments";

export class PaymentService {
	private apiClient: ApiClient;

	constructor(client: ApiClient) {
		this.apiClient = client;
	}

	/**
	 * Generate Flutterwave checkout to receive payments from customers (Standard payment)
	 * @param payload Payment details
	 */
	async initiate(payload: PaymentInitPayload) {
		return this.apiClient.post<PaymentInitResponse>(
			"payments",
			payload as unknown as Record<string, unknown>,
		);
	}

	/**
	 * Verify a transaction.
	 * @param transactionId The transaction ID returned by Flutterwave after a transaction.
	 */
	// NOTE: add verification
	// async verify(transactionId:string): Promise<Pa> {}
}
