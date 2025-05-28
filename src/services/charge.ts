import type { ApiClient } from "@/core/client";
import type {
	Charge1VoucherPayload,
	Charge1VoucherResponse,
	ChargeACHPayload,
	ChargeACHResponse,
	ChargeApplePay,
	ChargeApplePayResponse,
	ChargeBankNGResponse,
	ChargeBankPayload,
	ChargeBankResponse,
	ChargeBankTransferPaylod,
	ChargeBankTransferResponse,
	ChargeCaptecPaylod,
	ChargeCaptecResponse,
	ChargeCardPaylood,
	ChargeCardResponse,
	ChargeENairaPayload,
	ChargeENairaResponse,
	ChargeFawryPayPayload,
	ChargeFawryResponse,
	ChargeFrancoPhoneMobilePaylaod,
	ChargeFranncophoneMobileResponse,
	ChargeGhanaMobilePayload,
	ChargeGhanaMobileResponse,
	ChargeGooglePay,
	ChargeGooglePayResponse,
	ChargeMpesaPayload,
	ChargeMpesaResponse,
	ChargeNQRPayload,
	ChargeNQRResponse,
	ChargeOpayPayload,
	ChargeOpayResponse,
	ChargeRwandaMobilePayload,
	ChargeRwandaMobileResponse,
	ChargeTanzaniaMobilePayload,
	ChargeTanzaniaMobileResponse,
	ChargeUSSDPayload,
	ChargeUSSDResponse,
	ChargeUgandaMobileMobilePayload,
	ChargeUgandaMobileResponse,
} from "@/definitions/charges";
import { w } from "vitest/dist/chunks/reporters.d.C-cu31ET.js";

type T = Record<string, unknown>;

export class ChargeService {
	private client: ApiClient;

	constructor(apiClient: ApiClient) {
		this.client = apiClient;
	}

	/**
	 * Collect card payments with Flutterwave.
	 * We recommend you read the {@link https://developer.flutterwave.com/docs/direct-card-charge} method overview before you proceed.
	 */
	async card(payload: ChargeCardPaylood): Promise<ChargeCardResponse> {
		return this.client.post("charges?type=card", payload as unknown as T);
	}

	/**
	 * Generate dynamic virtual accounts for instant payments via bank transfers.
	 * We recommend you read the {@link https://developer.flutterwave.com/docs/bank-transfer-1} method overview before you proceed.
	 */
	async bankTransfer(
		payload: ChargeBankTransferPaylod,
	): Promise<ChargeBankTransferResponse> {
		return this.client.post(
			"charges?type=bank_transfer",
			payload as unknown as T,
		);
	}

	/**
	 * Collect ACH payments for USD and ZAR transactions. We recommend you read the method overview before you proceed.
	 * {@linnk https://developer.flutterwave.com/docs/ach-payment}
	 */
	async ach(payload: ChargeACHPayload): Promise<ChargeACHResponse> {
		return this.client.post(
			"charges?type=ach_payment",
			payload as unknown as T,
		);
	}

	/**
	 * Charge Customers UK and EU bank accounts. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/uk-and-eu}
	 */
	async bank_uk_eu(paylaod: ChargeBankPayload): Promise<ChargeBankResponse> {
		return this.client.post(
			"charges?type=debit_uk_account",
			paylaod as unknown as T,
		);
	}

	/**
	 * Charge Nigerian bank accounts using Flutterwave. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/nigeria}
	 */
	async bank_ng(payload: ChargeBankPayload): Promise<ChargeBankNGResponse> {
		return this.client.post("charges?type=mono", payload as unknown as T);
	}

	/**
	 * Collect Mpesa payments from customers in Kenya. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/m-pesa}
	 */
	async mpesa(payload: ChargeMpesaPayload): Promise<ChargeMpesaResponse> {
		return this.client.post("charges?type=mpesa", payload as unknown as T);
	}

	/**
	 * Collect mobile money payments from customers in Ghana. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/ghana}
	 */
	async ghanaMobile(
		payload: ChargeGhanaMobilePayload,
	): Promise<ChargeGhanaMobileResponse> {
		return this.client.post(
			"charges?type=mobile_money_ghana",
			payload as unknown as T,
		);
	}

