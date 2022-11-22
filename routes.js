import { Router } from "https://deno.land/x/oak/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { queryHandler } from "./controller.js";
import { data } from "./dataHandler.js";

const router = new Router();

router.get("/", ({ response }) => {
  response.body = { message: "Hello World!" };
  response.status = 200;
});

router.get("/data", ({ response }) => {
  response.body = {
    size: JSON.stringify(data).length,
    lastUpdate: data.lastUpdate,
  };
  response.status = 200;
});

router.get("/metrics", (ctx) => {
  const query = getQuery(ctx);
  const { id, dimensions, aggregate } = query;
  if (!id || !dimensions || !aggregate) {
    ctx.response.body = { message: "Missing required query parameters" };
    ctx.response.status = 400;
    return;
  }
  const body = queryHandler(query);
  ctx.response.body = body;
  ctx.response.status = 200;
});

export { router };
