import { Elysia, t } from "elysia";
import openapi from "@elysia/openapi";
import { Database } from "bun:sqlite";

const db = new Database("campaigns.db");

db.run(`
    CREATE TABLE IF NOT EXISTS campaigns
    (
        campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        due_date TEXT,
        created_at TEXT NOT NULL
    )
`);

if (!db.query(`SELECT 1 FROM campaigns`).get()) {
  db.run(
    `
        INSERT INTO campaigns (name, created_at)
        VALUES (?, ?)
    `,
    ["Cyber Monday", new Date().toISOString()],
  );
}
/*
const campaigns = [
    {
        campaignId: 1,
        name: "Summer Sale",
        dueDate: new Date(),
        createdAt: new Date(),
    },
    {
        campaignId: 2,
        name: "Black Friday",
        dueDate: new Date(),
        createdAt: new Date(),
    },
];
*/
const app = new Elysia({ prefix: "/api/v1" })
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .get("/campaigns", () => {
    return {
      data: db
        .query(
          `
            SELECT campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt 
            FROM campaigns
          `,
        )
        .all(),
    };
  })
  .get(
    "/campaigns/:id",
    (context) => {
      const campaign = db
        .query(
          `
            SELECT campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt 
            FROM campaigns
            WHERE campaign_id = ?
        `,
        )
        .get(context.params.id);
      if (!campaign) {
        return context.status(
          404,
          `No campaigns found with id ${context.params.id}`,
        );
      }
      return { data: campaign };
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .post(
    "/campaigns",
    (context) => {
      const campaign = db
        .query(
          `
        INSERT INTO campaigns (name, due_date, created_at)
        VALUES (?, ?, ?)
        RETURNING campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAs
    `,
        )
        .get(
          context.body.name,
          context.body.dueDate ?? null,
          new Date().toISOString(),
        );
      return context.status(201, { data: campaign });
    },
    {
      body: t.Object({
        name: t.String(),
        dueDate: t.Optional(t.String({ format: "date" })),
      }),
    },
  )
  .delete(
    "/campaigns/:id",
    (context) => {
      const { changes } = db.run(
        `
        DELETE FROM campaigns WHERE campaign_id = ?    
    `,
        [context.params.id],
      );

      if (changes) {
        return context.status(204);
      }
      return context.status(404);
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .put(
    "/campaigns/:id",
    (context) => {
      const campaign = db
        .query(
          `
        UPDATE campaigns SET name = ?, due_date = ?, WHERE campaign_id = ?
        RETURNING campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt    
    `,
        )
        .get(
          context.body.name,
          context.body.dueDate ?? null,
          context.params.id,
        );
      if (campaign) {
        return { data: campaign };
      }
      return context.status(404);
    },
    {
      params: t.Object({ id: t.Number() }),
      body: t.Object({
        name: t.String(),
        dueDate: t.Optional(t.String({ format: "date" })),
      }),
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
