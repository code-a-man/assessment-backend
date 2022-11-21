import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { router } from "./routes.js";
import { updateSheet } from "./dataHandler.js";

let data = await updateSheet();
const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

setInterval(async () => {
	  data = await updateSheet();
}, 300000);

await app.listen({ port: 8000 });