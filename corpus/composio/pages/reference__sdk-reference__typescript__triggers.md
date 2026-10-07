---
url: https://docs.composio.dev/reference/sdk-reference/typescript/triggers
title: Triggers | Composio
description: Trigger (Instance) class
status: 200
---

SDK Reference [TypeScript SDK](https://docs.composio.dev/reference/sdk-reference/typescript)

# Triggers

Copy page

## [Usage](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#usage)

Access this class through the `composio.triggers` property:

```
const composio = new Composio({ apiKey: 'your-api-key' });
const result = await composio.triggers.list();
```

## [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#methods)

### [create()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#create)

Create a new trigger instance for a user
If the connected account id is not provided, the first connected account for the user and toolkit will be used

```
async create(userId: string, slug: string, body?: TriggerInstanceUpsertParams, requestOptions?: ComposioRequestOptions): Promise<TriggerInstanceUpsertResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | The user id of the trigger instance |
| `slug` | `string` | The slug of the trigger instance |
| `body?` | `TriggerInstanceUpsertParams` | The parameters to create the trigger instance |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggerInstanceUpsertResponse>` — The created trigger instance

* * *

### [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#delete)

Delete a trigger instance

```
async delete(triggerId: string, requestOptions?: ComposioRequestOptions): Promise<TriggerInstanceManageDeleteResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `triggerId` | `string` | The slug of the trigger instance |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggerInstanceManageDeleteResponse>`

* * *

### [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#disable)

Disable a trigger instance

```
async disable(triggerId: string, requestOptions?: ComposioRequestOptions): Promise<ManageUpdateResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `triggerId` | `string` | The id of the trigger instance |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ManageUpdateResponse>` — The updated trigger instance

* * *

### [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#enable)

Enable a trigger instance

```
async enable(triggerId: string, requestOptions?: ComposioRequestOptions): Promise<ManageUpdateResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `triggerId` | `string` | The id of the trigger instance |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<ManageUpdateResponse>` — The updated trigger instance

* * *

### [getType()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#gettype)

Retrieve a trigger type by its slug for the provided version of the app
Use the global toolkit versions param when initializing composio to pass a toolkitversion

```
async getType(slug: string, requestOptions?: ComposioRequestOptions): Promise<TriggersTypeRetrieveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `slug` | `string` | The slug of the trigger type |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggersTypeRetrieveResponse>` — The trigger type object

* * *

### [listActive()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#listactive)

Fetch list of all the active triggers

```
async listActive(query?: TriggerInstanceListActiveParams, requestOptions?: ComposioRequestOptions): Promise<TriggerInstanceListActiveResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `query?` | `TriggerInstanceListActiveParams` | The query parameters to filter the trigger instances |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggerInstanceListActiveResponse>` — List of trigger instances

**Example**

```
const triggers = await triggers.listActive({
  authConfigIds: ['123'],
  connectedAccountIds: ['456'],
});
```

* * *

### [listEnum()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#listenum)

Fetches the list of all the available trigger enums

This method is used by the CLI where filters are not required.

```
async listEnum(requestOptions?: ComposioRequestOptions): Promise<TriggersTypeRetrieveEnumResponse>
```

**Parameters**

| Name | Type |
| --- | --- |
| `requestOptions?` | `ComposioRequestOptions` |

**Returns**

`Promise<TriggersTypeRetrieveEnumResponse>`

* * *

### [listTypes()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#listtypes)

List all the trigger types

```
async listTypes(query?: TriggersTypeListParams, requestOptions?: ComposioRequestOptions): Promise<TriggersTypeListResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `query?` | `TriggersTypeListParams` | The query parameters to filter the trigger types |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggersTypeListResponse>` — The list of trigger types

* * *

### [parse()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#parse)

Parse an incoming webhook HTTP request into a typed, normalized trigger payload.

Dump the incoming request in and get back the parsed Composio trigger event.
When `verifySecret` is provided, the request signature is verified before the
payload is returned (delegating to verifyWebhook); without it, the body
is parsed without verification.

The `request` may be either a Fetch API `Request` (Next.js App Router, Hono,
Remix) or a plain `{ body, headers }` object (Express with `express.raw`,
Next.js Pages Router `req`). The signature headers (`webhook-id`,
`webhook-timestamp`, `webhook-signature`) are read case-insensitively.

```
async parse(request: WebhookRequestLike, options?: ParseWebhookOptions): Promise<VerifyWebhookResult>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `request` | `WebhookRequestLike` | The incoming webhook HTTP request |
| `options?` | `ParseWebhookOptions` | Parse options |

**Returns**

`Promise<VerifyWebhookResult>` — The parsed (and optionally verified) webhook payload

**Example**

```
// Express with express.raw (verify the signature)
app.post('/webhooks/composio', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const result = await composio.triggers.parse(req, {
      verifySecret: process.env.COMPOSIO_WEBHOOK_SECRET,
    });
    console.log('Trigger:', result.payload.triggerSlug);
    console.log('Event data:', result.payload.payload);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(401);
  }
});

