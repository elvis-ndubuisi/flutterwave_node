# Runtime Support Guide for Flutterwave Universal SDK

This guide provides detailed information about using the Flutterwave Universal SDK across different JavaScript runtimes, including setup instructions, best practices, and examples.

## Table of Contents

- [Runtime Compatibility Overview](#runtime-compatibility-overview)
- [Node.js](#nodejs)
- [Bun](#bun)
- [Deno](#deno)
- [Cloudflare Workers](#cloudflare-workers)
- [Vercel Edge Functions](#vercel-edge-functions)
- [Netlify Edge Functions](#netlify-edge-functions)
- [Performance Considerations](#performance-considerations)
- [Environment-Specific Troubleshooting](#environment-specific-troubleshooting)

## Runtime Compatibility Overview

The Flutterwave Universal SDK is designed to work seamlessly across multiple JavaScript runtimes. Here's a summary of the compatibility status for each supported runtime:

| Runtime | Compatibility | Minimum Version | Import Method |
|---------|---------------|----------------|---------------|
| Node.js | ✅ Full | v16.0.0+ | ESM or CommonJS |
| Bun | ✅ Full | v1.0.0+ | ESM |
| Deno | ✅ Full | v1.26.0+ | npm: specifier |
| Cloudflare Workers | ✅ Full | N/A | ESM |
| Vercel Edge Functions | ✅ Full | N/A | ESM |
| Netlify Edge Functions | ✅ Full | N/A | ESM |
| AWS Lambda | ✅ Full | Node.js 16+ | ESM or CommonJS |
| Browser (direct) | ❌ Not supported | N/A | N/A |

The SDK is built on modern standards and utilizes:
- Native `fetch` API
- ES Modules and CommonJS compatibility
- TypeScript for strong typing
- Zero runtime dependencies

## Node.js

### Setup and Installation

```bash
# Using npm
npm install flutterwave-universal

# Using yarn
yarn add flutterwave-universal

# Using pnpm
pnpm add flutterwave-universal
```

### Basic Usage

```typescript
// ESM
import { Flutterwave } from 'flutterwave-universal';

// CommonJS
const { Flutterwave } = require('flutterwave-universal');

// Initialize the SDK
const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  timeout: 30000, // Optional: 30 seconds
});

// Make API calls
async function verifyTransaction(txId) {
  try {
    const result = await flw.transactions.verify({ id: txId });
    console.log('Transaction verified:', result);
    return result;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw error;
  }
}
```

### Best Practices for Node.js

1. **Use environment variables for sensitive information**:
   ```typescript
   // .env file
   FLUTTERWAVE_SECRET_KEY=your_secret_key_here

   // app.js
   import dotenv from 'dotenv';
   dotenv.config();

   const flw = new Flutterwave({
     secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
   });
   ```

2. **Reuse the Flutterwave instance**:
   ```typescript
   // services/flutterwave.js
   import { Flutterwave } from 'flutterwave-universal';

   export const flw = new Flutterwave({
     secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
   });

   // In other files
   import { flw } from './services/flutterwave';
   ```

3. **Handle errors properly**:
   ```typescript
   try {
     const result = await flw.transactions.verify({ id: txId });
     return result;
   } catch (error) {
     // Log and handle errors
     console.error('Error:', error);
     throw error; // or handle appropriately
   }
   ```

4. **Use async/await for cleaner code**:
   ```typescript
   async function processPayment(paymentData) {
     // This is cleaner than using promises with .then().catch()
     try {
       const result = await flw.charges.card(paymentData);
       return result;
     } catch (error) {
       // Handle errors
     }
   }
   ```

### Example: Express.js API

```typescript
import express from 'express';
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

const app = express();
app.use(express.json());

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

// Create payment endpoint
app.post('/api/payments', async (req, res) => {
  try {
    const result = await flw.charges.card(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof FlutterwaveError) {
      res.status(400).json({ 
        success: false, 
        error: error.message,
        code: error.code 
      });
    } else {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
});

// Verify transaction endpoint
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const result = await flw.transactions.verify({ id: req.params.id });
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof FlutterwaveError) {
      res.status(400).json({ 
        success: false, 
        error: error.message,
        code: error.code 
      });
    } else {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Known Limitations in Node.js

- No significant limitations for Node.js environments
- For older Node.js versions (< 16.0.0), you might need to use a fetch polyfill

## Bun

### Setup and Installation

```bash
bun add flutterwave-universal
```

### Basic Usage

```typescript
import { Flutterwave } from 'flutterwave-universal';

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

// Example function to create a payment link
export async function createPaymentLink(data) {
  try {
    const result = await flw.paymentLinks.create(data);
    return result;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}
```

### Best Practices for Bun

1. **Leverage Bun's built-in tools**:
   ```typescript
   // Use Bun's built-in .env support
   const flw = new Flutterwave({
     secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
   });
   
   // Use Bun's built-in SQLite for database operations
   import { Database } from 'bun:sqlite';
   
   const db = new Database('transactions.db');
   db.query(`CREATE TABLE IF NOT EXISTS transactions (
     id TEXT PRIMARY KEY,
     amount REAL,
     status TEXT,
     created_at TEXT
   )`);
   
   async function saveTransaction(tx) {
     db.query(`INSERT INTO transactions VALUES (?, ?, ?, ?)`, [
       tx.id,
       tx.amount,
       tx.status,
       new Date().toISOString()
     ]);
   }
   ```

2. **Take advantage of Bun's performance**:
   ```typescript
   // Bun's fast startup times make it ideal for serverless
   export default {
     port: 3000,
     fetch(req) {
       // Handle request
     }
   };
   ```

### Example: Bun HTTP Server

```typescript
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

const flw = new Flutterwave({
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
});

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle payment creation
    if (url.pathname === '/api/payments' && req.method === 'POST') {
      try {
        const body = await req.json();
        const result = await flw.charges.card(body);
        
        return new Response(JSON.stringify({ success: true, data: result }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        const status = error instanceof FlutterwaveError ? 400 : 500;
        const message = error instanceof Error ? error.message : 'Unknown error';
        
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    // Handle transaction verification
    if (url.pathname.startsWith('/api/transactions/') && req.method === 'GET') {
      try {
        const id = url.pathname.split('/').pop();
        const result = await flw.transactions.verify({ id });
        
        return new Response(JSON.stringify({ success: true, data: result }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        const status = error instanceof FlutterwaveError ? 400 : 500;
        const message = error instanceof Error ? error.message : 'Unknown error';
        
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
```

### Known Limitations in Bun

- As Bun evolves, there may be minor compatibility issues with newer versions
- Bun's ecosystem is still growing, so some tools you might use alongside the SDK may not have Bun-specific optimizations

## Deno

### Setup and Installation

Since Deno can import npm packages directly, you can use the `npm:` specifier:

```typescript
import { Flutterwave } from 'npm:flutterwave-universal';
```

### Basic Usage

```typescript
import { Flutterwave } from 'npm:flutterwave-universal';

// Load environment variables from .env file (requires permission)
import 'https://deno.land/std/dotenv/load.ts';

const flw = new Flutterwave({
  secretKey: Deno.env.get('FLUTTERWAVE_SECRET_KEY') || '',
});

// Example function to create a virtual account
export async function createVirtualAccount(customerData) {
  try {
    const result = await flw.virtualAccounts.create(customerData);
    return result;
  } catch (error) {
    console.error('Error creating virtual account:', error);
    throw error;
  }
}
```

### Best Practices for Deno

1. **Handle permissions explicitly**:
   ```typescript
   // Request environment access explicitly
   // Run with: deno run --allow-env --allow-net your-script.ts
   const flw = new Flutterwave({
     secretKey: Deno.env.get('FLUTTERWAVE_SECRET_KEY') || '',
   });
   ```

2. **Use Deno's built-in features**:
   ```typescript
   // Use Deno's native fetch
   // Use Deno.env for environment variables
   // Use Deno's built-in testing
   import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
   
   Deno.test('creates virtual account', async () => {
     const result = await createVirtualAccount({
       email: 'test@example.com',
       is_permanent: true,
       // other required fields
     });
     assertEquals(typeof result.account_number, 'string');
   });
   ```

3. **Use Deno Deploy for hosting**:
   ```typescript
   // Deno Deploy ready code
   import { serve } from 'https://deno.land/std/http/server.ts';
   import { Flutterwave } from 'npm:flutterwave-universal';
   
   const flw = new Flutterwave({
     secretKey: Deno.env.get('FLUTTERWAVE_SECRET_KEY') || '',
   });
   
   serve(async (req) => {
     // Your API logic here
   });
   ```

### Example: Deno HTTP Server

```typescript
// server.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { Flutterwave, FlutterwaveError } from 'npm:flutterwave-universal';

const flw = new Flutterwave({
  secretKey: Deno.env.get('FLUTTERWAVE_SECRET_KEY') || '',
});

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Handle payment creation
  if (url.pathname === '/api/payments' && req.method === 'POST') {
    try {
      const body = await req.json();
      const result = await flw.charges.card(body);
      
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const status = error instanceof FlutterwaveError ? 400 : 500;
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      return new Response(
        JSON.stringify({ success: false, error: message }),
        {
          status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  // Handle transaction verification
  if (url.pathname.startsWith('/api/transactions/') && req.method === 'GET') {
    try {
      const id = url.pathname.split('/').pop() || '';
      const result = await flw.transactions.verify({ id });
      
      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      const status = error instanceof FlutterwaveError ? 400 : 500;
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      return new Response(
        JSON.stringify({ success: false, error: message }),
        {
          status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  return new Response('Not Found', { status: 404 });
}

serve(handler, { port: 8000 });
console.log('Server running on http://localhost:8000');
```

To run the server:

```bash
deno run --allow-net --allow-env server.ts
```

### Known Limitations in Deno

- Requires the `--allow-net` permission to make HTTP requests to the Flutterwave API
- Requires the `--allow-env` permission to access environment variables
- Import via npm specifier may have minor performance overhead compared to native Deno modules

## Cloudflare Workers

### Setup and Installation

1. Create a new Worker project:

```bash
# Using Wrangler CLI
wrangler init flutterwave-worker
cd flutterwave-worker
```

2. Install the SDK:

```bash
npm install flutterwave-universal
```

3. Configure wrangler.toml:

```toml
name = "flutterwave-worker"
main = "src/index.ts"
compatibility_date = "2023-05-18"

[vars]
# This is for local development only
FLUTTERWAVE_SECRET_KEY = "your_test_key_here"

# For production, use Cloudflare's secret management
# wrangler secret put FLUTTERWAVE_SECRET_KEY
```

### Basic Usage

```typescript
// src/index.ts
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export interface Env {
  FLUTTERWAVE_SECRET_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const flw = new Flutterwave({
      secretKey: env.FLUTTERWAVE_SECRET_KEY,
    });
    
    // Your Worker logic here
    // ...
    
    try {
      const result = await flw.transactions.list({ page: 1, limit: 10 });
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  },
};
```

### Best Practices for Cloudflare Workers

1. **Use Cloudflare secrets for sensitive data**:
   ```bash
   # From the command line
   wrangler secret put FLUTTERWAVE_SECRET_KEY
   # Then enter your secret key when prompted
   ```

2. **Use appropriate caching strategies**:
   ```typescript
   // Cache non-sensitive, rarely changing data
   export default {
     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
       // Check cache first for bank list
       const cacheKey = 'flutterwave:banks:NG';
       const cache = caches.default;
       let response = await cache.match(cacheKey);
       
       if (!response) {
         const flw = new Flutterwave({
           secretKey: env.FLUTTERWAVE_SECRET_KEY,
         });
         
         // Fetch banks
         const banks = await flw.banks.list({ country: 'NG' });
         
         // Create a response and cache it (1 day)
         response = new Response(JSON.stringify(banks), {
           headers: {
             'Content-Type': 'application/json',
             'Cache-Control': 'public, max-age=86400',
           },
         });
         
         ctx.waitUntil(cache.put(cacheKey, response.clone()));
       }
       
       return response;
     },
   };
   ```

3. **Handle asynchronous processing efficiently**:
   ```typescript
   export default {
     async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
       // For long-running operations, return a response immediately
       // and continue processing in the background
       if (request.url.includes('/api/webhook')) {
         // Process webhook asynchronously
         const payload = await request.json();
         
         // Respond immediately
         const response = new Response('Webhook received', { status: 200 });
         
         // Process in background
         ctx.waitUntil(
           (async () => {
             try {
               // Process webhook payload
               // ...
             } catch (error) {
               console.error('Webhook processing error:', error);
             }
           })()
         );
         
         return response;
       }
       
       // Other routes...
     },
   };
   ```

### Example: Complete Cloudflare Worker for Payment Processing

```typescript
// src/index.ts
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export interface Env {
  FLUTTERWAVE_SECRET_KEY: string;
  FLUTTERWAVE_WEBHOOK_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const flw = new Flutterwave({
      secretKey: env.FLUTTERWAVE_SECRET_KEY,
    });
    
    // CORS preflight handler
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Process payments
    if (url.pathname === '/api/payments' && request.method === 'POST') {
      try {
        const payload = await request.json();
        const result = await flw.charges.card(payload);
        
        return new Response(JSON.stringify({ success: true, data: result }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        const status = error instanceof FlutterwaveError ? 400 : 500;
        const message = error instanceof Error ? error.message : 'Unknown error';
        
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }
    
    // Webhook handler
    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      const signature = request.headers.get('verif-hash');
      
      if (!signature || signature !== env.FLUTTERWAVE_WEBHOOK_SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      // Process webhook asynchronously
      const payload = await request.json();
      
      // Return response immediately
      const response = new Response('Webhook received', { status: 200 });
      
      // Process in background
      ctx.waitUntil(
        (async () => {
          try {
            const { event, data } = payload;
            
            // Process based on event type
            switch (event) {
              case 'charge.completed':
                if (data.status === 'successful') {
                  // Update transaction in your database
                  // You could use Cloudflare KV, D1, or an external API
                  await fetch('https://your-api.com/update-transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                }
                break;
                
              // Handle other events
            }
          } catch (error) {
            console.error('Webhook processing error:', error);
          }
        })()
      );
      
      return response;
    }
    
    // Verify transaction
    if (url.pathname.startsWith('/api/transactions/') && request.method === 'GET') {
      try {
        const id = url.pathname.split('/').pop() || '';
        const result = await flw.transactions.verify({ id });
        
        return new Response(JSON.stringify({ success: true, data: result }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        const status = error instanceof FlutterwaveError ? 400 : 500;
        const message = error instanceof Error ? error.message : 'Unknown error';
        
        return new Response(
          JSON.stringify({ success: false, error: message }),
          {
            status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }
    
    return new Response('Not Found', { status: 404 });
  },
};
```

### Known Limitations in Cloudflare Workers

- Cloudflare Workers have a CPU time limit (10-50ms on free plan, up to 30 seconds on paid plans)
- Limited memory (128MB) and environment size restrictions
- No access to the filesystem
- For database operations, you'll need to use Cloudflare's KV, D1, or external APIs

## Vercel Edge Functions

### Setup and Installation

1. Set up a Next.js project with Edge Runtime support:

```bash
npx create-next-app@latest my-flutterwave-app
cd my-flutterwave-app
```

2. Install the SDK:

```bash
npm install flutterwave-universal
```

### Basic Usage

```typescript
// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

// Enable Edge Runtime
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const flw = new Flutterwave({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
  });
  
  try {
    const payload = await request.json();
    const result = await flw.charges.card(payload);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
```

### Best Practices for Vercel Edge Functions

1. **Use environment variables**:
   - Add your Flutterwave secret key to Vercel environment variables
   - For local development, use `.env.local`

2. **Optimize response times**:
   ```typescript
   // Optimize by specifying only needed fields
   export async function GET(request: NextRequest) {
     const flw = new Flutterwave({
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
     });
     
     try {
       // Only fetch minimal data needed for initial render
       const result = await flw.transactions.list({ 
         page: 1, 
         limit: 10,
         // Specify only fields you need
       });
       
       return NextResponse.json(result);
     } catch (error) {
       // Handle errors
     }
   }
   ```

3. **Use incremental static regeneration (ISR) for semi-static data**:
   ```typescript
   // pages/api/banks/[country].js (Pages Router)
   export default async function handler(req, res) {
     const flw = new Flutterwave({
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
     });
     
     try {
       const banks = await flw.banks.list({ country: req.query.country });
       res.setHeader('Cache-Control', 's-maxage=86400');
       res.status(200).json(banks);
     } catch (error) {
       res.status(500).json({ error: 'Failed to load banks' });
     }
   }
   ```

### Example: Complete Next.js App Router API

```typescript
// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const flw = new Flutterwave({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
  });
  
  try {
    const payload = await request.json();
    const result = await flw.charges.card(payload);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}

// app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const flw = new Flutterwave({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY as string,
  });
  
  try {
    const result = await flw.transactions.verify({ id: params.id });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}

// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('verif-hash');
  const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
  
  if (!signature || signature !== webhookSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const payload = await request.json();
    const { event, data } = payload;
    
    // Process the webhook
    // For database operations, you would typically use:
    // 1. Vercel Postgres, MySQL, or other DB integrations
    // 2. External API calls to your own service
    
    // Example: call your own API to process the webhook
    if (event === 'charge.completed' && data.status === 'successful') {
      // In Edge Functions, we can't use traditional databases directly
      // So we forward the data to another endpoint
      await fetch('https://your-api.com/update-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          tx_ref: data.tx_ref,
          status: 'completed',
          payment_data: data,
        }),
      });
    }
    
    return NextResponse.json(
      { message: 'Webhook received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Known Limitations in Vercel Edge Functions

- Edge Functions have execution time limits (typically 30 seconds)
- Limited memory compared to traditional Node.js deployments
- For database operations, you should use Vercel's database integrations or external APIs
- Some advanced Node.js features may not be available in the Edge Runtime

## Netlify Edge Functions

### Setup and Installation

1. Create or use an existing Netlify site:

```bash
# Create a new Netlify site with the Netlify CLI
npm install -g netlify-cli
netlify init
```

2. Install the SDK:

```bash
npm install flutterwave-universal
```

3. Create an Edge Function:

```bash
# Create the netlify/edge-functions directory
mkdir -p netlify/edge-functions
```

4. Configure netlify.toml:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[edge_functions]]
  path = "/api/payments"
  function = "payments"

[[edge_functions]]
  path = "/api/transactions/*"
  function = "transactions"

[[edge_functions]]
  path = "/api/webhook"
  function = "webhook"

[dev]
  command = "npm run dev"
```

### Basic Usage

```typescript
// netlify/edge-functions/payments.ts
import { Context } from "https://edge.netlify.com";
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export default async (request: Request, context: Context) => {
  const flw = new Flutterwave({
    secretKey: Netlify.env.get("FLUTTERWAVE_SECRET_KEY") || "",
  });
  
  try {
    const payload = await request.json();
    const result = await flw.charges.card(payload);
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
```

### Best Practices for Netlify Edge Functions

1. **Use environment variables for sensitive data**:
   - Add your Flutterwave secret key to Netlify environment variables in the Netlify dashboard
   - Access them using `Netlify.env.get("VARIABLE_NAME")`

2. **Implement proper CORS headers**:
   ```typescript
   // Handle CORS
   if (request.method === "OPTIONS") {
     return new Response(null, {
       headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
         "Access-Control-Allow-Headers": "Content-Type, Authorization",
       },
     });
   }
   ```

3. **Utilize Netlify's geo-location data**:
   ```typescript
   // Use geo data for regional customization
   export default async (request: Request, context: Context) => {
     const countryCode = context.geo?.country?.code || "NG";
     
     // Maybe use country code to fetch local banks
     const flw = new Flutterwave({
       secretKey: Netlify.env.get("FLUTTERWAVE_SECRET_KEY") || "",
     });
     
     const banks = await flw.banks.list({ country: countryCode });
     // ...
   };
   ```

### Example: Complete Netlify Edge Functions Setup

```typescript
// netlify/edge-functions/payments.ts
import { Context } from "https://edge.netlify.com";
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export default async (request: Request, context: Context) => {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const flw = new Flutterwave({
    secretKey: Netlify.env.get("FLUTTERWAVE_SECRET_KEY") || "",
  });
  
  try {
    const payload = await request.json();
    const result = await flw.charges.card(payload);
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

// netlify/edge-functions/transactions.ts
import { Context } from "https://edge.netlify.com";
import { Flutterwave, FlutterwaveError } from 'flutterwave-universal';

export default async (request: Request, context: Context) => {
  // Handle CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const flw = new Flutterwave({
    secretKey: Netlify.env.get("FLUTTERWAVE_SECRET_KEY") || "",
  });
  
  try {
    // Extract transaction ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    const result = await flw.transactions.verify({ id });
    
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const status = error instanceof FlutterwaveError ? 400 : 500;
    const message = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

// netlify/edge-functions/webhook.ts
import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const signature = request.headers.get("verif-hash");
  const webhookSecret = Netlify.env.get("FLUTTERWAVE_WEBHOOK_SECRET");
  
  if (!signature || signature !== webhookSecret) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  try {
    const payload = await request.json();
    const { event, data } = payload;
    
    // Process webhook data
    // In Netlify Edge, you'll likely need to forward this to another service
    // that can update your database
    if (event === "charge.completed" && data.status === "successful") {
      await fetch("https://your-api.com/update-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Netlify.env.get("API_KEY")}`,
        },
        body: JSON.stringify({
          tx_ref: data.tx_ref,
          status: "completed",
          payment_data: data,
        }),
      });
    }
    
    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
```

### Known Limitations in Netlify Edge Functions

- Execution time limit of 50ms in the free tier (up to 5 seconds on paid plans)
- Limited memory available (128MB)
- No direct database access (need to use external APIs or Netlify integrations)
- Not all Node.js APIs are available

## Performance Considerations

The Flutterwave Universal SDK is designed to be lightweight and efficient across all supported runtimes. Here are some performance optimization strategies to consider:

### SDK Initialization

- **Reuse SDK instances**: Initialize the SDK once and reuse it for multiple requests
  ```typescript
  // GOOD: Initialize once
  const flw = new Flutterwave({ secretKey: process.env.FLUTTERWAVE_SECRET_KEY });
  
  // BAD: Re-initialize for each request
  app.get('/api/banks', async (req, res) => {
    const flw = new Flutterwave({ secretKey: process.env.FLUTTERWAVE_SECRET_KEY });
    // ...
  });
  ```

- **Lazy loading services**: Only initialize services when needed for extremely memory-constrained environments
  ```typescript
  // Only initialize services you need
  const { banks, transactions } = new Flutterwave({ 
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY 
  });
  ```

### API Requests

- **Set appropriate timeouts**: Configure timeouts based on your application needs and the runtime constraints
  ```typescript
  const flw = new Flutterwave({
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    timeout: 10000, // 10 seconds
  });
  ```

- **Minimize request payload size**: Only include necessary fields in your requests
  ```typescript
  // GOOD: Include only necessary fields
  const banks = await flw.banks.list({ country: 'NG' });
  
  // BAD: Including unnecessary details
  const banks = await flw.banks.list({
    country: 'NG',
    unnecessaryField1: 'value',
    unnecessaryField2: 'value',
  });
  ```

### Caching Strategies

- **Cache relatively static data**: Bank lists, supported currencies, and other reference data changes infrequently
  ```typescript
  // Example with Node.js/Express using memory cache
  const cache = new Map();
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  
  app.get('/api/banks/:country', async (req, res) => {
    const cacheKey = `banks:${req.params.country}`;
    
    // Check cache
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      
      // Check if cache is still valid
      if (Date.now() - timestamp < CACHE_TTL) {
        return res.json(data);
      }
    }
    
    // Fetch fresh data
    try {
      const banks = await flw.banks.list({ country: req.params.country });
      
      // Update cache
      cache.set(cacheKey, {
        data: banks,
        timestamp: Date.now(),
      });
      
      res.json(banks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch banks' });
    }
  });
  ```

- **Use runtime-specific caching mechanisms**: Each runtime has its own caching capabilities
  - **Cloudflare Workers**: Use Cloudflare Cache API
  - **Vercel/Netlify**: Use cached responses with appropriate Cache-Control headers
  - **Node.js**: Use Redis, Memcached, or in-memory caching

### Memory Management

- **Minimize memory usage in constrained environments**: For edge functions, optimize memory usage
  ```typescript
  // GOOD: Process data in chunks for large datasets
  async function processLargeTransactionList() {
    let page = 1;
    const pageSize = 20;
    let hasMore = true;
    
    while (hasMore) {
      const transactions = await flw.transactions.list({
        page,
        limit: pageSize,
      });
      
      // Process this batch
      for (const transaction of transactions) {
        await processTransaction(transaction);
      }
      
      // Check if there are more transactions
      hasMore = transactions.length === pageSize;
      page++;
    }
  }
  
  // BAD: Fetching all transactions at once
  async function processAllTransactions() {
    const transactions = await flw.transactions.list({
      page: 1,
      limit: 1000, // Very large limit
    });
    
    // Process all at once
    for (const transaction of transactions) {
      await processTransaction(transaction);
    }
  }
  ```

### Runtime-Specific Optimizations

- **Node.js**: Use Node.js clustering to handle more requests
- **Cloudflare Workers**: Leverage Cloudflare's global network with proper caching
- **Vercel/Netlify Edge Functions**: Implement appropriate regional routing and caching
- **Bun**: Take advantage of Bun's fast startup time and SQLite integration

## Environment-Specific Troubleshooting

### Node.js

#### Common Issues

1. **"fetch is not defined" error**
   - **Problem**: Using Node.js version below 16.8.0 without a fetch polyfill
   - **Solution**: Upgrade Node.js to v16.8.0+ or install a fetch polyfill:
     ```bash
     npm install node-fetch
     ```
     ```typescript
     // Add at the top of your entry file
     import fetch from 'node-fetch';
     global.fetch = fetch;
     ```

2. **Timeout errors when making API calls**
   - **Problem**: Default timeout might be too short for some operations
   - **Solution**: Increase the timeout in the Flutterwave constructor:
     ```typescript
     const flw = new Flutterwave({
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
       timeout: 60000, // 60 seconds
     });
     ```

3. **Memory leaks in long-running applications**
   - **Problem**: Improper handling of SDK instances in server applications
   - **Solution**: Initialize the SDK once at application startup:
     ```typescript
     // server.js
     import express from 'express';
     import { Flutterwave } from 'flutterwave-universal';
     
     // Initialize once
     const flw = new Flutterwave({
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
     });
     
     const app = express();
     
     // Use the same instance in routes
     app.get('/api/banks', async (req, res) => {
       try {
         const banks = await flw.banks.list({ country: 'NG' });
         res.json(banks);
       } catch (error) {
         res.status(500).json({ error: error.message });
       }
     });
     ```

### Bun

#### Common Issues

1. **Type definition issues**
   - **Problem**: TypeScript errors when importing the SDK in Bun
   - **Solution**: Ensure your `tsconfig.json` includes appropriate library definitions:
     ```json
     {
       "compilerOptions": {
         "lib": ["ESNext"],
         "module": "ESNext",
         "target": "ESNext",
         "moduleResolution": "bundler",
         "strict": true
       }
     }
     ```

2. **SQLite integration issues**
   - **Problem**: Errors when using Bun's SQLite with Flutterwave SDK
   - **Solution**: Ensure proper error handling between database operations and API calls:
     ```typescript
     import { Database } from 'bun:sqlite';
     import { Flutterwave } from 'flutterwave-universal';
     
     const db = new Database('transactions.db');
     const flw = new Flutterwave({
       secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
     });
     
     // Create table if not exists
     db.run(`
       CREATE TABLE IF NOT EXISTS transactions (
         id TEXT PRIMARY KEY,
         amount REAL,
         status TEXT,
         created_at TEXT
       )
     `);
     
     // Wrap database operations in try/catch
     async function saveTransaction(tx) {
       try {
         db.run(
           `INSERT INTO transactions VALUES (?, ?, ?, ?)`,
           [tx.id, tx.amount, tx.status, new Date().toISOString()]
         );
       } catch (error) {
         console.error('Database error:', error);
         // Handle error appropriately
       }
     }
     ```

### Deno

#### Common Issues

1. **Permission errors**
   - **Problem**: Missing permissions when making API requests
   - **Solution**: Run with the necessary permissions:
     ```bash
     deno run --allow-net --allow-env your-script.ts
     ```

2. **NPM import specifier issues**
   - **Problem**: Errors when importing from npm
   - **Solution**: Use the correct npm specifier format:
     ```typescript
     import { Flutterwave } from 'npm:flutterwave-universal';
     ```

3. **Environment variable access**
   - **Problem**: Cannot access environment variables
   - **Solution**: Use Deno's env API with proper permissions:
     ```typescript
     // Load .env file
     import "https://deno.land/std/dotenv/load.ts";
     
     const secretKey = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
     if (!secretKey) {
       throw new Error("FLUTTERWAVE_SECRET_KEY environment variable is required");
     }
     
     const flw = new Flutterwave({ secretKey });
     ```

### Cloudflare Workers

#### Common Issues

1. **CPU time exceeded errors**
   - **Problem**: Worker exceeds CPU time limit (especially on free tier)
   - **Solution**: Optimize code and implement background processing for longer tasks:
     ```typescript
     export default {
       async fetch(request, env, ctx) {
         // For webhook processing
         if (request.url.includes('/webhook')) {
           // Respond immediately
           const response = new Response('Webhook received', { status: 200 });
           
           // Process in background
           ctx.waitUntil(
             (async () => {
               const payload = await request.clone().json();
               // Process webhook...
             })()
           );
           
           return response;
         }
         
         // For other routes...
       }
     };
     ```

2. **Environment variable access**
   - **Problem**: Cannot access environment variables
   - **Solution**: Use Cloudflare Worker environment binding:
     ```typescript
     // wrangler.toml
     [vars]
     SOME_VARIABLE = "some_value"
     
     # For secrets, use wrangler CLI:
     # wrangler secret put FLUTTERWAVE_SECRET_KEY
     
     // In your Worker
     export default {
       async fetch(request, env, ctx) {
         const flw = new Flutterwave({
           secretKey: env.FLUTTERWAVE_SECRET_KEY,
         });
         // ...
       }
     };
     ```

3. **Memory limitations**
   - **Problem**: Worker exceeds memory limit (128MB)
   - **Solution**: Process data in smaller chunks and minimize object creation:
     ```typescript
     // Instead of loading all transactions
     const transactions = await flw.transactions.list({
       page: 1,
       limit: 20, // Keep page size reasonable
     });
     ```

### Vercel/Netlify Edge Functions

#### Common Issues

1. **Runtime execution timeout**
   - **Problem**: Edge function exceeds execution time limit
   - **Solution**: Optimize code and leverage background processing via webhooks

2. **Environment variable configuration**
   - **Problem**: Environment variables not accessible
   - **Solution**: Configure via the respective platform UI/CLI:
     - Vercel: Use Vercel dashboard or CLI: `vercel env add`
     - Netlify: Use Netlify dashboard or CLI: `netlify env:set KEY VALUE`

3. **Size limitations**
   - **Problem**: Edge function exceeds size limits
   - **Solution**: Keep functions small and focused, avoid importing unnecessary dependencies

## Conclusion

The Flutterwave Universal SDK is designed to work seamlessly across multiple JavaScript runtimes, providing a consistent API for integrating with Flutterwave payment services. By following the runtime-specific setup instructions and best practices outlined in this guide, you can efficiently implement Flutterwave payment processing in your applications, regardless of the runtime environment.

Remember these key points:

1. **Choose the right runtime** for your use case - Node.js for traditional servers, Edge functions for global distribution, Bun for performance, etc.

2. **Follow security best practices** - Always use environment variables for sensitive information and implement proper error handling.

3. **Optimize for performance** - Reuse SDK instances, implement appropriate caching strategies, and tune timeouts for your specific needs.

4. **Test thoroughly** - Test your integration in development environments before deploying to production.

With the Universal SDK, you can build robust, type-safe integrations with Flutterwave that work across your entire technology stack.
