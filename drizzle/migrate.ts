import { migrate } from "drizzle-orm/postgres-js/migrator";

import db from "../src/database";

(async () => {
	// Note: this script is being run from the root of the project.
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });

	console.log("Migrations complete");
	process.exit(0);
})();
