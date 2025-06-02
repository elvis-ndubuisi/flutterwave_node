import type { ApiClient } from "@/core/client";
import type { Currency } from "@/definitions/common";
import type {
	BulkRates,
	BulkTransferPayload,
	BulkTransferResponse,
	CreateTransferPayload,
	CreateTransferResponse,
	GetBulkTransferPayload,
	GetBulkTransferResponse,
	ListTransferPayload,
	ListTransferResponse,
	QueryFeeResponse,
	QueryRateResponse,
	Retry,
	RetryTransferResponse,
	Transfer,
	VerifyBulkRateResponse,
} from "@/definitions/transfer";

type T = Record<string, unknown>;
export class TransferService {
	private apiClient: ApiClient;

	constructor(client: ApiClient) {
		this.apiClient = client;
	}

	/** This will show you how to initiate a transfer */
	async create(
		payload: CreateTransferPayload,
	): Promise<CreateTransferResponse> {
		return this.apiClient.post("transfers", payload as unknown as T);
	}

	/** This helps you retry a previously failed transfer. */
	async retry(payload: { id: string }): Promise<RetryTransferResponse> {
		return this.apiClient.post(
			`transfers/${payload.id}/retries`,
			payload as unknown as T,
		);
	}

	/** This document shows you how to initiate a bulk transfer */
	async bulkTransfer(
		payload: BulkTransferPayload,
	): Promise<BulkTransferResponse> {
		return this.apiClient.post("bulk-transfers", payload as unknown as T);
	}

	/** Get applicable transfer fee */
	async queryFee(payload: {
		amount: number;
		currency: Currency;
		type: "mobilemoney" | "account";
	}): Promise<QueryFeeResponse> {
		return this.apiClient.get(
			`transfers/fee?amount=${payload.amount}&currency=${payload.currency}&type=${payload.type}`,
		);
	}

	/** Fetch all transfers on your account */
	async list(payload: ListTransferPayload): Promise<ListTransferResponse> {
		return this.apiClient.get(
			`transfers?${new URLSearchParams(payload as Record<string, string>).toString()}`,
		);
	}

	/** Fetch a single transfer on your account */
	async get(payload: { id: string }): Promise<Transfer> {
		return this.apiClient.get(`transfers/${payload.id}`);
	}

	/** Fetch transfer retry attempts for a single transfer on your account.*/
	async getRetry(payload: { id: string }): Promise<Retry[]> {
		return this.apiClient.get(`transfers/${payload.id}/retries`);
	}

	/** Get the status of a bulk transfer on your account*/
	async getBulkTransfer(
		payload: GetBulkTransferPayload,
	): Promise<GetBulkTransferResponse> {
		return this.apiClient.get(
			`transfers?${new URLSearchParams(payload as unknown as Record<string, string>).toString()}`,
		);
	}

	/** This endpoint helps you understand transfer rates when making international transfers */
	async queryTransferRates(payload: {
		amount: number;
		destination_currency: Currency;
		source_currency: Currency;
	}): Promise<QueryRateResponse> {
		return this.apiClient.get(
			`transfers/rates?${new URLSearchParams(payload as unknown as Record<string, string>).toString()}`,
		);
	}

	async queryBulkRates(payload: BulkRates) {
		return this.apiClient.post("bulk-rates", payload as unknown as T);
	}

	async verifyBulkRates(payload: { id: string }): Promise<
		VerifyBulkRateResponse[]
	> {
		return this.apiClient.get(`bulk-rates?id=${payload.id}`);
	}
}
