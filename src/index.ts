import { serve } from "@hono/node-server";
import { writeFile } from "fs";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { logger } from "hono/logger";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const res = await yargs(hideBin(process.argv))
  .option("port", {
    type: "number",
    default: 3000,
    description: "Port to run the server on",
  })
  .option("path", {
    type: "array",
    default: ["/"],
    description: "Path to serve",
  })
  .option("out", {
    type: "string",
    description: "Path to write JSON data as ndjson format. If not provided, it will not write.",
  })
  .help()
  .parse();

const app = new Hono();

app.use(logger());

const jsonMiddleware = createMiddleware(async (c, next) => {
  if (c.req.method !== "POST") return next();
  if (c.req.header("content-type") === "application/json") {
    const json = await c.req.json();
    console.log(JSON.stringify(json, null, 2));
    if (res.out) {
      writeFile(res.out, `${JSON.stringify(json)}\n`, { flag: "a" }, (err) => {
        if (err) console.error(err);
      });
    }
  } else {
    console.warn("Content-Type is not application/json");
  }
  return next();
});

app.use(jsonMiddleware);

app.use(cors());

const path = res.path.map((p) => {
  p = String(p);
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
});

for (const p of path) {
  app.post(p, (c) => c.text("Success"));
}

const port = res.port;

console.log(`Server is running on port ${port}.`);
console.log("Available paths:");
for (const p of path) {
  console.log(`- http://localhost:${port}${p}`);
}

serve({
  fetch: app.fetch,
  port,
});
