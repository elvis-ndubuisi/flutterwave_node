import type { Currency } from "./common";

export interface CreateVirtualAccountPayload {
	email: string;
	currency: Currency;
	amount: number;
	tx_ref: string;
	is_permanent?: boolean;
	narration?: string;
	bvn?: string;
	phonenumber?: string;
}

export interface CreateVirtualAccountResponse {
	response_code: string;
	response_message: string;
	flw_ref: string;
	order_ref: string;
	account_number: string;
	frequency: string;
	bank_name: string;
	created_at: string;
	expiry_date: string;
	note: string;
	amount: number;
}

export interface BulkVirtualAccountPayload {
	batch_ref: string;
	bulk_data: {
		lastname: string;
		firstname: string;
		email: string;
		bvn: string;
		nin?: string;
		is_permanent?: boolean;
	}[];
	narration?: string;
	currency: Currency;
}

export interface BulkVirtualAccountResponse {
	batch_id: string;
	response_code: string;
	response_message: string;
}

export interface VirtualAccount {
	response_code: string;
	response_message: string;
	flw_ref: string;
	order_ref: string;
	account_number: string;
	frequency: string;
	bank_name: string;
	created_at: string;
	expiry_date: string;
	note: string;
	amount: number;
}
