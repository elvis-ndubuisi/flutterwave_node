import type { Currency } from "./common";

export interface PaymentInitPayload {
	tx_ref: string; // Unique transaction reference
	amount: string | number;
	currency: Currency; // e.g., "NGN", "USD"
	redirect_url: string;
	payment_options?: string; // e.g., "card,ussd,banktransfer"
	customer: {
		email: string;
		phonenumber?: string;
		name?: string;
	};
	customizations?: {
		title?: string;
		description?: string;
		logo?: string; // URL to your logo
	};
	meta?: Record<string, unknown>; // Any additional data you want to pass
	subaccounts?: Array<{
		// For split payments
		id: string;
		transaction_split_ratio?: number;
		transaction_charge_type?: string;
		transaction_charge?: number;
	}>;
}

export interface PaymentInitResponse {
	link: string; // The payment link to redirect the user to
}
