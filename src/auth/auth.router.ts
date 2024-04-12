import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";

import { userLogin, userRegister } from "./auth.service";

const router = new Hono();

router.post(
  "/auth/register",
  zValidator(
    "json",
    z.object({
      username: z.string(),
      password: z.string(),
    }),
  ),
  async (c) => {
    const { username, password } = c.req.valid("json");

    const user = await userRegister(username, password);

    const token = await generateJWT(user.id, user.username);

    return c.json({
      success: true,
      token,
    });
  },
);

router.post(
  "/auth/login",
  zValidator(
    "json",
    z.object({
      username: z.string(),
      password: z.string(),
    }),
  ),
  async (c) => {
    const { username, password } = c.req.valid("json");

    const user = await userLogin(username, password);

    const token = await generateJWT(user.id, user.username);

    return c.json({
      success: true,
      token,
    });
  },
);

export const generateJWT = async (userId: string, username: string) => {
  return sign({ id: userId, username }, Bun.env.JWT_SECRET || "1abc2xyz3");
};

export default router;
