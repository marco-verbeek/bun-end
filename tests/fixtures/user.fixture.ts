import { randUserName } from "@ngneat/falso";

import { generateUserId, user } from "../../drizzle/schemas/user.schema";
import db from "../../src/database";

export const generateUser = async ({
  username,
  password,
}: { username?: string; password?: string }) => {
  if (!username) username = randUserName();
  if (!password) password = "password";

  const hashedPassword = await Bun.password.hash(password);

  const [createdUser] = await db
    .insert(user)
    .values({ id: generateUserId(), username, password: hashedPassword })
    .returning();

  return createdUser;
};
