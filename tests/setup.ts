import { beforeAll, beforeEach } from "bun:test";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { user } from "../drizzle/schemas/user.schema";
import db from "../src/database";

beforeAll(async () => {
  migrate(db, { migrationsFolder: "./drizzle/migrations" });
});

beforeEach(async () => {
  await db.delete(user);
});
