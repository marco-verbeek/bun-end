import type { Config } from "drizzle-kit";

export default {
	schema: "./drizzle/schemas/*.schema.ts",
	driver: "pg",
	out: "./drizzle/migrations",
} satisfies Config;
