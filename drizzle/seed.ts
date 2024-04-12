import db from "../src/database";

const seed = async () => {
	if (Bun.env.NODE_ENV !== "development") {
		console.log("Seeding is only available in development mode");
		process.exit(1);
	}

	// seed here

	console.log("Database seeded");
	process.exit(0);
};

seed();
