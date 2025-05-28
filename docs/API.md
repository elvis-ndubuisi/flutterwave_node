# Flutterwave Universal SDK API Documentation

This document provides comprehensive details for all services and methods available in the Flutterwave Universal SDK.

## Table of Contents

- [Introduction](#introduction)
- [API Structure](#api-structure)
- [Services](#services)
  - [Payments](#payments)
    - [Charges](#charges)
    - [Payment Links](#payment-links)
    - [Transactions](#transactions)
  - [Financial Accounts](#financial-accounts)
    - [Virtual Accounts](#virtual-accounts)
    - [Banks](#banks)
    - [Transfers](#transfers)
  - [Subscriptions](#subscriptions)
    - [Subscription Plans](#subscription-plans)
    - [Subscriptions](#subscriptions-1)
  - [Verification](#verification)
    - [OTP](#otp)
    - [Bill Verification](#bill-verification)
  - [Others](#others)
    - [Settlements](#settlements)
    - [Subaccounts](#subaccounts)
    - [Miscellaneous](#miscellaneous)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Introduction

The Flutterwave Universal SDK provides a TypeScript-first interface to the Flutterwave API, enabling developers to integrate Flutterwave payment services across various JavaScript runtimes including Node.js, Bun, Deno, and edge environments like Cloudflare Workers.

## API Structure

The SDK follows a modular architecture, with each Flutterwave service represented as a separate module. The main entry point is the `Flutterwave` class, which is initialized with your Flutterwave API credentials:

```typescript
import { Flutterwave } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: "YOUR_FLUTTERWAVE_SECRET_KEY",
  // Optional configuration
  timeout: 30000, // 30 seconds
});
```

After initialization, you can access the various service modules through the flw instance:

```typescript
// Access the charges service
const cardPayment = await flw.charges.card({ /* ... */ });

// Access the payment links service
const paymentLink = await flw.paymentLinks.create({ /* ... */ });

// Access the banks service
const banksList = await flw.banks.list({ country: "NG" });
```

## Services

### Payments

#### Charges

The Charges service allows you to process payments through various channels.

##### Card Payments

```typescript
/**
 * Process a card payment
 */
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

**Response:**
```json
{
  "status": "success",
  "message": "Charge initiated",
  "data": {
    "id": 2974239,
    "tx_ref": "unique-transaction-reference",
    "flw_ref": "FLW-MOCK-a7911408bd6b4ab6c8b8c95531545116",
    "device_fingerprint": "N/A",
    "amount": 1000,
    "charged_amount": 1000,
    "app_fee": 14,
    "merchant_fee": 0,
    "processor_response": "Approved",
    "auth_model": "PIN",
    "currency": "NGN",
    "ip": "::ffff:10.5.179.3",
    "narration": "CARD Transaction",
    "status": "successful",
    "auth_url": "https://api.flutterwave.com/v3/charges/3072524523/validate",
    "payment_type": "card",
    "fraud_status": "ok",
    "created_at": "2023-04-10T14:18:45.000Z",
    "customer": {
      "id": 2401922,
      "name": "John Doe",
      "phone_number": null,
      "email": "customer@example.com",
      "created_at": "2023-04-10T14:18:45.000Z"
    }
  }
}
```

##### Bank Transfers

```typescript
/**
 * Process a bank transfer payment
 */
const bankTransfer = await flw.charges.bankTransfer({
  tx_ref: "unique-transfer-reference",
  amount: 2000,
  email: "customer@example.com",
  currency: "NGN",
  phone_number: "08012345678",
  fullname: "John Doe",
});
```

##### USSD Payments

```typescript
/**
 * Process a USSD payment
 */
const ussdPayment = await flw.charges.ussd({
  tx_ref: "unique-ussd-reference",
  account_bank: "044",
  amount: 1500,
  currency: "NGN",
  email: "customer@example.com",
  phone_number: "08012345678",
  fullname: "John Doe",
});
```

#### Payment Links

The Payment Links service allows you to create and manage payment links.

##### Create Payment Link

```typescript
/**
 * Create a payment link
 */
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
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment link created",
  "data": {
    "id": 36875,
    "link": "https://flutterwave.com/pay/unique-payment-link",
    "title": "Product Purchase",
    "description": "Payment for product",
    "amount": 1000,
    "currency": "NGN",
    "status": "active",
    "created_at": "2023-04-10T14:32:45.000Z"
  }
}
```

##### List Payment Links

```typescript
/**
 * List all payment links
 */
const paymentLinks = await flw.paymentLinks.list({
  page: 1,
  limit: 20,
});
```

##### Get a Payment Link

```typescript
/**
 * Get a specific payment link by ID
 */
const paymentLink = await flw.paymentLinks.get({
  id: "12345",
});
```

#### Transactions

The Transactions service allows you to verify and manage transactions.

##### Verify Transaction

```typescript
/**
 * Verify a transaction by ID
 */
const verificationResult = await flw.transactions.verify({
  id: "12345",
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Transaction verified",
  "data": {
    "id": 12345,
    "tx_ref": "unique-transaction-reference",
    "flw_ref": "FLW-MOCK-a7911408bd6b4ab6c8b8c95531545116",
    "amount": 1000,
    "currency": "NGN",
    "charged_amount": 1000,
    "app_fee": 14,
    "merchant_fee": 0,
    "processor_response": "Approved",
    "status": "successful",
    "payment_type": "card",
    "created_at": "2023-04-10T14:18:45.000Z",
    "customer": {
      "id": 2401922,
      "name": "John Doe",
      "phone_number": null,
      "email": "customer@example.com"
    }
  }
}
```

##### Verify Transaction by Reference

```typescript
/**
 * Verify a transaction by reference
 */
const verificationByRef = await flw.transactions.verifyByReference({
  tx_ref: "unique-transaction-reference",
});
```

##### List Transactions

```typescript
/**
 * List transactions with filters
 */
const transactions = await flw.transactions.list({
  page: 1,
  limit: 20,
  from: "2023-01-01",
  to: "2023-12-31",
  customer_email: "customer@example.com",
});
```

### Financial Accounts

#### Virtual Accounts

The Virtual Accounts service allows you to create and manage virtual accounts.

##### Create Virtual Account

```typescript
/**
 * Create a virtual account for a customer
 */
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

**Response:**
```json
{
  "status": "success",
  "message": "Virtual account created",
  "data": {
    "response_code": "02",
    "response_message": "Successful",
    "flw_ref": "FLW-MOCK-a7911408bd6b4ab6c8b8c95531545116",
    "order_ref": "URF_1587912144968_4319875",
    "account_number": "1234567890",
    "account_status": "ACTIVE",
    "frequency": "PERSISTENT",
    "bank_name": "Test Bank",
    "created_at": "2023-04-10T14:32:45.000Z",
    "expiry_date": "2023-05-10T14:32:45.000Z",
    "note": "John Doe's Account"
  }
}
```

##### List Virtual Accounts

```typescript
/**
 * List all virtual accounts
 */
const virtualAccounts = await flw.virtualAccounts.list({
  page: 1,
  limit: 20,
});
```

##### Get Virtual Account

```typescript
/**
 * Get a specific virtual account by order reference
 */
const virtualAccount = await flw.virtualAccounts.get({
  order_ref: "URF_1587912144968_4319875",
});
```

#### Banks

The Banks service allows you to retrieve bank information.

##### List Banks

```typescript
/**
 * Get list of banks by country
 */
const banks = await flw.banks.list({
  country: "NG", // Nigeria
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Banks fetched successfully",
  "data": [
    {
      "id": 1,
      "code": "044",
      "name": "Access Bank"
    },
    {
      "id": 2,
      "code": "023",
      "name": "Citibank Nigeria"
    },
    // More banks...
  ]
}
```

##### Get Bank Branches

```typescript
/**
 * Get list of branches for a specific bank
 */
const branches = await flw.banks.branches({
  id: "1", // Bank ID
});
```

#### Transfers

The Transfers service allows you to process transfers to bank accounts.

##### Initiate Transfer

```typescript
/**
 * Initiate a transfer to a bank account
 */
const transfer = await flw.transfers.initiate({
  account_bank: "044",
  account_number: "0690000031",
  amount: 5000,
  currency: "NGN",
  narration: "Payment for services",
  reference: "unique-transfer-reference",
  beneficiary_name: "John Doe",
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Transfer initiated",
  "data": {
    "id": 1234567,
    "account_number": "0690000031",
    "bank_code": "044",
    "full_name": "John Doe",
    "currency": "NGN",
    "amount": 5000,
    "fee": 25,
    "status": "PENDING",
    "reference": "unique-transfer-reference",
    "narration": "Payment for services",
    "complete_message": "Transfer initiated",
    "requires_approval": 0,
    "is_approved": 1,
    "bank_name": "Access Bank"
  }
}
```

##### Get Transfer Status

```typescript
/**
 * Get transfer status by ID
 */
const transferStatus = await flw.transfers.getStatus({
  id: "1234567",
});
```

##### List Transfers

```typescript
/**
 * List all transfers with optional filters
 */
const transfers = await flw.transfers.list({
  page: 1,
  limit: 20,
  status: "successful",
});
```

### Subscriptions

#### Subscription Plans

The Plans service allows you to create and manage subscription plans.

##### Create Plan

```typescript
/**
 * Create a subscription plan
 */
const plan = await flw.plans.create({
  name: "Monthly Premium Plan",
  amount: 2000,
  interval: "monthly",
  currency: "NGN",
  description: "Monthly premium subscription",
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Plan created",
  "data": {
    "id": 12345,
    "name": "Monthly Premium Plan",
    "amount": 2000,
    "interval": "monthly",
    "currency": "NGN",
    "description": "Monthly premium subscription",
    "status": "active",
    "created_at": "2023-04-10T14:32:45.000Z"
  }
}
```

##### List Plans

```typescript
/**
 * List all plans
 */
const plans = await flw.plans.list({
  page: 1,
  limit: 20,
});
```

##### Get Plan

```typescript
/**
 * Get a specific plan by ID
 */
const plan = await flw.plans.get({
  id: "12345",
});
```

#### Subscriptions

The Subscriptions service allows you to manage subscriptions.

##### List All Subscriptions

```typescript
/**
 * List all subscriptions
 */
const subscriptions = await flw.subscriptions.list({
  page: 1,
  limit: 20,
});
```

##### Get Subscription

```typescript
/**
 * Get a specific subscription by ID
 */
const subscription = await flw.subscriptions.get({
  id: "12345",
});
```

##### Cancel Subscription

```typescript
/**
 * Cancel a subscription
 */
const cancelSubscription = await flw.subscriptions.cancel({
  id: "12345",
});
```

### Verification

#### OTP

The OTP service allows you to generate and validate one-time passwords.

##### Generate OTP

```typescript
/**
 * Generate a one-time password
 */
const otp = await flw.otp.generate({
  length: 6,
  customer: {
    name: "John Doe",
    email: "customer@example.com",
    phone: "08012345678",
  },
  sender: "Flutterwave",
  send: true,
  medium: ["email", "sms"],
  expiry: 5, // minutes
});
```

**Response:**
```json
{
  "status": "success",
  "message": "OTP generated",
  "data": [
    {
      "medium": "email",
      "reference": "FLW-OTP-X12345",
      "otp": "123456",
      "expiry": "2023-04-10T14:37:45.000Z"
    },
    {
      "medium": "sms",
      "reference": "FLW-OTP-X12346",
      "otp": "123456",
      "expiry": "2023-04-10T14:37:45.000Z"
    }
  ]
}
```

##### Validate OTP

```typescript
/**
 * Validate a one-time password
 */
const validateOtp = await flw.otp.validate({
  otp: "123456",
  reference: "FLW-OTP-X12345",
});
```

#### Bill Verification

The Bill Verification service allows you to verify bill payments.

##### Verify Bill Service

```typescript
/**
 * Verify a bill service
 */
const billVerification = await flw.billVerification.verify({
  item_code: "AT099",
  customer: "08012345678",
  service: "airtime",
});
```

### Others

#### Settlements

The Settlements service allows you to manage settlements.

##### List Settlements

```typescript
/**
 * List all settlements
 */
const settlements = await flw.settlements.list({
  page: 1,
  limit: 20,
  from: "2023-01-01",
  to: "2023-12-31",
});
```

##### Get Settlement

```typescript
/**
 * Get a specific settlement by ID
 */
const settlement = await flw.settlements.get({
  id: "12345",
});
```

#### Subaccounts

The Subaccounts service allows you to create and manage subaccounts.

##### Create Subaccount

```typescript
/**
 * Create a subaccount
 */
const subaccount = await flw.subaccounts.create({
  account_bank: "044",
  account_number: "0690000031",
  business_name: "Acme Inc",
  business_email: "business@example.com",
  business_contact: "John Doe",
  business_contact_mobile: "08012345678",
  business_mobile: "08012345678",
  country: "NG",
  split_type: "percentage",
  split_value: 0.5,
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Subaccount created",
  "data": {
    "id": 12345,
    "account_number": "0690000031",
    "account_bank": "044",
    "business_name": "Acme Inc",
    "business_email": "business@example.com",
    "business_contact": "John Doe",
    "business_contact_mobile": "08012345678",
    "business_mobile": "08012345678",
    "country": "NG",
    "split_type": "percentage",
    "split_value": 0.5,
    "subaccount_id": "RS_X12345",
    "bank_name": "Access Bank",
    "created_at": "2023-04-10T14:32:45.000Z"
  }
}
```

##### List Subaccounts

```typescript
/**
 * List all subaccounts
 */
const subaccounts = await flw.subaccounts.list({
  page: 1,
  limit: 20,
});
```

##### Update Subaccount

```typescript
/**
 * Update a subaccount
 */
const updateSubaccount = await flw.subaccounts.update({
  id: "12345",
  business_name: "Updated Acme Inc",
  business_email: "updated@example.com",
});
```

#### Miscellaneous

The Miscellaneous service provides access to utility endpoints.

##### Verify BVN

```typescript
/**
 * Verify a Bank Verification Number (BVN)
 */
const bvnVerification = await flw.misc.verifyBVN({
  bvn: "12345678901",
});
```

##### Resolve Account

```typescript
/**
 * Resolve bank account details
 */
const accountResolution = await flw.misc.resolveAccount({
  account_number: "0690000031",
  account_bank: "044",
});
```

## Type Definitions

### Common Types

```typescript
/**
 * Flutterwave configuration
 */
export interface FlutterwaveConfig {
  secretKey: string;
  timeout?: number; // Milliseconds
}

/**
 * Standard Flutterwave API response
 */
export interface FlutterwaveResponse<T> {
  status: string;
  message: string;
  data: T;
}

/**
 * Flutterwave error response
 */
export interface FlutterwaveErrorResponse {
  status: string;
  message: string;
  code?: string;
  data?: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
```

### Payment Types

```typescript
/**
 * Card payment payload
 */
export interface CardPaymentPayload {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  currency: string;
  amount: number;
  email: string;
  fullname: string;
  tx_ref: string;
  redirect_url: string;
  pin?: string;
  authorization?: {
    mode: string;
    pin?: string;
  };
}

/**
 * Payment link payload
 */
export interface PaymentLinkPayload {
  amount: number;
  currency: string;
  description: string;
  title: string;
  customer: {
    email: string;
    name: string;
    phone_number?: string;
  };
  redirect_url: string;
  logo?: string;
  expires_at?: string;
}

/**
 * Transaction verification result
 */
export interface TransactionVerificationResult {
  id: number;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  status: string;
  payment_type: string;
  created_at: string;
  customer: {
    id: number;
    name: string;
    phone_number: string | null;
    email: string;
  };
}
```

### Financial Account Types

```typescript
/**
 * Virtual account payload
 */
export interface VirtualAccountPayload {
  email: string;
  is_permanent: boolean;
  bvn?: string;
  tx_ref: string;
  first_name: string;
  last_name: string;
  narration?: string;
}

/**
 * Bank details
 */
export interface Bank {
  id: number;
  code: string;
  name: string;
}

/**
 * Transfer payload
 */
export interface TransferPayload {
  account_bank: string;
  account_number: string;
  amount: number;
  currency: string;
  narration: string;
  reference: string;
  beneficiary_name?: string;
}
```

## Error Handling

The SDK uses a standardized error system that extends the native Error class:

```typescript
/**
 * Flutterwave-specific error
 */
export class FlutterwaveError extends Error {
  status: string;
  code?: string;
  data?: unknown;

  constructor(message: string, status: string, code?: string, data?: unknown) {
    super(message);
    this.name = 'FlutterwaveError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
```

To properly handle errors:

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
  } else if (error instanceof Error) {
    console.error("Network or System Error:", error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## Best Practices

### Security

1. **Never expose your secret key**: Keep your Flutterwave secret key secure and never expose it in client-side code.

2. **Use environment variables**: Store your API keys in environment variables or secure secrets management.

```typescript
// Using environment variables
const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});
```

3. **Verify webhook signatures**: Always validate webhook signatures to ensure requests are coming from Flutterwave.

### Performance

1. **Initialize once**: Create the Flutterwave instance once and reuse it across your application.

```typescript
// In a shared module
export const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

// In your service modules
import { flw } from './shared/flutterwave';

export async function processPayment() {
  return flw.charges.card({ /* ... */ });
}
```

2. **Set appropriate timeouts**: Configure timeouts based on your application needs.

3. **Handle rate limiting**: Implement exponential backoff for retries if you encounter rate limiting.

### Error Handling

1. **Graceful degradation**: Always provide fallback behavior when API calls fail.

2. **Detailed logging**: Log detailed error information for debugging while keeping sensitive data secure.

3. **User-friendly messages**: Translate technical errors into user-friendly messages.

### Testing

1. **Use test keys**: Always use Flutterwave test keys for development and testing.

2. **Mock API responses**: Create mock responses for testing to avoid hitting the Flutterwave API.

3. **Test edge cases**: Test error scenarios and edge cases, not just happy paths.

