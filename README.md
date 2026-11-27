# OmniCopy

OmniCopy is a REST API for managing campaigns, built with Elysia, Bun,
TypeScript, PostgreSQL, and Drizzle ORM.

## Features

- CRUD operations for campaigns
- PostgreSQL persistence through Drizzle ORM
- Runtime request validation with Elysia and TypeBox
- OpenAPI documentation
- Hot reload during development

## Requirements

- [Bun](https://bun.sh/) 1.0 or newer
- PostgreSQL
- A PostgreSQL connection URL

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Create a `.env` file:

```dotenv
DATABASE_URL=postgresql://username:password@localhost:5432/omnicopy
```

3. Create the campaigns table with the Drizzle schema:

```bash
bunx drizzle-kit push
```

4. Start the development server:

```bash
bun run dev
```

The API is available at `http://localhost:3000/api/v1`.

## API Reference

OpenAPI documentation is served by the application when it is running.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/` | Welcome response |
| `GET` | `/api/v1/campaigns` | List all campaigns |
| `GET` | `/api/v1/campaigns/:id` | Get one campaign |
| `POST` | `/api/v1/campaigns` | Create a campaign |
| `PUT` | `/api/v1/campaigns/:id` | Update a campaign |
| `DELETE` | `/api/v1/campaigns/:id` | Delete a campaign |

### Campaign

```json
{
  "campaignId": 1,
  "name": "Summer launch",
  "dueDate": "2026-08-31",
  "createdAt": "2026-11-27T12:28:14.608Z"
}
```

### Create a campaign

```bash
curl -X POST http://localhost:3000/api/v1/campaigns \
  -H 'Content-Type: application/json' \
  -d '{"name":"Summer launch","dueDate":"2026-08-31"}'
```

### List campaigns

```bash
curl http://localhost:3000/api/v1/campaigns
```

### Get a campaign

```bash
curl http://localhost:3000/api/v1/campaigns/1
```

### Update a campaign

```bash
curl -X PUT http://localhost:3000/api/v1/campaigns/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated launch","dueDate":"2026-09-15"}'
```

### Delete a campaign

```bash
curl -X DELETE http://localhost:3000/api/v1/campaigns/1
```

## Database Schema

The `campaigns` table contains:

| Column | Type | Constraints |
| --- | --- | --- |
| `campaign_id` | integer / serial | Primary key |
| `name` | text | Not null |
| `due_date` | date | Optional |
| `created_at` | timestamp | Not null, defaults to current time |

## Development

```bash
bun run dev
```

The server uses Bun's watch mode and reloads after source changes.

## Project Structure

```text
src/
├── index.ts    # Elysia application and campaign routes
└── schema.ts   # Drizzle PostgreSQL schema
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the API with hot reload |

There is no configured test suite yet.
