export interface FlutterwaveResponse<T> {
	status: "success" | "error";
	message: string;
	data: T;
	meta?: {
		page_info: {
			total: number;
			current_page: number;
			total_pages: number;
		};
	};
}

export interface FlutterwaveErrorResponse {
	status: "error";
	message: string;
	data?: unknown; // Sometimes errors might have a data field
	code?: string; // Flutterwave specific error codes
}

export interface PaginationOptions {
	page?: number;
	pageSize?: number;
	from?: string; // Date string e.g., 'YYYY-MM-DD'
	to?: string; // Date string e.g., 'YYYY-MM-DD'
}
