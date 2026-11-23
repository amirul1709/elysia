import { Elysia } from "elysia";

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
    }
]

const app = new Elysia({prefix: "/api/v1"})
    .get("/campaigns", () => {
        return {data: campaigns}
    })
    .get("/campaigns/:id", (context) => {
        const campaign = campaigns.find(campaign => campaign.campaignId === Number(context.params.id))
        if (!campaign) {
            return context.status(404, `No campaigns found with id ${context.params.id}`);
        }
        return {data: campaign}
    } )
    .get("/", () => "Hello Elysia")
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
