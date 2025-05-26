import type { ApiClient } from "@/core/client";
import type { Bank, BankBranch } from "@/definitions/banks";

export class BanksService {
	private apiClient: ApiClient;

	constructor(client: ApiClient) {
		this.apiClient = client;
	}

	/** Query all supported Banks in a specified country.
	 *  @param country The country code (e.g., 'NG', 'GH', 'KE')
	 */
	async list(country: string): Promise<Bank[]> {
		return this.apiClient.get<Bank[]>(`banks/${country}`);
	}

	/** Query the branch code for a specific Bank.
	 * @param bankId The ID of the bank (can be obtained from the list() method).
	 */
	async branches(bankId: string | number): Promise<BankBranch[]> {
		return this.apiClient.get<BankBranch[]>(`banks/${bankId}/branches`);
	}
}
