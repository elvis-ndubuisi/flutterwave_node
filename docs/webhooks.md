# Flutterwave Webhooks Guide

This guide explains how to handle Flutterwave webhooks with the Universal SDK across different runtime environments.

## Table of Contents

- [Introduction](#introduction)
- [Setting Up Webhooks](#setting-up-webhooks)
- [Webhook Signature Verification](#webhook-signature-verification)
- [Event Types](#event-types)
- [Implementation Examples](#implementation-examples)
  - [Node.js](#nodejs)
  - [Express.js](#expressjs)
  - [Next.js](#nextjs)
  - [Cloudflare Workers](#cloudflare-workers)
  - [Vercel Edge Functions](#vercel-edge-functions)
  - [Bun](#bun)
  - [Deno](#deno)
- [Testing Webhooks](#testing-webhooks)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Introduction

Webhooks are HTTP callbacks that allow Flutterwave to notify your application when events occur, such as successful payments, refunds, or failed transactions. This asynchronous communication is essential for keeping your application updated with the latest transaction statuses.

## Setting Up Webhooks

### 1. Register Your Webhook URL

Log into your [Flutterwave Dashboard](https://dashboard.flutterwave.com/) and navigate to **Settings > Webhooks**. Add your webhook endpoint URL:

```
https://your-domain.com/api/flutterwave/webhook
```

### 2. Get Your Webhook Secret

Flutterwave will generate a secret hash for your webhook. This secret is used to verify that incoming webhook requests are actually from Flutterwave. Keep this secret secure and never expose it in client-side code.

### 3. Configure Your Server

Your server needs to:
- Accept POST requests at your webhook URL
- Verify webhook signatures
- Process events based on their type
- Return a 200 HTTP status code to acknowledge receipt

## Webhook Signature Verification

Flutterwave signs each webhook request with a signature in the `verif-hash` header. You should always verify this signature before processing the webhook payload.

```typescript
import { Flutterwave } from "flutterwave-universal";

// Initialize with your Flutterwave configuration
const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

// Verify webhook signature
function isValidWebhook(signature: string, webhookSecret: string): boolean {
  return signature === webhookSecret;
}
```

## Event Types

Flutterwave sends different event types depending on what happened. Here are the common event types:

| Event Type | Description |
|------------|-------------|
| `charge.completed` | Payment has been successfully completed |
| `transfer.completed` | Transfer to a bank account was successful |
| `transfer.failed` | Transfer to a bank account failed |
| `payment.refund` | A refund has been processed |
| `payment_plan.activated` | A payment plan has been activated |
| `subscription.cancelled` | A subscription has been cancelled |
| `account.credited` | Virtual account has been credited |
| `card.authorized` | Card has been successfully authorized |

Each event type has a specific payload structure. The common fields in all webhook payloads include:

```json
{
  "event": "charge.completed",
  "data": {
    "id": 285959875,
    "tx_ref": "your-transaction-reference",
    "flw_ref": "FLW-MOCK-5a61f471608c250c85b6c789faec3649",
    "device_fingerprint": "your-device-fingerprint",
    "amount": 100,
    "currency": "NGN",
    "charged_amount": 100,
    "app_fee": 1.4,
    "merchant_fee": 0,
    "processor_response": "Approved by Financial Institution",
    "auth_model": "PIN",
    "ip": "127.0.0.1",
    "narration": "Payment Example",
    "status": "successful",
    "payment_type": "card",
    "created_at": "2023-04-27T15:31:47.000Z",
    "account_id": 17321,
    "customer": {
      "id": 1677551,
      "name": "John Doe",
      "phone_number": "08012345678",
      "email": "customer@example.com",
      "created_at": "2023-04-27T15:31:47.000Z"
    }
  }
}
```

## Implementation Examples

### Node.js

#### Raw Node.js HTTP Server

```typescript
import http from "http";
import { Flutterwave } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/flutterwave/webhook" && req.method === "POST") {
    const signature = req.headers["verif-hash"];
    
    // Verify signature
    if (!signature || signature !== WEBHOOK_SECRET) {
      res.statusCode = 401;
      res.end("Unauthorized");
      return;
    }

    // Read request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const { event, data } = payload;

        // Process based on event type
        switch (event) {
          case "charge.completed":
            if (data.status === "successful") {
              // Update your database
              await updateTransactionStatus(data.tx_ref, "completed");
              // Fulfill order or provide access to service
              await fulfillOrder(data.tx_ref);
            }
            break;
          
          case "transfer.completed":
            await updateTransferStatus(data.reference, "completed");
            break;
          
          // Handle other event types
        }
        
        // Always respond with 200 to acknowledge receipt
        res.statusCode = 200;
        res.end("Webhook received successfully");
        
      } catch (error) {
        console.error("Error processing webhook:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Your implementation of these functions
async function updateTransactionStatus(txRef: string, status: string) {
  // Update transaction in your database
}

async function fulfillOrder(txRef: string) {
  // Business logic to fulfill the order
}

async function updateTransferStatus(reference: string, status: string) {
  // Update transfer status in your database
}
```

### Express.js

```typescript
import express from "express";
import { Flutterwave } from "flutterwave-universal";

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(express.json());

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

// Webhook endpoint
app.post("/api/flutterwave/webhook", async (req, res) => {
  const signature = req.headers["verif-hash"];
  
  // Verify signature
  if (!signature || signature !== WEBHOOK_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const { event, data } = req.body;

    // Process based on event type
    switch (event) {
      case "charge.completed":
        if (data.status === "successful") {
          // Update your database
          await updateTransactionStatus(data.tx_ref, "completed");
          // Fulfill order or provide access to service
          await fulfillOrder(data.tx_ref);
        }
        break;
      
      case "transfer.completed":
        await updateTransferStatus(data.reference, "completed");
        break;
      
      // Handle other event types
    }
    
    // Always respond with 200 to acknowledge receipt
    return res.status(200).send("Webhook received successfully");
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Your implementation of these functions
async function updateTransactionStatus(txRef: string, status: string) {
  // Update transaction in your database
}

async function fulfillOrder(txRef: string) {
  // Business logic to fulfill the order
}

async function updateTransferStatus(reference: string, status: string) {
  // Update transfer status in your database
}
```

### Next.js

#### API Route (Pages Router)

```typescript
// pages/api/flutterwave/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Flutterwave } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
});

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const signature = req.headers["verif-hash"];
  
  // Verify signature
  if (!signature || signature !== WEBHOOK_SECRET) {
    return res.status(401).end("Unauthorized");
  }

  try {
    const { event, data } = req.body;

    // Process based on event type
    switch (event) {
      case "charge.completed":
        if (data.status === "successful") {
          // Update your database
          await updateTransactionStatus(data.tx_ref, "completed");
          // Fulfill order or provide access to service
          await fulfillOrder(data.tx_ref);
        }
        break;
      
      // Handle other event types
    }
    
    // Always respond with 200 to acknowledge receipt
    return res.status(200).end("Webhook received successfully");
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).end("Internal Server Error");
  }
}

// Your implementation of these functions
async function updateTransactionStatus(txRef: string, status: string) {
  // Update transaction in your database
}

async function fulfillOrder(txRef: string) {
  // Business logic to fulfill the order
}
```

#### App Router

```typescript
// app/api/flutterwave/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Flutterwave } from "flutterwave-universal";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
});

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("verif-hash");
  
  // Verify signature
  if (!signature || signature !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();
    const { event, data } = payload;

    // Process based on event type
    switch (event) {
      case "charge.completed":
        if (data.status === "successful") {
          // Update your database (use your database client)
          await updateTransactionStatus(data.tx_ref, "completed");
          // Fulfill order or provide access to service
          await fulfillOrder(data.tx_ref);
        }
        break;
      
      // Handle other event types
    }
    
    // Always respond with 200 to acknowledge receipt
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Your implementation of these functions
async function updateTransactionStatus(txRef: string, status: string) {
  // Update transaction in your database
}

async function fulfillOrder(txRef: string) {
  // Business logic to fulfill the order
}
```

### Cloudflare Workers

```typescript
// worker.ts
import { Flutterwave } from "flutterwave-universal";

export interface Env {
  FLUTTERWAVE_SECRET_KEY: string;
  FLUTTERWAVE_WEBHOOK_SECRET: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Only process POST requests to /webhook
    if (request.method !== "POST" || !request.url.endsWith("/webhook")) {
      return new Response("Not Found", { status: 404 });
    }

    const signature = request.headers.get("verif-hash");
    
    // Verify signature
    if (!signature || signature !== env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const payload = await request.json();
      const { event, data } = payload;

      // Process based on event type
      switch (event) {
        case "charge.completed":
          if (data.status === "successful") {
            // In Cloudflare Workers, you would typically use KV or D1 for storage
            // or make an API call to your server to update the database
            await sendToYourAPI(data);
          }
          break;
        
        // Handle other event types
      }
      
      // Always respond with 200 to acknowledge receipt
      return new Response("Webhook received successfully", { status: 200 });
      
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

// Send data to your API to update database
async function sendToYourAPI(data: any) {
  const response = await fetch("https://your-api.com/update-transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return await response.json();
}
```

### Vercel Edge Functions

```typescript
// app/api/flutterwave/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

// Enable Edge Runtime
export const runtime = "edge";

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("verif-hash");
  
  // Verify signature
  if (!signature || signature !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();
    const { event, data } = payload;

    // Process based on event type
    switch (event) {
      case "charge.completed":
        if (data.status === "successful") {
          // In Edge Functions, you typically send to another API for database operations
          await fetch("https://your-api.com/update-transaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.API_KEY}`,
            },
            body: JSON.stringify({
              tx_ref: data.tx_ref,
              status: "completed",
              payment_data: data,
            }),
          });
        }
        break;
      
      // Handle other event types
    }
    
    // Always respond with 200 to acknowledge receipt
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### Bun

```typescript
// webhook-server.ts
import { Flutterwave } from "flutterwave-universal";
import { Database } from "bun:sqlite";

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
});

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET || "";

// Initialize database
const db = new Database("transactions.sqlite");
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    tx_ref TEXT PRIMARY KEY,
    status TEXT,
    amount REAL,
    created_at TEXT
  )
`);

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/api/flutterwave/webhook" && req.method === "POST") {
      const signature = req.headers.get("verif-hash");
      
      // Verify signature
      if (!signature || signature !== WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      try {
        const payload = await req.json();
        const { event, data } = payload;

        // Process based on event type
        switch (event) {
          case "charge.completed":
            if (data.status === "successful") {
              // Update database
              db.run(
                "INSERT OR REPLACE INTO transactions (tx_ref, status, amount, created_at) VALUES (?, ?, ?, ?)",
                [data.tx_ref, "completed", data.amount, new Date().toISOString()]
              );
              
              // Additional logic for order fulfillment
            }
            break;
          
          // Handle other event types
        }
        
        // Always respond with 200 to acknowledge receipt
        return new Response("Webhook received successfully", { status: 200 });
        
      } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Webhook server running on port ${server.port}`);
```

### Deno

```typescript
// webhook-server.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { Flutterwave } from "npm:flutterwave-universal";

const flw = new Flutterwave({
  secretKey: Deno.env.get("FLUTTERWAVE_SECRET_KEY") || "",
});

const WEBHOOK_SECRET = Deno.env.get("FLUTTERWAVE_WEBHOOK_SECRET") || "";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/api/flutterwave/webhook" && req.method === "POST") {
    const signature = req.headers.get("verif-hash");
    
    // Verify signature
    if (!signature || signature !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const payload = await req.json();
      const { event, data } = payload;

      // Process based on event type
      switch (event) {
        case "charge.completed":
          if (data.status === "successful") {
            // Update database (using Deno KV or an external database)
            await updateTransaction(data);
          }
          break;
        
        // Handle other event types
      }
      
      // Always respond with 200 to acknowledge receipt
      return new Response("Webhook received successfully", { status: 200 });
      
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  
  return new Response("Not Found", { status: 404 });
}

async function updateTransaction(data: any) {
  // Implementation using Deno KV or an external database
  const kv = await Deno.openKv();
  await kv.set(["transactions", data.tx_ref], {
    status: "completed",
    amount: data.amount,
    created_at: new Date().toISOString(),
  });
}

// Start the server
serve(handler, { port: 3000 });
console.log("Webhook server running on port 3000");
```

## Testing Webhooks

### Using Flutterwave's Test Environment

1. Switch to Flutterwave's test environment in your dashboard
2. Perform test transactions to trigger webhooks
3. Flutterwave will send test webhook events to your registered webhook URL

### Local Development with Forwarding Tools

For local development, you can use services like [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/) to expose your local server to the internet:

```bash
# Using ngrok
ngrok http 3000

# Using localtunnel
npx localtunnel --port 3000
```

Then update your webhook URL in the Flutterwave dashboard to the temporary URL provided by these services.

### Manually Testing with Sample Payloads

You can also test your webhook handler with sample payloads:

```bash
curl -X POST http://localhost:3000/api/flutterwave/webhook \
  -H "Content-Type: application/json" \
  -H "verif-hash: your-webhook-secret" \
  -d '{
    "event": "charge.completed",
    "data": {
      "id": 285959875,
      "tx_ref": "test-tx-ref-123",
      "flw_ref": "FLW-MOCK-5a61f471608c250c85b6c789faec3649",
      "amount": 100,
      "currency": "NGN",
      "charged_amount": 100,
      "status": "successful",
      "payment_type": "card",
      "customer": {
        "id": 1677551,
        "name": "John Doe",
        "email": "customer@example.com"
      }
    }
  }'
```

## Security Best Practices

### 1. Always Verify Webhook Signatures

Never skip signature verification as it's the only way to ensure the webhook is coming from Flutterwave.

### 2. Use Environment Variables for Secrets

Never hardcode your webhook secret or API keys in your code:

```typescript
// Good
const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

// Bad
const WEBHOOK_SECRET = "your-actual-secret-here";
```

### 3. Implement Idempotency

Webhooks can sometimes be sent multiple times for the same event. Implement idempotency to ensure you don't process the same event twice:

```typescript
async function processWebhook(data: any) {
  // Check if we've already processed this transaction
  const existingTransaction = await db.get(
    "SELECT * FROM transactions WHERE tx_ref = ?",
    [data.tx_ref]
  );
  
  if (existingTransaction && existingTransaction.status === "completed") {
    // Already processed, do nothing
    return;
  }
  
  // Process the transaction
  await db.run(
    "INSERT OR REPLACE INTO transactions (tx_ref, status, amount, created_at) VALUES (?, ?, ?, ?)",
    [data.tx_ref, "completed", data.amount, new Date().toISOString()]
  );
  
  // Additional logic
}
```

### 4. Implement Proper Error Handling

Always catch errors and log them for debugging, but don't expose sensitive information in error responses:

```typescript
try {
  // Process webhook
} catch (error) {
  // Log detailed error internally
  console.error("Webhook processing error:", error);
  
  // Return generic error to client
  return new Response("Internal Server Error", { status: 500 });
}
```

### 5. Set Appropriate Response Timeouts

Flutterwave expects a response within 10 seconds. If your webhook processing takes longer, acknowledge the webhook immediately and then process it asynchronously:

```typescript
// Acknowledge webhook immediately
const response = new Response("Webhook received", { status: 200 });

// Process asynchronously
ctx.waitUntil(
  (async () => {
    try {
      await processWebhookData(data);
    } catch (error) {
      console.error("Async webhook processing error:", error);
    }
  })()
);

return response;
```

### 6. Restrict Webhook Access

Consider implementing IP whitelisting if your server supports it, allowing webhooks only from Flutterwave's IP ranges.

## Troubleshooting

### Common Issues

1. **Webhook not being received**
   - Check your webhook URL in the Flutterwave dashboard
   - Ensure your server is publicly accessible
   - Check firewall or network rules that might block incoming requests

2. **Signature verification fails**
   - Ensure you're using the correct webhook secret
   - Check for any character encoding issues
   - Verify you're accessing the header correctly (header names are case-insensitive)

3. **Timeouts**
   - If your processing takes too long, implement async processing
   - Ensure your database operations are efficient

4. **Duplicate processing**
   - Implement idempotency checks
   - Use transaction IDs as unique identifiers

### Debugging Tips

1. **Log headers and payloads** (temporarily during development)
   ```typescript
   console.log("Headers:", Object.fromEntries(req.headers.entries()));
   console.log("Payload:", await req.json());
   ```

2. **Check Flutterwave dashboard**
   - The dashboard shows webhook delivery attempts and responses

3. **Implement a webhook log**
   - Store all incoming webhooks for audit and debugging

