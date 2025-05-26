export const FLUTTERWAVE_API_VERSION = "v3";
export const FLUTTERWAVE_BASE_URL = `https://api.flutterwave.com/${FLUTTERWAVE_API_VERSION}`;

export interface FlutterwaveConfig {
	secretKey: string;
	publicKey?: string; // Optional, for some client-side operations if you extend
	encryptionKey?: string; // For Rave V2 payment encryption, if needed
	timeout?: number; // Request timeout in milliseconds
}
