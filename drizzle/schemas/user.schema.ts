import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { typeid } from "typeid-ts";

export const generateUserId = () => typeid("user");

export const user = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateUserId()),

	username: text("username").unique().notNull(),
	password: text("password").notNull(),

	createdAt: timestamp("created_at").defaultNow(),
});
