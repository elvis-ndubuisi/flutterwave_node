import { FLUTTERWAVE_API_VERSION, FLUTTERWAVE_BASE_URL } from "@/core/config";
import { describe, expect, it } from "vitest";

describe("Config", () => {
	it("should have correct API version", () => {
		expect(FLUTTERWAVE_API_VERSION).toBe("v3");
	});

	it("should have correct base URL", () => {
		expect(FLUTTERWAVE_BASE_URL).toBe("https://api.flutterwave.com/v3");
	});

	it("should construct base URL from API version", () => {
		expect(FLUTTERWAVE_BASE_URL).toContain(FLUTTERWAVE_API_VERSION);
	});
});
