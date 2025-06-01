# Flutterwave Universal

[![npm version](https://img.shields.io/npm/v/flutterwave-universal.svg)](https://www.npmjs.com/package/flutterwave-universal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

A modern, lightweight, and type-safe Flutterwave API SDK built with TypeScript. Designed for compatibility across **Node.js**, **Bun**, and **edge runtimes** (e.g., Cloudflare Workers, Vercel Edge Functions).

## Features

- **Full TypeScript support**: Built from the ground up with TypeScript for excellent developer experience
- **Universal Runtime Compatibility**: Works seamlessly in Node.js, Bun, Deno, and edge environments
- **Zero Dependencies**: Minimal runtime dependencies for lightweight integration
- **ESM and CJS builds**: Support for both module systems
- **Modern API**: Leverages the native `fetch` API
- **Comprehensive Coverage**: Support for all Flutterwave payment services

## Installation

### npm
```bash
npm install flutterwave-universal
```

### Yarn
```bash
yarn add flutterwave-universal
```

### pnpm
```bash
pnpm add flutterwave-universal
```

### Bun
```bash
bun add flutterwave-universal
```

### Deno
```typescript
import { Flutterwave } from "npm:flutterwave-universal";
```

## Quick Start

```typescript
import { Flutterwave } from "flutterwave-universal";

// Initialize the Flutterwave SDK with your secret key
const flw = new Flutterwave({
  secretKey: "YOUR_FLUTTERWAVE_SECRET_KEY",
  // Optional configuration
  timeout: 30000, // 30 seconds
});

// Example: Create a payment link
async function createPaymentLink() {
  try {
    const paymentLink = await flw.paymentLinks.create({
      amount: 1000,
      currency: "NGN",
      description: "Payment for product",
      title: "Product Purchase",
      customer: {
        email: "customer@example.com",
        name: "John Doe",
        phone_number: "08012345678",
      },
      redirect_url: "https://example.com/callback",
    });
    
    console.log("Payment link created:", paymentLink);
    return paymentLink;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
}
```

## Usage Examples

### Process Card Payments

```typescript
// Charge a card
const cardPayment = await flw.charges.card({
  card_number: "5531886652142950",
  cvv: "564",
  expiry_month: "09",
  expiry_year: "32",
  currency: "NGN",
  amount: 1000,
  email: "customer@example.com",
  fullname: "John Doe",
  tx_ref: "unique-transaction-reference",
  redirect_url: "https://example.com/callback",
});
```

### Verify Transactions

```typescript
// Verify a transaction by ID
const verificationResult = await flw.transactions.verify({
  id: "12345",
});

// Or verify by reference
const verificationByRef = await flw.transactions.verifyByReference({
  tx_ref: "unique-transaction-reference",
});
```

### Create Virtual Account

```typescript
// Create a virtual account for a customer
const virtualAccount = await flw.virtualAccounts.create({
  email: "customer@example.com",
  is_permanent: true,
  bvn: "12345678901",
  tx_ref: "unique-reference",
  first_name: "John",
  last_name: "Doe",
  narration: "John Doe's Account",
});
```

## API Reference

The SDK provides access to the following Flutterwave services:

- **Payments**: Process various payment methods
  - `charges` - Card, Bank Transfer, USSD, etc.
  - `paymentLinks` - Create and manage payment links
  - `transactions` - Verify and manage transactions

- **Financial Accounts**:
  - `virtualAccounts` - Create and manage virtual accounts
  - `banks` - Get list of supported banks
  - `transfers` - Process transfers to bank accounts

- **Subscriptions**:
  - `subscriptions` - Manage payment subscriptions
  - `plans` - Create and manage subscription plans

- **Verification**:
  - `otp` - Generate and validate OTPs
  - `billVerification` - Verify bill payments

- **Others**:
  - `settlements` - Manage settlements
  - `subaccounts` - Create and manage subaccounts
  - `misc` - Miscellaneous endpoints

For detailed documentation on each module, please refer to the [API documentation](./docs/API.md).

## Runtime Compatibility

This SDK is designed to work across multiple JavaScript runtimes:

| Runtime | Compatibility | Notes |
| ------- | ------------- | ----- |
| Node.js | ✅ Full | Tested with Node.js 16+ |
| Bun | ✅ Full | Tested with Bun 1.0+ |
| Deno | ✅ Full | Via npm: specifier |
| Cloudflare Workers | ✅ Full | No special configuration needed |
| Vercel Edge Functions | ✅ Full | Compatible with Edge Runtime |
| Netlify Edge Functions | ✅ Full | Works with Netlify Edge |

### Testing Across Different Runtimes

You can verify compatibility across different JavaScript runtimes without installing them locally using Docker:

```bash
# Make the script executable
chmod +x test_all_runtimes.sh

# Run tests across all supported runtimes
./test_all_runtimes.sh
```

This will build and run Docker containers for each supported runtime:
- Node.js
- Bun
- Deno
- Cloudflare Workers (simulated environment)

#### Requirements

- Docker installed on your machine
- Internet connection (to pull Docker images)

#### Testing Individual Runtimes

You can also test individual runtimes:

```bash
# Test in Node.js
docker build -t flutterwave-node-test -f ./dockerfiles/Dockerfile.node .
docker run --rm flutterwave-node-test

# Test in Bun
docker build -t flutterwave-bun-test -f ./dockerfiles/Dockerfile.bun .
docker run --rm flutterwave-bun-test

# Test in Deno
docker build -t flutterwave-deno-test -f ./dockerfiles/Dockerfile.deno .
docker run --rm flutterwave-deno-test

# Test in Cloudflare Workers (simulated)
docker build -t flutterwave-cloudflare-test -f ./dockerfiles/Dockerfile.cloudflare .
docker run --rm flutterwave-cloudflare-test
```

## Error Handling

The SDK uses a standardized error system for consistent error handling:

```typescript
try {
  const result = await flw.paymentLinks.create({
    // payment details
  });
} catch (error) {
  if (error instanceof FlutterwaveError) {
    console.error("Flutterwave API Error:", error.message);
    console.error("Error Code:", error.code);
    console.error("Error Data:", error.data);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Advanced Configuration

```typescript
const flw = new Flutterwave({
  secretKey: "YOUR_FLUTTERWAVE_SECRET_KEY",
  timeout: 60000, // 60 seconds timeout for requests
  // Add other configuration options as needed
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows the existing style and includes appropriate tests.

## Documentation

For more detailed documentation, please check the [docs directory](./docs):

- [API Reference](./docs/API.md)
- [Webhooks Guide](./docs/webhooks.md)
- [Error Handling](./docs/errors.md)
- [Runtime-specific notes](./docs/runtimes.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

If you discover any security related issues, please email the author instead of using the issue tracker.

## Support

For questions and support, please open an issue on the GitHub repository.
