import type { Currency } from "./common";

interface Authorization {
	mode: string;
	pin: number;
	city: string;
	address: string;
	state: string;
	country: string;
	zipcode: number;
}

interface Meta {
	flightID: string;
	sideNote: string;
}

export interface ChargeCardPayload {
	amount: number;
	currency: Currency;
	card_number: string;
	cvv: string;
	expiry_month: number;
	expiry_year: number;
	email: string;
	tx_ref: string;
	authorization?: Authorization;
	preauthorize?: boolean;
	fullname?: string;
	card_holder_name?: string; // Only requred or charges on AMEX cards.
	phone_number: string;
	payment_plan: string;
	redirect_url: string;
	meta?: Meta;
	device_fingerprint?: string;
	client_ip?: string;
	eci?: string;
	a_authenticationtoken: string;
	a_amount?: string;
	a_version?: string;
	a_transactionid?: string;
	a_transactionstatus?: string;
	a_statusreasoncode: string;
	is_custom_3ds_enabled: boolean;
	a_time?: string;
}

interface Customer {
	id: number;
	phone_number: null;
	name: string;
	email: string;
	created_at: string;
}
interface Card {
	first_6digits: string;
	last_4digits: string;
	issuer: string;
	country: string;
	type: string;
	expiry: string;
}
interface Authorization {
	mode: string;
	endpoint: string;
}

export interface ChargeCardResponse {
	// status: string;
	// message: string;
	data: {
		id: number;
		tx_ref: string;
		flw_ref: string;
		device_fingerprint: string;
		amount: number;
		charged_amount: number;
		app_fee: number;
		merchant_fee: number;
		processor_response: string;
		auth_model: string;
		currency: string;
		ip: string;
		narration: string;
		status: string;
		auth_url: string;
		payment_type: string;
		fraud_status: string;
		charge_type: string;
		created_at: string;
		account_id: number;
		customer: Customer;
		card: Card;
	};
	meta: {
		authorization: Authorization;
	};
}
