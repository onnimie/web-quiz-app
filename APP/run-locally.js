import { app } from "./app.js";

let port_deno = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port_deno = Number(lastArgument);
}

app.listen({ port: port_deno });
