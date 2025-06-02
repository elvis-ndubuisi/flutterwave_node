import type { Currency } from "./common";

export interface CreateBeneficiaryPayload {
	account_bank: string;
	account_number: string;
	beneficiary_name: string;
	currency: Currency;
	bank_name: string;
}

export interface CreateBeneficiaryRespose {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	created_at: string;
	bank_name: string;
}

export interface Beneficiary {
	id: number;
	account_number: string;
	bank_code: string;
	full_name: string;
	meta: null;
	created_at: string;
	bank_name: string;
}
export interface ListBeneficiariesResponse {
	data: Beneficiary[];
	meta: {
		page_info: {
			total: number;
			current_page: number;
			total_pages: number;
		};
	};
}
