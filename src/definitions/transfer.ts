import type { Country, Currency } from "./common";

type TransferMeta = {
	sender: string;
	sender_address?: string;
	sender_city?: string;
	sender_country: Country;
	sender_id_number?: string;
	sender_id_type?: "PASSPORT" | "DRIVING LICENSE" | "ID CARD" | "VOTER CARD";
	sender_id_expiry?: string;
	sender_mobile_number?: string;
	sender_email_address?: string;
	sender_occupation?: string;
	sender_beneficiary_relationship?: string;
	first_name: string;
	last_name: string;
	email: string;
	mobile_number: string;
	beneficiary_mobile_number: string;
	recipient_address: string;
	beneficiary_state: string;
	beneficiary_country: Country;
	beneficiary_occupation: string;
	transfer_purpose?: string;
	routing_number?: string;
	merchant_name?: string;
	account_number?: string;
};
export interface CreateTransferPayload {
	account_bank: string;
	account_number: string;
	amount: number;
	currency: Currency;
	debit_subaccount?: string;
	beneficiary: number;
	beneficiary_name: string;
	reference?: string;
	debit_currency?: Currency;
	destination_branch_code?: string;
	callback_url?: string;
	narration?: string;
	meta: TransferMeta;
}

export interface CreateTransferResponse {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	created_at: string;
	currency: string;
	debit_currency: string;
	amount: number;
	fee: number;
	status: string;
	reference: string;
	meta: null;
	narration: string;
	complete_message: string;
	requires_approval: number;
	is_approved: number;
	bank_name: string;
}

export interface RetryTransferResponse {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	created_at: string;
	currency: string;
	debit_currency: string;
	amount: number;
	fee: number;
	status: string;
	reference: string;
	meta: null;
	complete_message: string;
	requires_approval: number;
	is_approved: number;
	bank_name: string;
}

type BulkTransfer = {
	email: string;
	mobile_number: string;
	recipient_address: string;
	first_name?: string;
	last_name?: string;
};
export interface BulkTransferPayload {
	currency: Currency;
	title?: string;
	error_reporting?: boolean;
	entity?: string;
	bulk_data: BulkTransfer[];
}

export interface BulkTransferResponse {
	id: number;
	created_at: string;
	approver: string;
}

export type Fee = {
	fee_type: string;
	currency: string;
	fee: number;
};

export interface QueryFeeResponse {
	data: Fee[];
}

export interface ListTransferPayload {
	reference?: string;
	page?: number;
	status?: "failed" | "successful";
	from?: Date | string;
	to?: Date | string;
	include_proof?: boolean;
	include_provider_ref?: boolean;
	include_approver_info?: boolean;
	include_vat?: string;
	include_date_completed?: string;
	include_rate?: string;
	include_debit_currency_amount?: string;
	page_size?: number;
}

interface ListTransferMeta {
	page_info?: {
		total: number;
		current_page: number;
		total_pages: number;
	};
	AccountId?: number;
	merchant_id?: string;
}
export interface ListTransferResponse {
	meta: ListTransferMeta;
	data: {
		id: number;
		account_number: string;
		bank_code: string;
		full_name: string;
		created_at: string;
		currency: string;
		debit_currency: string | null;
		amount: number;
		fee: number;
		status: string;
		reference: string;
		meta:
			| ListTransferMeta
			| {
					sender: string;
					mobile_number: string;
			  }[];
		narration: null | string;
		approver: null;
		complete_message: string;
		requires_approval: number;
		is_approved: number;
		bank_name: string;
		debit_currency_amount: null;
		rate: null;
	}[];
}

export interface Transfer {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	created_at: string;
	currency: string;
	debit_currency: string;
	amount: number;
	fee: number;
	status: string;
	reference: string;
	meta: null;
	narration: string;
	approver: null;
	complete_message: string;
	requires_approval: number;
	is_approved: number;
	bank_name: string;
}

export interface Retry {
	id: number;
	account_number: string;
	bank_code: string;
	bank_name: string;
	full_name: string;
	currency: string;
	debit_currency: string;
	amount: number;
	fee: number;
	status: string;
	reference: string;
	narration: null;
	complete_message: string;
	meta: null;
	requires_approval: number;
	is_approved: number;
	created_at: string;
}

export interface GetBulkTransferPayload {
	batch_id: string;
	page?: number;
	from?: Date | string;
	to?: Date | string;
	include_proof?: string;
	include_provider_ref?: string;
	include_approver_info?: string;
	include_vat?: string;
	include_rate?: string;
	include_debit_currency?: string;
	include_retry_tag?: string;
}

export interface GetBulkTransferResponse {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	created_at: string;
	currency: string;
	debit_currency: string;
	amount: number;
	fee: number;
	status: string;
	reference: string;
	meta: null;
	narration: string;
	approver: null;
	complete_message: string;
	requires_approval: number;
	is_approved: number;
	bank_name: string;
}

export interface QueryRateResponse {
	rate: number;
	source: {
		currency: string;
		amount: number;
	};
	destination: {
		currency: string;
		amount: number;
	};
}

export interface BulkRates {
	batch_reference: string;
	data: { from: Currency; to: Currency; amount: number }[];
}

interface From {
	currency: string;
	amount: number;
}
interface To {
	currency: string;
	amount: number | null;
}
export interface VerifyBulkRateResponse {
	rate: number | null;
	from: From;
	to: To;
	status: string;
	error: null | string;
}
