import {Elysia, t} from "elysia";
import openapi from "@elysia/openapi";
import {Database} from "bun:sqlite";

const db = new Database("campaigns.db");

db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
        campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        due_date TEXT,
        created_at TEXT NOT NULL
    )
`)

if(!db.query(`SELECT 1 FROM campaigns`).get()){
    db.run(`
        INSERT INTO campaigns (name, created_at) VALUES (?, ?)
        `,
        ["Cyber Monday", new Date().toISOString()]
    )
}

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

const app = new Elysia({prefix: "/api/v1"})
    .use(openapi())
    .get("/campaigns", () => {
        return {data: campaigns};
    })
    .get("/campaigns/:id", (context) => {
        const campaign = campaigns.find(
            (campaign) => campaign.campaignId === Number(context.params.id),
        );
        if (!campaign) {
            return context.status(
                404,
                `No campaigns found with id ${context.params.id}`,
            );
        }
        return {data: campaign};
    })
    .get("/", () => "Hello Elysia")
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
