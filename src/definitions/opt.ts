export interface GenerateOtpPayload {
	length?: number; // The length of otp to generate. Expected value is between 5 - 7
	customer: {
		name: string; // The customer's full name. MaxLength == 10 characters
		email: string;
		phone: string;
	};
	sender: string; // The Sender name displayed on the OTP message
	send: boolean; // Set to true to send OTP to customer
	medium?: ("sms" | "email" | "whatsapp")[];
	expiry?: number; // The expiry time, in minutes, of the OTP. Default value is 1 minute.
}

export type GenerateOtpResult = {
	medium: string;
	reference: string;
	otp: string;
	expiry: string;
}[];
