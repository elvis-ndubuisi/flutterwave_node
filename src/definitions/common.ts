export interface FlutterwaveResponse<T> {
	status: "success" | "error";
	message: string;
	data: T;
	meta?: {
		page_info?: {
			total: number;
			current_page: number;
			total_pages: number;
		};
		authorization?: {
			mode: string;
			endpoint: string;
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

export type Country =
	| "NG" // Nigeria
	| "GH" // Ghana
	| "KE" // Kenya
	| "UG" // Uganda
	| "TZ" // Tanzania
	| "ZA" // South Africa
	| "RW" // Rwanda
	| "MW" // Malawi
	| "SL" // Sierra Leone
	| "CM" // Cameroon
	| "CI" // Côte d'Ivoire
	| "SN" // Senegal
	| "BF" // Burkina Faso
	| "ET" // Ethiopia
	| "EG" // Egypt
	| "US" // United States
	| "GB" // United Kingdom
	| "FR" // France
	| "DE" // Germany
	| "IT" // Italy
	| "ES" // Spain
	| "BE" // Belgium
	| "NL" // Netherlands
	| "PT" // Portugal
	| "IE" // Ireland
	| "AT" // Austria
	| "CH" // Switzerland
	| "SE" // Sweden
	| "NO" // Norway
	| "FI" // Finland
	| "DK" // Denmark
	| "LU" // Luxembourg
	| "IS" // Iceland
	| "MT" // Malta
	| "CY" // Cyprus
	| "SK" // Slovakia
	| "SI" // Slovenia
	| "EE" // Estonia
	| "LV" // Latvia
	| "LT" // Lithuania
	| "PL" // Poland
	| "CZ" // Czech Republic
	| "HU" // Hungary
	| "RO" // Romania
	| "BG" // Bulgaria
	| "HR" // Croatia
	| "GR" // Greece
	| "LI" // Liechtenstein
	| "MC" // Monaco
	| "SM" // San Marino
	| "VA" // Vatican City
	| "AD" // Andorra
	| "AL" // Albania
	| "BA" // Bosnia and Herzegovina
	| "MK" // North Macedonia
	| "ME" // Montenegro
	| "RS" // Serbia
	| "TR" // Turkey
	| "UA" // Ukraine
	| "BY" // Belarus
	| "RU" // Russia
	| "MD" // Moldova
	| "GE" // Georgia
	| "AM" // Armenia
	| "AZ" // Azerbaijan
	| "KZ" // Kazakhstan
	| "UZ" // Uzbekistan
	| "TM" // Turkmenistan
	| "KG" // Kyrgyzstan
	| "TJ" // Tajikistan
	| "AF" // Afghanistan
	| "PK" // Pakistan
	| "IN" // India
	| "BD" // Bangladesh
	| "LK" // Sri Lanka
	| "NP" // Nepal
	| "BT" // Bhutan
	| "MV" // Maldives
	| "MM" // Myanmar
	| "TH" // Thailand
	| "LA" // Laos
	| "VN" // Vietnam
	| "KH" // Cambodia
	| "MY" // Malaysia
	| "SG" // Singapore
	| "ID" // Indonesia
	| "PH" // Philippines
	| "BN" // Brunei
	| "TL" // Timor-Leste
	| "CN" // China
	| "JP" // Japan
	| "KR" // South Korea
	| "KP" // North Korea
	| "MN" // Mongolia
	| "HK" // Hong Kong
	| "MO" // Macau
	| "TW" // Taiwan
	| "AU" // Australia
	| "NZ" // New Zealand
	| "FJ" // Fiji
	| "PG" // Papua New Guinea
	| "SB" // Solomon Islands
	| "VU" // Vanuatu
	| "NC" // New Caledonia
	| "PF" // French Polynesia
	| "WS" // Samoa
	| "TO" // Tonga
	| "TV" // Tuvalu
	| "KI" // Kiribati
	| "NR" // Nauru
	| "MH" // Marshall Islands
	| "FM" // Micronesia
	| "PW" // Palau
	| "GU" // Guam
	| "MP" // Northern Mariana Islands
	| "AS" // American Samoa
	| "CK" // Cook Islands
	| "NU" // Niue
	| "TK" // Tokelau
	| "WF" // Wallis and Futuna
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI" // Kiribati
	| "TO" // Tonga
	| "WS" // Samoa
	| "SB" // Solomon Islands
	| "NR" // Nauru
	| "TV" // Tuvalu
	| "VU" // Vanuatu
	| "FJ" // Fiji
	| "FM" // Micronesia
	| "MH" // Marshall Islands
	| "PW" // Palau
	| "KI";

export type Currency =
	| "NGN"
	| "GBP"
	| "CAD"
	| "XAF"
	| "CLP"
	| "COP"
	| "EGP"
	| "EUR"
	| "GHS"
	| "GNF"
	| "KES"
	| "MWK"
	| "MAD"
	| "RWF"
	| "SLL"
	| "STD"
	| "ZAR"
	| "TZS"
	| "UGX"
	| "USD"
	| "XOF"
	| "ZMW";
