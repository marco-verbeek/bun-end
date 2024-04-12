import type { Context, MiddlewareHandler, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const userAuth: MiddlewareHandler<{
  Variables: {
    userId: string;
  };
}> = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (!token) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  try {
    const decodedPayload = await verify(
      token,
      Bun.env.JWT_SECRET || "1abc2xyz3",
    );

    c.set("userId", decodedPayload.id);
  } catch (e) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  await next();
};
