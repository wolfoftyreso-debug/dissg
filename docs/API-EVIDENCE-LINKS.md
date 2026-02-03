# Evidence Link API & Integration Guide

## Overview

Every data aggregation in the Lambda system produces a unique, verifiable **Evidence Link**. This enables:

- **Verification**: Any viewer can confirm data hasn't been manipulated
- **Reproducibility**: Exact graph/report can be regenerated from the link
- **Audit trail**: Complete source lineage is preserved
- **Integration**: Data-driven via API and webhooks

---

## Evidence Link Format

```
Short code: XXXX-XXXX (8 characters, case-insensitive)
Full ID: EL-{checksum}-{timestamp}-{version}
URL: /verify/{short_code}
```

### Example

```json
{
  "id": "EL-a1b2c3d4e5f6-1704067200000",
  "url": "/verify/A2B3C4D5",
  "short_code": "A2B3C4D5",
  "data_checksum": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234",
  "generated_at": "2025-01-01T00:00:00.000Z",
  "expires_at": null,
  "aggregation_version": "1.0",
  "query_params": {
    "indicators": ["GDP_GROWTH", "UNEMPLOYMENT"],
    "geo_scope": "SE",
    "time_start": "2020-01-01",
    "time_end": "2024-12-31",
    "view_type": "graph"
  },
  "sources": [
    {
      "source_id": "SCB",
      "name": "Statistics Sweden",
      "url": "https://scb.se/...",
      "fetched_at": "2025-01-01T00:00:00.000Z",
      "checksum": "..."
    }
  ]
}
```

---

## REST API

### Generate Evidence Link

```http
POST /api/v1/evidence
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "query": {
    "indicators": ["GDP_GROWTH", "UNEMPLOYMENT"],
    "geo_scope": "SE",
    "time_start": "2020-01-01",
    "time_end": "2024-12-31",
    "view_type": "graph"
  }
}
```

**Response:**
```json
{
  "evidence_link": {
    "id": "EL-...",
    "short_code": "A2B3C4D5",
    "url": "/verify/A2B3C4D5",
    "qr_code_url": "/api/v1/evidence/A2B3C4D5/qr.png"
  }
}
```

### Verify Evidence Link

```http
GET /api/v1/evidence/{short_code}/verify
Authorization: Bearer {api_key}
```

**Response:**
```json
{
  "verification": {
    "is_valid": true,
    "match_status": "exact",
    "verified_at": "2025-01-15T12:00:00.000Z",
    "original": { ... },
    "current_checksum": "..."
  }
}
```

### Get QR Code

```http
GET /api/v1/evidence/{short_code}/qr.png
GET /api/v1/evidence/{short_code}/qr.svg
```

Returns QR code image in requested format.

### Reproduce View

```http
GET /api/v1/evidence/{short_code}/data
Authorization: Bearer {api_key}
```

Returns the exact data that was used to generate the original view.

---

## Webhooks

### Configuration

```http
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "url": "https://your-domain.com/webhook",
  "events": ["evidence.generated", "evidence.verified", "data.changed"],
  "secret": "your_webhook_secret"
}
```

### Event Types

#### `evidence.generated`
Fired when a new evidence link is created.

```json
{
  "event": "evidence.generated",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "data": {
    "evidence_link": { ... }
  }
}
```

#### `evidence.verified`
Fired when someone verifies an evidence link.

```json
{
  "event": "evidence.verified",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "data": {
    "short_code": "A2B3C4D5",
    "match_status": "exact",
    "verifier_ip": "hashed"
  }
}
```

#### `data.changed`
Fired when source data changes, affecting existing evidence links.

```json
{
  "event": "data.changed",
  "timestamp": "2025-02-01T00:00:00.000Z",
  "data": {
    "affected_evidence_links": ["A2B3C4D5", "E6F7G8H9"],
    "source_id": "SCB",
    "change_type": "data_update"
  }
}
```

---

## JavaScript SDK

```typescript
import { LambdaClient } from '@lambda/sdk';

const client = new LambdaClient({ apiKey: 'your_api_key' });

// Generate evidence link
const evidence = await client.evidence.generate({
  indicators: ['GDP_GROWTH'],
  geo_scope: 'SE',
  time_start: '2020-01-01',
  time_end: '2024-12-31',
  view_type: 'graph'
});

console.log(evidence.short_code); // "A2B3C4D5"

// Verify evidence link
const verification = await client.evidence.verify('A2B3C4D5');

if (verification.is_valid && verification.match_status === 'exact') {
  console.log('Data verified - exact match');
}

// Subscribe to webhooks
client.webhooks.on('data.changed', (event) => {
  console.log('Data changed:', event.affected_evidence_links);
});
```

---

## QR Code Integration

### Embed in Reports

```tsx
import { EvidenceLinkBadge } from '@/components/lambda';

function Report({ data, evidenceLink }) {
  return (
    <div>
      <h1>Annual Report 2024</h1>
      
      {/* Display at top-right of every report page */}
      <EvidenceLinkBadge 
        evidenceLink={evidenceLink}
        language="en"
      />
      
      {/* Report content */}
      <ReportContent data={data} />
    </div>
  );
}
```

### Print-Ready QR

```http
GET /api/v1/evidence/{short_code}/qr.svg?size=200&include_code=true
```

Returns print-optimized SVG with short code text below.

---

## Verification Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User      │────▶│  Scan QR /   │────▶│   Lambda    │
│   Views     │     │  Enter Code  │     │   System    │
│   Report    │     └──────────────┘     └──────┬──────┘
└─────────────┘                                 │
                                                ▼
                                    ┌───────────────────┐
                                    │ Verify Checksum   │
                                    │ Against Current   │
                                    │ Data              │
                                    └─────────┬─────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
            ┌───────────┐             ┌───────────┐             ┌───────────┐
            │  EXACT    │             │  CHANGED  │             │  INVALID  │
            │  MATCH    │             │  (update) │             │           │
            └───────────┘             └───────────┘             └───────────┘
```

---

## Security Considerations

1. **Checksums are SHA-256** hashed from complete data + query + sources + timestamp
2. **Short codes** use unambiguous alphabet (no 0/O, 1/I/l confusion)
3. **API keys** are required for generation; verification is public
4. **Webhooks** use HMAC-SHA256 signature validation
5. **No data modification** - system is append-only for evidence

---

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| Generate evidence | 100/min |
| Verify evidence | 1000/min |
| Get QR code | 500/min |
| Webhook delivery | 10/sec per endpoint |

---

## Error Codes

| Code | Description |
|------|-------------|
| `EVIDENCE_NOT_FOUND` | Short code does not exist |
| `EVIDENCE_EXPIRED` | Evidence link has expired |
| `CHECKSUM_MISMATCH` | Data has changed since generation |
| `RATE_LIMITED` | Too many requests |
| `INVALID_API_KEY` | Authentication failed |
