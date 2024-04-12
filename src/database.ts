import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as userSchema from "../drizzle/schemas/user.schema";

const client = new Client({
  connectionString: Bun.env.DATABASE_URL,
});

client.connect();

const db = drizzle(client, {
  logger: Bun.env.NODE_ENV === "development",
  schema: {
    ...userSchema,
  },
});

export default db;
