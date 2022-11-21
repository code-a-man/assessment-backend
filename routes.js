import { Router } from "https://deno.land/x/oak/mod.ts";
import { data } from "./dataHandler.js";

const router = new Router();

router.get("/", ({response}) => {
  response.body = { message: "Hello World!" };
  response.status = 200;
});

router.get("/data", ({response}) => {
	  response.body = data
	  response.status = 200;
});

export { router };