	/**
	 * Collect mobile money payments from customers in Rwanda. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/rwanda}
	 */
	async rwandaMobile(
		payload: ChargeRwandaMobilePayload,
	): Promise<ChargeRwandaMobileResponse> {
		return this.client.post(
			"charges?type=mobile_money_rwanda",
			payload as unknown as T,
		);
	}

	/**
	 * Receive mobile money payments from customers in Uganda. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/uganda}
	 */
	async ugandaMobile(
		payload: ChargeUgandaMobileMobilePayload,
	): Promise<ChargeUgandaMobileResponse> {
		return this.client.post(
			"charges?type=mobile_money_uganda",
			payload as unknown as T,
		);
	}

	/**
	 * Collect mobile money payments from customers in Francophone countries. This method supports payment from Cameroon,
	 * Cote d'Ivoire, Mali and Senegal. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/francophone}
	 */
	async francophoneMobile(
		payload: ChargeFrancoPhoneMobilePaylaod,
	): Promise<ChargeFranncophoneMobileResponse> {
		return this.client.post(
			"charges?type=mobile_money_franco",
			payload as unknown as T,
		);
	}

	/**
	 * This document describes how to collect payments via Tanzania mobile money.
	 */
	async tanzaniaMobile(
		payload: ChargeTanzaniaMobilePayload,
	): Promise<ChargeTanzaniaMobileResponse> {
		return this.client.post(
			"charges?type=mobile_money_tanzania",
			payload as unknown as T,
		);
	}

	/**
	 * This document describes how to collect payments via Zambia mobile money.
	 */
	async zambiaMobile(paylaod: unknown): Promise<unknown> {
		return this.client.post(
			"harges?type=mobile_money_zambia",
			paylaod as unknown as T,
		);
	}

	/**
	 * Charge South African customers via 1Voucher. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/1voucher}
	 */
	async voucher(
		payload: Charge1VoucherPayload,
	): Promise<Charge1VoucherResponse> {
		return this.client.post(
			"charges?type=voucher_payment",
			payload as unknown as T,
		);
	}

	/**
	 * Accept payments from your customers with Apple Pay. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/apple-paytm%EF%B8%8F}
	 */
	async applePay(payload: ChargeApplePay): Promise<ChargeApplePayResponse> {
		return this.client.post("charges?type=applepay", payload as unknown as T);
	}

	/**
	 * Accept payments from your customers with Google Pay. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/google-paytm%EF%B8%8F}
	 */
	async googlePay(payload: ChargeGooglePay): Promise<ChargeGooglePayResponse> {
		return this.client.post("charges?type=googlepay", payload as unknown as T);
	}

	/**
	 * Accept payment from eNaira wallets. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/enaira-payment}
	 */
	async enaira(paylaod: ChargeENairaPayload): Promise<ChargeENairaResponse> {
		return this.client.post("charges?type=enaira", paylaod as unknown as T);
	}

	/**
	 * Collect USSD payments from customers in Nigeria. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/ussd}
	 */
	async ussd(payload: ChargeUSSDPayload): Promise<ChargeUSSDResponse> {
		return this.client.post("charges?type=ussd", payload as unknown as T);
	}

	/**
	 * Generate QR images for NQR payments. We recommend you read the method overview before you proceed.
	 * {@link https://developer.flutterwave.com/docs/nibss-qr}
	 */
	async nqr(payload: ChargeNQRPayload): Promise<ChargeNQRResponse> {
		return this.client.post("charges?type=qr", payload as unknown as T);
	}

	/**
	 * Collect payments from OPay wallets. We cover this payment method in more details in the method overview.
	 * {@link https://developer.flutterwave.com/docs/opay}
	 */
	async opay(payload: ChargeOpayPayload): Promise<ChargeOpayResponse> {
		return this.client.post("charges?type=opay", payload as unknown as T);
	}

	/**
	 * Collect capitec payments with Flutterwave. we recommend you read the overview before you proceed.
	 */
	async capitec(payload: ChargeCaptecPaylod): Promise<ChargeCaptecResponse> {
		return this.client.post("charges?type=capitec", payload as unknown as T);
	}

	/**
	 * Receive Fawry payments from customers in Egypt. Read the overview for this payment method before proceeding.
	 * {@link https://developer.flutterwave.com/docs/fawry-pay}
	 */
	async fawryPay(payload: ChargeFawryPayPayload): Promise<ChargeFawryResponse> {
		return this.client.post("charges?type=fawry_pay", payload as unknown as T);
	}
}
