# Digikala integration

This project does not include a vendor OpenAPI specification file in the repository, so the implementation intentionally avoids guessing the exact request bodies, query parameters, or headers for Digikala product creation and variant updates. The integration is designed to be safe and server-side first, while keeping the app architecture compatible with the existing Next.js + JSON-backed structure.

## 1. Environment variables

Add these values to the server environment:

```bash
DIGIKALA_BASE_URL=https://seller.digikala.com
DIGIKALA_SANDBOX=true
DIGIKALA_CLIENT_CODE=your-client-code
DIGIKALA_CLIENT_ID=your-client-id
DIGIKALA_CLIENT_SECRET=your-client-secret
DIGIKALA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
DIGIKALA_ACCESS_TOKEN=server-side-only-access-token
DIGIKALA_REFRESH_TOKEN=server-side-only-refresh-token
```

Important:
- never expose tokens or private keys in the browser or frontend bundle
- never log raw request bodies or response payloads containing secrets
- keep all Digikala token storage on the server

## 2. Authentication flow

The project includes a central Digikala client under lib/digikala that centralizes:
- auth token state
- request headers
- retry behavior
- rate-limit handling
- response sanitization

The exact validation / decrypt sequence should be implemented from the official Digikala OpenAPI contract. This repository does not ship a vendor specification file, so exact parameters are not inferred here.

## 3. Product sync flow

The project stores mapping records for products and categories in data/digikala. The sync queue is built with batching and a safe page size so the app does not push every product into a single giant batch.

- product mappings are stored in data/digikala/product-mappings.json
- category mappings are stored in data/digikala/category-mappings.json
- status values are normalized to PENDING, SYNCING, SYNCED, FAILED

## 4. Bulk sync

The queue builder follows a batch pattern:

```ts
buildDigikalaQueue(items, batchSize)
```

This keeps the sync process safe and easy to paginate. A typical production pattern is:
1. load products from the local JSON store
2. create a queue in batches of 25
3. process one batch at a time
4. update mapping status and timestamps
5. move to the next batch only after the current one succeeds or fails

## 5. Price and stock sync

The current architecture is ready for batch style updates, but Digikala request payloads for variant updates must match the official OpenAPI contract. The app will not guess vendor-specific bodies; instead, it provides a safe place to attach those API calls once the vendor contract is available.

## 6. Category mapping

Category mappings are managed through the server route at app/api/digikala/categories/route.ts. This allows mapping local categories to Digikala category IDs without hardcoding the mapping in the frontend.

## 7. Error storage

The project keeps sync error metadata in server-side files and sanitizes logs with sensitive-key redaction. Values such as accessToken, refreshToken, privateKey, Authorization, or API keys are replaced with [REDACTED].

## 8. Cron and queue execution

In production, a cron or background worker can call the sync endpoint in batches rather than in one giant run. A safe pattern is:
- call for 25 items
- wait for completion
- fetch the next batch
- continue until all items are processed

## 9. Production checklist

- keep the Digikala private key in the server environment only
- restrict the endpoint to admin users
- use a scheduled worker or server job for sync
- store the access token and refresh token server-side only
- implement the exact Digikala payload contract from the official spec before live product creation
- set up monitoring around 401, 429, and 5xx errors
