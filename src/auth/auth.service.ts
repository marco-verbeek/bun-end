import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { user } from "../../drizzle/schemas/user.schema";
import db from "../database";

export const userRegister = async (username: string, password: string) => {
  try {
    const hashedPassword = await Bun.password.hash(password);

    const insert = await db
      .insert(user)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    return insert[0];
  } catch (e) {
    throw new HTTPException(400, {
      message: "User with this username already exists",
    });
  }
};

export const userLogin = async (username: string, password: string) => {
  const [dbUser] = await db.query.user.findMany({
    where: eq(user.username, username),
    limit: 1,
  });

  if (!dbUser) {
    throw new HTTPException(403, {
      message: "Access denied",
    });
  }

  const isMatch = await Bun.password.verify(password, dbUser.password);
  if (!isMatch) {
    throw new HTTPException(403, {
      message: "Access denied",
    });
  }

  return dbUser;
};
