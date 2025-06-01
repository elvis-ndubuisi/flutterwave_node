import type { Country, Currency } from "./common";

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

type Charge = {
	amount: number;
	currency: Currency;
	tx_ref: string;
	fullname?: string;
	client_ip?: string;
	redirect_url: string;
	device_fingerprint?: string;
	phone_number?: string;
};

export interface ChargeCardPaylood extends Omit<Charge, "phone_number"> {
	card_number: string;
	cvv: number;
	expiry_month: number;
	expire_year: number;
	email: string;
	authorization?: Authorization;
	preauthorize?: boolean;
	card_holder_name?: string;
	payment_plan?: string;
	meta: Meta;
	eci?: string;
	a_authenticationtoken: string;
	a_amount?: string;
	a_version?: string;
	a_transactionid?: string;
	a_transactionstatus?: string;
	a_statusreasoncode: string;
	is_custom_3ds_enabled: boolean;
	a_time?: Date;
}

export interface ChargeCardResponse {
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
		customer: {
			id: number;
			phone_number: null;
			name: string;
			email: string;
			created_at: string;
		};
		card: {
			last_4digits: string;
			issuer: string;
			country: string;
			type: string;
			expiry: string;
		};
	};
	meta: {
		authorization: {
			mode: string;
			endpoint: string;
		};
	};
}

export interface ChargeBankTransferPaylod extends Omit<Charge, "redirect_url"> {
	is_permanent?: boolean;
	narration?: string;
	subaccounts?: Record<"id", string>[];
	meta: Meta;
	email: string;
}

export interface ChargeBankTransferResponse {
	meta: {
		authorization: {
			transfer_reference: string;
			transfer_account: string;
			transfer_bank: string;
			account_expiration: string;
			transfer_note: string;
			transfer_amount: number;
			mode: string;
		};
	};
}

export interface ChargeACHPayload extends Charge {
	email: string;
	phone_number?: string;
	meta: Meta;
	country?: Country;
}

export interface ChargeACHResponse {
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
	auth_url: string;
	currency: string;
	ip: string;
	narration: string;
	status: string;
	payment_type: string;
	fraud_status: string;
	charge_type: string;
	created_at: string;
	account_id: number;
	redirect_url: string;
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
}

export interface ChargeBankPayload extends Omit<Charge, "amount" | ""> {
	account_bank: string;
	account_number: string;
	email: string;
	meta: Meta;
}

export interface ChargeBankResponse {
	amount: string;
	type: string;
	redirect: boolean;
	created_at: string;
	order_ref: string;
	flw_ref: string;
	redirect_url: null;
	payment_code: string;
	type_data: string;
	meta: {
		authorization: {
			account_number: string;
			sort_code: string;
		};
	};
}

export interface ChargeBankNGResponse {
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
	created_at: string;
	account_id: number;
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
	meta: {
		authorization: {
			mode: string;
			redirect: string;
			validate_instructions: string;
		};
	};
}

export interface ChargeMpesaPayload extends Charge {
	email: string;
	phone_number: string;
	meta: Meta;
}

export interface ChargeMpesaResponse {
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
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
}

export interface ChargeGhanaMobilePayload extends Charge {
	email: string;
	phone_number: string;
	network: "MTN" | "VODAFONE" | "TIGO";
	meta: Meta;
}
export interface ChargeGhanaMobileResponse {
	authorization: {
		redirect: string;
		mode: string;
	};
}

export interface ChargeRwandaMobilePayload extends Charge {
	order_id: string;
	email: string;
	phone_number: string;
	meta: Meta;
}
export interface ChargeRwandaMobileResponse {
	authorization: {
		redirect: string;
		mode: string;
	};
}

export interface ChargeUgandaMobileMobilePayload extends Charge {
	order_id?: string;
	email: string;
	phone_number: string;
	meta: Meta;
	voucher?: number;
	network?: "MTN" | string;
}
export interface ChargeUgandaMobileResponse {
	authorization: {
		redirect: string;
		mode: string;
	};
}

export interface ChargeFrancoPhoneMobilePaylaod extends ChargeACHPayload {}
export interface ChargeFranncophoneMobileResponse {
	data: {
		id: number;
		tx_ref: string;
		flw_ref: string;
		order_id: string;
		device_fingerprint: string;
		amount: number;
		charged_amount: number;
		app_fee: number;
		merchant_fee: number;
		auth_model: string;
		currency: string;
		ip: string;
		narration: string;
		status: string;
		payment_type: string;
		fraud_status: string;
		charge_type: string;
		created_at: string;
		account_id: number;
		customer: {
			id: number;
			phone_number: string;
			name: string;
			email: string;
			created_at: string;
		};
		processor_response: string;
	};
	meta: {
		authorization: {
			mode: string;
			redirect_url: string;
		};
	};
}

