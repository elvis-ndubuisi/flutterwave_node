export class FlutterwaveError extends Error {
	public readonly status?: string;
	public readonly code?: string;
	public readonly data?: unknown;

	constructor(message: string, status?: string, code?: string, data?: unknown) {
		super(message);
		this.name = "FlutterwaveError";
		this.status = status;
		this.code = code;
		this.data = data;

		// This is necessary for proper Error subclassing in TypeScript
		Object.setPrototypeOf(this, FlutterwaveError.prototype);
	}
}
