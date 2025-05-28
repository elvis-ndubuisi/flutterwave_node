# Error Handling in Flutterwave Universal SDK

This guide provides detailed information about error handling in the Flutterwave Universal SDK, including the error system, common error scenarios, and best practices.

## Table of Contents

- [Error System Overview](#error-system-overview)
- [FlutterwaveError Class](#flutterwaveerror-class)
- [Common Error Scenarios](#common-error-scenarios)
- [Error Codes](#error-codes)
- [Best Practices](#best-practices)
- [Error Handling Examples](#error-handling-examples)

## Error System Overview

The Flutterwave Universal SDK uses a structured error handling system to provide consistent and informative error messages across all services. The error system is designed to:

1. **Distinguish between different types of errors**: API errors, network errors, validation errors, etc.
2. **Provide detailed context**: Error messages include relevant information to help diagnose issues
3. **Maintain consistency**: All errors follow a standard structure for easier handling
4. **Support all runtimes**: The error system works consistently across Node.js, Bun, Deno, and edge environments

When an error occurs, the SDK will throw a `FlutterwaveError` with specific details about what went wrong. This allows you to catch and handle different types of errors appropriately.

## FlutterwaveError Class

The `FlutterwaveError` class extends the native JavaScript `Error` class and adds Flutterwave-specific properties:

```typescript
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

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Always set to 'FlutterwaveError' to identify the error type |
| `message` | string | Human-readable description of the error |
| `status` | string | Status indicating the general category of the error (e.g., 'error', 'failed') |
| `code` | string | (Optional) Specific error code from Flutterwave API |
| `data` | unknown | (Optional) Additional data related to the error, if provided by the API |

## Common Error Scenarios

### 1. Authentication Errors

These occur when there are issues with your API keys or authentication credentials.

```typescript
try {
  // API call with invalid secret key
  const flw = new Flutterwave({
    secretKey: "invalid-secret-key",
  });
  
  await flw.transactions.verify({ id: "123456" });
} catch (error) {
  if (error instanceof FlutterwaveError) {
    // Typically has status: 'error' and code related to authentication
    console.error("Authentication error:", error.message);
    // Handle by checking API credentials
  }
}
```

Common authentication error codes:
- `AUTH_FAILED`: Authentication failed
- `INVALID_AUTHORIZATION`: Invalid or missing authorization
- `FORBIDDEN`: Insufficient permissions

### 2. Validation Errors

These occur when request parameters are invalid or missing.

```typescript
try {
  // Missing required fields
  await flw.charges.card({
    // Missing required fields like card_number, cvv, etc.
    amount: 1000,
    currency: "NGN",
    email: "customer@example.com",
  } as any);
} catch (error) {
  if (error instanceof FlutterwaveError) {
    // Usually contains validation details in error.data
    console.error("Validation error:", error.message);
    console.error("Details:", error.data);
    // Handle by fixing the request parameters
  }
}
```

Common validation error codes:
- `VALIDATION_ERROR`: General validation error
- `INVALID_PARAMETER`: A specific parameter is invalid
- `MISSING_PARAMETER`: A required parameter is missing

### 3. Resource Not Found Errors

These occur when attempting to access resources that don't exist.

```typescript
try {
  // Non-existent transaction ID
  await flw.transactions.verify({ id: "non-existent-id" });
} catch (error) {
  if (error instanceof FlutterwaveError) {
    // Usually has status: 'error' and code: 'NOT_FOUND'
    console.error("Resource not found:", error.message);
    // Handle by checking the resource ID or parameters
  }
}
```

### 4. Network Errors

These occur due to connectivity issues or timeouts.

```typescript
try {
  // API call during network interruption
  await flw.transactions.verify({ id: "123456" });
} catch (error) {
  if (error instanceof FlutterwaveError && error.status === "NetworkError") {
    console.error("Network error:", error.message);
    // Handle by implementing retry logic or notifying the user
  }
}
```

### 5. Rate Limiting Errors

These occur when you exceed Flutterwave's API rate limits.

```typescript
try {
  // Multiple rapid API calls
  await Promise.all([
    flw.transactions.verify({ id: "123456" }),
    flw.transactions.verify({ id: "123457" }),
    // ... many more calls
  ]);
} catch (error) {
  if (error instanceof FlutterwaveError && error.code === "RATE_LIMIT_EXCEEDED") {
    console.error("Rate limit exceeded:", error.message);
    // Handle by implementing rate limiting or exponential backoff
  }
}
```

## Error Codes

The SDK handles various error codes returned by the Flutterwave API. Here are some common error codes and their meanings:

| Error Code | Description | Possible Solution |
|------------|-------------|-------------------|
| `AUTH_FAILED` | Authentication failed | Check your API credentials |
| `INVALID_AUTHORIZATION` | Invalid or missing authorization | Verify your secret key |
| `INVALID_PARAMETER` | A parameter in the request is invalid | Check the request parameters |
| `MISSING_PARAMETER` | A required parameter is missing | Add the required parameter |
| `NOT_FOUND` | The requested resource was not found | Verify the resource ID |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded | Implement rate limiting or backoff |
| `INSUFFICIENT_FUNDS` | Insufficient funds for transaction | Customer needs to add funds |
| `TRANSACTION_FAILED` | Transaction processing failed | Check transaction details |
| `CARD_DECLINED` | Card was declined | Try a different payment method |
| `EXPIRED_CARD` | Card has expired | Update card details |
| `PROCESSOR_ERROR` | Payment processor error | Retry or use alternative method |
| `INTERNAL_SERVER_ERROR` | Flutterwave server error | Retry later |
| `NETWORK_ERROR` | Network connectivity issues | Check internet connection |
| `TIMEOUT` | Request timed out | Retry with longer timeout |

## Best Practices

### 1. Always Use Try-Catch Blocks

Always wrap API calls in try-catch blocks to handle errors gracefully:

```typescript
try {
  const result = await flw.transactions.verify({ id: "123456" });
  // Handle successful response
} catch (error) {
  // Handle error
}
```

### 2. Check Error Types

Use `instanceof` to determine if an error is a `FlutterwaveError` or some other type:

```typescript
try {
  const result = await flw.transactions.verify({ id: "123456" });
  // Process result
} catch (error) {
  if (error instanceof FlutterwaveError) {
    // Handle Flutterwave-specific errors
    console.error(`Flutterwave API Error: ${error.message} (${error.code})`);
  } else if (error instanceof Error) {
    // Handle other errors
    console.error(`Unexpected error: ${error.message}`);
  } else {
    // Handle unknown errors
    console.error("Unknown error:", error);
  }
}
```

### 3. Implement Retry Logic for Transient Errors

For certain errors like network issues or rate limiting, implement retry logic with exponential backoff:

```typescript
async function verifyWithRetry(txId: string, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await flw.transactions.verify({ id: txId });
    } catch (error) {
      if (
        error instanceof FlutterwaveError && 
        (error.status === "NetworkError" || error.code === "RATE_LIMIT_EXCEEDED")
      ) {
        retries++;
        if (retries >= maxRetries) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Non-retryable error
        throw error;
      }
    }
  }
}
```

### 4. Log Errors Appropriately

Log errors with sufficient context for debugging, but avoid logging sensitive information:

```typescript
try {
  const result = await flw.transactions.verify({ id: "123456" });
} catch (error) {
  if (error instanceof FlutterwaveError) {
    // Log structured error data
    console.error({
      type: "FlutterwaveApiError",
      message: error.message,
      code: error.code,
      status: error.status,
      // Don't log full error.data as it might contain sensitive info
      transactionId: "123456", // Log context
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error("Unexpected error:", error);
  }
}
```

### 5. Provide User-Friendly Error Messages

Translate technical errors into user-friendly messages:

```typescript
function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof FlutterwaveError) {
    switch (error.code) {
      case "INSUFFICIENT_FUNDS":
        return "Your card has insufficient funds. Please try another card or payment method.";
      case "CARD_DECLINED":
        return "Your card was declined. Please try another card or contact your bank.";
      case "EXPIRED_CARD":
        return "Your card has expired. Please update your card details or try another card.";
      case "RATE_LIMIT_EXCEEDED":
        return "Too many payment attempts. Please try again in a few minutes.";
      default:
        return "An error occurred during payment processing. Please try again.";
    }
  }
  
  return "An unexpected error occurred. Please try again later.";
}
```

## Error Handling Examples

### Basic Error Handling

```typescript
import { Flutterwave, FlutterwaveError } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
});

async function processPayment() {
  try {
    const result = await flw.charges.card({
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
    
    return result;
  } catch (error) {
    if (error instanceof FlutterwaveError) {
      console.error("Flutterwave API Error:", error.message);
      console.error("Error Code:", error.code);
      console.error("Error Status:", error.status);
      
      // Handle specific error types
      if (error.code === "CARD_DECLINED") {
        // Handle declined card
        throw new Error("Your card was declined. Please try another card.");
      } else if (error.code === "INVALID_PARAMETER") {
        // Handle validation errors
        throw new Error("Please check your card details and try again.");
      } else {
        // Handle other API errors
        throw new Error("Payment processing failed. Please try again later.");
      }
    } else if (error instanceof Error) {
      // Handle standard JS errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred. Please try again.");
    } else {
      // Handle unknown errors
      console.error("Unknown error:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  }
}
```

### Error Handling with Async/Await in a React Component

```tsx
import React, { useState } from "react";
import { Flutterwave, FlutterwaveError } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_SECRET_KEY as string,
});

function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(event.currentTarget);
      
      const result = await flw.charges.card({
        card_number: formData.get("card_number") as string,
        cvv: formData.get("cvv") as string,
        expiry_month: formData.get("expiry_month") as string,
        expiry_year: formData.get("expiry_year") as string,
        currency: "NGN",
        amount: Number(formData.get("amount")),
        email: formData.get("email") as string,
        fullname: formData.get("fullname") as string,
        tx_ref: `tx-${Date.now()}`,
        redirect_url: window.location.href,
      });
      
      setSuccess(true);
      console.log("Payment successful:", result);
      
    } catch (error) {
      if (error instanceof FlutterwaveError) {
        // Provide user-friendly error messages based on error code
        switch (error.code) {
          case "CARD_DECLINED":
            setError("Your card was declined. Please try another card.");
            break;
          case "INSUFFICIENT_FUNDS":
            setError("Insufficient funds on your card. Please try another card.");
            break;
          case "EXPIRED_CARD":
            setError("Your card has expired. Please update your card details.");
            break;
          case "INVALID_PARAMETER":
            setError("Please check your card details and try again.");
            break;
          default:
            setError("Payment processing failed. Please try again.");
            console.error("API Error:", error.message, error.code);
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {success ? (
        <div>Payment successful! Thank you for your purchase.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
    </div>
  );
}
```

### Error Handling with Custom Error Classes

For more sophisticated applications, you might want to extend the `FlutterwaveError` with your own custom error classes:

```typescript
// Custom error classes
class PaymentDeclinedError extends FlutterwaveError {
  constructor(message: string, code: string, data?: unknown) {
    super(message, "error", code, data);
    this.name = "PaymentDeclinedError";
  }
}

class ValidationError extends FlutterwaveError {
  constructor(message: string, data?: unknown) {
    super(message, "error", "VALIDATION_ERROR", data);
    this.name = "ValidationError";
  }
}

// Helper function to convert FlutterwaveError to specific error types
function mapFlutterwaveError(error: FlutterwaveError): Error {
  if (["CARD_DECLINED", "INSUFFICIENT_FUNDS", "EXPIRED_CARD"].includes(error.code || "")) {
    return new PaymentDeclinedError(error.message, error.code || "", error.data);
  } else if (error.code === "INVALID_PARAMETER" || error.code === "MISSING_PARAMETER") {
    return new ValidationError(error.message, error.data);
  }
  
  return error;
}

// Usage
try {
  const result = await flw.charges.card({ /* ... */ });
} catch (error) {
  if (error instanceof FlutterwaveError) {
    const mappedError = mapFlutterwaveError(error);
    
    if (mappedError instanceof PaymentDeclinedError) {
      // Handle payment declined
    } else if (mappedError instanceof ValidationError) {
      // Handle validation errors
    } else {
      // Handle other API errors
    }
  } else {
    // Handle other errors
  }
}
```

### Error Handling in Different Environments

#### Node.js

```typescript
import { Flutterwave, FlutterwaveError } from "flutterwave-universal";
import fs from "fs/promises";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
});

async function verifyAndLogTransaction(txId: string) {
  try {
    const result = await flw.transactions.verify({ id: txId });
    
    // Log successful verification
    await fs.appendFile(
      "transaction_log.txt", 
      `SUCCESS [${new Date().toISOString()}] Transaction ${txId} verified: ${result.status}\n`
    );
    
    return result;
  } catch (error) {
    // Log error
    let errorLog = `ERROR [${new Date().toISOString()}] `;
    
    if (error instanceof FlutterwaveError) {
      errorLog += `API Error: ${error.message} (${error.code})\n`;
      
      // Also log to error monitoring service
      // errorMonitoringService.captureException(error);
    } else {
      errorLog += `Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`;
    }
    
    await fs.appendFile("transaction_log.txt", errorLog);
    throw error; // Re-throw for caller to handle
  }
}
```

#### Cloudflare Worker

```typescript
import { Flutterwave, FlutterwaveError } from "flutterwave-universal";

export interface Env {
  FLUTTERWAVE_SECRET_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const flw = new Flutterwave({
      secretKey: env.FLUTTERWAVE_SECRET_KEY,
    });
    
    try {
      const url = new URL(request.url);
      const txId = url.searchParams.get("tx_id");
      
      if (!txId) {
        return new Response("Missing transaction ID", { status: 400 });
      }
      
      const result = await flw.transactions.verify({ id: txId });
      
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      // Determine appropriate status code
      let status = 500;
      let message = "Internal Server Error";
      
      if (error instanceof FlutterwaveError) {
        console.error(`Flutterwave API Error: ${error.message} (${error.code})`);
        
        if (error.code === "NOT_FOUND") {
          status = 404;
          message = "Transaction not found";
        } else if (error.code === "INVALID_PARAMETER") {
          status = 400;
          message = "Invalid transaction ID";
        }
      } else {
        console.error("Unexpected error:", error);
      }
      
      return new Response(message, { status });
    }
  },
};
```

Remember that proper error handling is essential for creating robust applications. By following these best practices and examples, you can build applications that gracefully handle failures and provide a better user experience.