export interface ChargeTanzaniaMobilePayload extends ChargeGhanaMobilePayload {}

export interface ChargeTanzaniaMobileResponse {
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
	payment_type: string;
	fraud_status: string;
	charge_type: string;
	created_at: string;
	account_id: number;
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
}

export interface Charge1VoucherPayload extends Charge {
	country?: Country;
	pin: number;
}

export interface Charge1VoucherResponse {
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
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
}

export interface ChargeApplePay extends Omit<Charge, "phone_number"> {
	email: string;
	billing_address?: string;
	billing_city?: string;
	billing_state?: string;
	billing_country?: Country;
	billing_zip?: string;
	meta: Meta;
}
export interface ChargeApplePayResponse {
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
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
	meta: {
		authorization: {
			mode: string;
			redirect: string;
		};
	};
}

export interface ChargeGooglePay extends ChargeApplePay {}
export interface ChargeGooglePayResponse {
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
	customer: {
		id: number;
		phone_number: null;
		name: string;
		email: string;
		created_at: string;
	};
	meta: {
		authorization: {
			mode: string;
			redirect: string;
		};
	};
}

export interface ChargeENairaPayload extends Charge {
	email: string;
	meta: Meta;
}
export interface ChargeENairaResponse {
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
	customer: {
		id: number;
		phone_number: null;
		name: string;
		email: string;
		created_at: string;
	};
	meta: {
		authorization: {
			mode: string;
			redirect: string;
		};
	};
}

export interface ChargeUSSDPayload extends Charge {
	email: string;
	meta: Meta;
}
export interface ChargeUSSDResponse {
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
		payment_type: string;
		fraud_status: string;
		charge_type: string;
		created_at: string;
		account_id: number;
		customer: {
			id: number;
			phone_number: string;
			name: string;
			email: string;
			created_at: string;
		};
		payment_code: string;
	};
	meta: {
		authorization: {
			mode: string;
			note: string;
		};
	};
}

export interface ChargeNQRPayload extends Charge {
	email: string;
	is_nqr: number;
	meta: Meta;
}
export interface ChargeNQRResponse {
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
		customer: {
			id: number;
			phone_number: string;
			name: string;
			email: string;
			created_at: string;
		};
	};
	meta: {
		authorization: {
			qr_image: string;
			mode: string;
			validate_instructions: string;
		};
	};
}

export interface ChargeOpayPayload extends Charge {
	email: string;
	meta: Meta;
	fullame: string;
}
export interface ChargeOpayResponse {
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
		customer: {
			id: number;
			phone_number: string;
			name: string;
			email: string;
			created_at: string;
		};
	};
	meta: {
		authorization: {
			qr_image: string;
			mode: string;
			validate_instructions: string;
		};
	};
}

export interface ChargeCaptecPaylod extends Charge {}
export interface ChargeCaptecResponse {
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
	customer: {
		id: number;
		phone_number: string;
		name: string;
		email: string;
		created_at: string;
	};
}

export interface ChargeFawryPayPayload extends Charge {
	meta: Meta;
	fullname: string;
}
export interface ChargeFawryResponse {
	data: {
		id: number;
		tx_ref: string;
		order_ref: string;
		flw_ref: string;
		device_fingerprint: string;
		amount: number;
		charged_amount: number;
		app_fee: number;
		merchant_fee: number;
		processor_response: string;
		currency: string;
		narration: string;
		status: string;
		auth_url: string;
		payment_type: string;
		fraud_status: string;
		charge_type: string;
		created_at: string;
		account_id: number;
		customer: {
			id: number;
			phone_number: string;
			name: string;
			email: string;
			created_at: string;
		};
	};
	meta: {
		authorization: {
			mode: string;
			instruction: string;
		};
	};
}

export interface ValidateChargePayload {
	otp: string;
	flw_ref: string;
	type: "card" | "account";
}

export interface ValidateChargeResponse {
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
	customer: {
		id: number;
		phone_number: null;
		name: string;
		email: string;
		created_at: string;
	};
	card: {
		first_6digits: string;
		last_4digits: string;
		issuer: string;
		country: string;
		type: string;
		expiry: string;
	};
}
