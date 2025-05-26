export interface Bank {
	id: number;
	code: string;
	name: string;
}

// For "Get bank branches" endpoint
export interface BankBranch {
	id: number;
	branch_code: string;
	branch_name: string;
	swift_code: string;
	bic: string;
}
