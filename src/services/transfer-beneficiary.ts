import type { ApiClient } from "@/core/client";
import type {
	Beneficiary,
	CreateBeneficiaryPayload,
	CreateBeneficiaryRespose,
	ListBeneficiariesResponse,
} from "@/definitions/transfer-beneficiary";

type T = Record<string, unknown>;
export class TransferBeneficiaryService {
	private apiClient: ApiClient;

	constructor(client: ApiClient) {
		this.apiClient = client;
	}

	/** Create a transfer beneficiary */
	async create(
		payload: CreateBeneficiaryPayload,
	): Promise<CreateBeneficiaryRespose> {
		return this.apiClient.post("beneficiaries", payload as unknown as T);
	}

	/** Get all beneficiaries */
	async list(payload: { page: number }): Promise<ListBeneficiariesResponse> {
		return this.apiClient.get(`beneficiaries?page=${payload.page}`);
	}

	/** Get a single transfer beneficiary details */
	async get(paylaod: { id: string }): Promise<Beneficiary> {
		return this.apiClient.get(`beneficiaries/${paylaod.id}`);
	}

	/** Delete a transfer beneficiary */
	async delete(payload: { id: string }) {
		return this.apiClient.delete(`beneficiaries/${payload.id}`);
	}
}
