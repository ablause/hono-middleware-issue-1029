import { Hono } from "hono";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Type as T } from "@sinclair/typebox";
import { tbValidator } from "@hono/typebox-validator";

export const HelloSchema = T.Object({
  name: T.String({}),
});

const App = new Hono<{
  Bindings: { DB: D1Database };
}>().post("/hello/:name", tbValidator("param", HelloSchema), (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const database = new PrismaClient({ adapter });

  const { name } = c.req.valid("param");
  return c.text(`Hello, ${name}!`);
});

export default App;