// Express without verifying (parse only)
app.post('/webhooks/composio', express.raw({ type: 'application/json' }), async (req, res) => {
  const result = await composio.triggers.parse(req);
  console.log('Trigger:', result.payload.triggerSlug);
  res.sendStatus(200);
});
```

```
// Next.js App Router (Request) — verify the signature
export async function POST(request: Request) {
  try {
    const result = await composio.triggers.parse(request, {
      verifySecret: process.env.COMPOSIO_WEBHOOK_SECRET,
    });
    console.log('Trigger:', result.payload.triggerSlug);
    console.log('Event data:', result.payload.payload);
    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
}

// Next.js App Router — parse only (no verification)
export async function POST(request: Request) {
  const result = await composio.triggers.parse(request);
  console.log('Trigger:', result.payload.triggerSlug);
  return new Response('OK', { status: 200 });
}
```

* * *

### [setWebhookSubscription()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#setwebhooksubscription)

Create or update the project webhook subscription used for webhook delivery.

If a subscription already exists, the first subscription is updated. Otherwise a new
subscription is created. By default this subscribes to V3 trigger message events.

```
async setWebhookSubscription(params: SetWebhookSubscriptionParams): Promise<WebhookSubscription>
```

**Parameters**

| Name | Type |
| --- | --- |
| `params` | `SetWebhookSubscriptionParams` |

**Returns**

`Promise<WebhookSubscription>`

**Example**

```
await composio.triggers.setWebhookSubscription({
  webhookUrl: `${APP_URL}/webhooks/composio`,
});
```

* * *

### [subscribe()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#subscribe)

Subscribe to all the triggers

```
async subscribe(fn: (_data: IncomingTriggerPayload) => void, filters: TriggerSubscribeParams): Promise<void>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `fn` | `(_data: IncomingTriggerPayload) => void` | The function to call when a trigger is received |
| `filters` | `TriggerSubscribeParams` | The filters to apply to the triggers |

**Returns**

`Promise<void>`

**Example**

```
triggers.subscribe((data) => {
  console.log(data);
}, );
```

* * *

### [unsubscribe()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#unsubscribe)

Unsubscribe from all the triggers

```
async unsubscribe(): Promise<void>
```

**Returns**

`Promise<void>`

**Example**

```
composio.trigger.subscribe((data) => {
  console.log(data);
});

await triggers.unsubscribe();
```

* * *

### [update()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#update)

Update an existing trigger instance

```
async update(triggerId: string, body: TriggerInstanceManageUpdateParams, requestOptions?: ComposioRequestOptions): Promise<TriggerInstanceManageUpdateResponse>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `triggerId` | `string` | The Id of the trigger instance |
| `body` | `TriggerInstanceManageUpdateParams` | The parameters to update the trigger instance |
| `requestOptions?` | `ComposioRequestOptions` |  |

**Returns**

`Promise<TriggerInstanceManageUpdateResponse>` — The updated trigger instance response

* * *

### [verifyWebhook()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers\#verifywebhook)

Verify an incoming webhook payload and signature.

This method validates that the webhook request is authentic by:

1. Verifying the HMAC-SHA256 signature matches the payload using the correct signing format
2. Optionally checking that the webhook timestamp is within the tolerance window

The signature is computed as: `HMAC-SHA256(${webhookId}.${webhookTimestamp}.${payload}, secret)`
and is expected in the format: `v1,base64EncodedSignature`

```
async verifyWebhook(params: VerifyWebhookParams): Promise<VerifyWebhookResult>
```

**Parameters**

| Name | Type | Description |
| --- | --- | --- |
| `params` | `VerifyWebhookParams` | The verification parameters |

**Returns**

`Promise<VerifyWebhookResult>` — The verified and parsed webhook payload with version information

**Example**

```
// In an Express.js webhook handler
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const result = await composio.triggers.verifyWebhook({
      payload: req.body.toString(),
      signature: req.headers['webhook-signature'] as string,
      webhookId: req.headers['webhook-id'] as string,
      webhookTimestamp: req.headers['webhook-timestamp'] as string,
      secret: process.env.COMPOSIO_WEBHOOK_SECRET!,
    });

    // Process the verified payload
    console.log('Webhook version:', result.version);
    console.log('Received trigger:', result.payload.triggerSlug);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook verification failed:', error);
    res.status(401).send('Unauthorized');
  }
});
```

* * *

[Edit this page on GitHub](https://github.com/ComposioHQ/composio/blob/next/docs/content/reference/sdk-reference/typescript/triggers.mdx)

### On this page

[Usage](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#usage) [Methods](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#methods) [create()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#create) [delete()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#delete) [disable()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#disable) [enable()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#enable) [getType()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#gettype) [listActive()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#listactive) [listEnum()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#listenum) [listTypes()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#listtypes) [parse()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#parse) [setWebhookSubscription()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#setwebhooksubscription) [subscribe()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#subscribe) [unsubscribe()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#unsubscribe) [update()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#update) [verifyWebhook()](https://docs.composio.dev/reference/sdk-reference/typescript/triggers#verifywebhook)
