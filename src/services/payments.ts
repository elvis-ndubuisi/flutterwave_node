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
	// async initiate(payload: PaymentInitPayload) {
	// 	return this.apiClient.post<PaymentInitResponse>("payments", payload);
	// }

	// async verify() {}
}
