import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import authRouter from "./auth/auth.router";

type Variables = {
  user?: {
    userId: string;
    username: string;
  };
};

const app = new Hono<{ Variables: Variables }>();

app.use("*", logger(), cors(), secureHeaders());

// Default route
app.get("/", (c) => c.json({}));

// 404 route
app.notFound((c) => c.json({ message: "Not Found" }, 404));

// Handle errors
app.onError((err, c) => {
  if (Bun.env.NODE_ENV !== "test") {
    console.error(err);
  }

  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  if (Bun.env.NODE_ENV === "development" && err instanceof Error) {
    return c.json({ message: err.message }, 500);
  }

  return c.json({ message: "Something went wrong" }, 500);
});

// App routes
app.route("/", authRouter);

export default app;
