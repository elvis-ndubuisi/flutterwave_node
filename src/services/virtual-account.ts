import type { ApiClient } from "@/core/client";
import type {
	BulkVirtualAccountPayload,
	BulkVirtualAccountResponse,
	CreateVirtualAccountPayload,
	CreateVirtualAccountResponse,
	VirtualAccount,
} from "@/definitions/virtual-accounts";

type T = Record<string, unknown>;

export class VirtualAccountService {
	private apiClient: ApiClient;

	constructor(client: ApiClient) {
		this.apiClient = client;
	}

	/**
	 *  Create a Virtual Account for Your Customer.
	 */
	async create(
		payload: CreateVirtualAccountPayload,
	): Promise<CreateVirtualAccountResponse> {
		return this.apiClient.post(
			"virtual-account-numbers",
			payload as unknown as T,
		);
	}
	/**
	 * Create Virtual Account Numbers in Bulk.
	 */
	async createBulk(
		payload: BulkVirtualAccountPayload,
	): Promise<BulkVirtualAccountResponse> {
		return this.apiClient.post(
			"bulk-virtual-account-numbers",
			payload as unknown as T,
		);
	}

	/** Retrieve virtual account information using its account number */
	async get(payload: { account_number: string }): Promise<VirtualAccount> {
		return this.apiClient.get(
			`virtual-account-numbers/${payload.account_number}`,
		);
	}

	/** Query virtual account information using the batch ID from the batch creation response. */
	async getBulk(payload: { batch_id: string }): Promise<VirtualAccount[]> {
		return this.apiClient.get(
			`bulk-virtual-account-numbers/${payload.batch_id}`,
		);
	}

	/** Update the BVN of existing virtual accounts. */
	async updateBVN(payload: { order_ref: string; bvn: string }) {
		return this.apiClient.put(`virtual-account-numbers/${payload.order_ref}`, {
			bvn: payload.bvn,
		});
	}

	/** Delete a virtual account */
	async delete(payload: {
		order_ref: string;
		status: "active" | "inactive" | string;
	}): Promise<{ status: string; status_desc: string }> {
		return this.apiClient.delete(
			`virtual-account-numbers/${payload.order_ref}`,
			{ status: payload.status },
		);
	}
}
