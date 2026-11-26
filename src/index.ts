import { Elysia, t } from "elysia";
import openapi from "@elysia/openapi";
import { campaigns } from "./schema";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/bun-sql";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-typebox";

const db = drizzle(process.env.DATABASE_URL!, { schema, casing: "snake_case" });

const _insertCampaign = createInsertSchema(campaigns, {
  dueDate: (schema) => t.String({ ...schema, format: "date" }),
});
const campaignBody = t.Omit(_insertCampaign, ["campaignId", "createdAt"]);

const app = new Elysia({ prefix: "/api/v1" })
  .use(openapi())
  // .onError(({ code, error, status }) => {
  //     if (code === 'NOT_FOUND') return status(404, { error: 'Not Found' });
  //     if (code === 'VALIDATION')
  //         return status(422, { error: 'Bad request data' });
  //     console.error(error);
  //     return status(500, { error: 'Something went wrong, try again later' });
  // })
  .get("/", () => "Hello Elysia")
  .get("/campaigns", async () => {
    return {
      data: await db.select().from(campaigns),
    };
  })
  .get(
    "/campaigns/:id",
    async (context) => {
      const [campaign] = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.campaignId, context.params.id));
      if (!campaign) {
        return context.status(404);
      }
      return { data: campaign };
    },
    {
      params: t.Object({ id: t.Number() }),
    },
  )
  .post(
    "/campaigns",
    async (context) => {
      const [campaign] = await db
        .insert(campaigns)
        .values(context.body)
        .returning();
      return context.status(201, { data: campaign });
    },
    {
      body: campaignBody,
    },
  )
  .delete(
    "/campaigns/:id",
    async (context) => {
      const deleted = await db
        .delete(campaigns)
        .where(eq(campaigns.campaignId, context.params.id))
        .returning();
      if (deleted.length === 0) return context.status(404);
      return context.status(204);
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .put(
    "/campaigns/:id",
    async (context) => {
      const [campaign] = await db
        .update(campaigns)
        .set({
          name: context.body.name,
          dueDate: context.body.dueDate ?? null,
        })

        .where(eq(campaigns.campaignId, context.params.id))
        .returning();

      if (!campaign) return context.status(404);
      return { data: campaign };
    },
    {
      params: t.Object({ id: t.Number() }),
      body: campaignBody,
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
