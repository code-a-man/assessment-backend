import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/", ({response}) => {
  response.body = { message: "Hello World!" };
  response.status = 200;
});

export { router };