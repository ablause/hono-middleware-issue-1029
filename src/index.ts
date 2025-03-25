import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Type as T } from "@sinclair/typebox";
import { tbValidator } from "@hono/typebox-validator";

export const prisma = createMiddleware<{
  Bindings: { DB: D1Database };
  Variables: { prisma: PrismaClient };
}>(async (c, next) => {
  const adapter = new PrismaD1(c.env.DB);
  const database = new PrismaClient({ adapter });

  c.set("prisma", database);

  await next();
});

export const HelloSchema = T.Object({
  name: T.String({}),
});

const App = new Hono()
  .use(prisma)
  .post("/hello/:name", tbValidator("param", HelloSchema), (c) => {
    const { name } = c.req.valid("param");
    return c.text(`Hello, ${name}!`);
  });

export default App;
