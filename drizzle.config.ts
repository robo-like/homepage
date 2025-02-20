import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
    schema: "./app/lib/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: path.join(process.cwd(), "data/database.sqlite")
    },
    out: "./app/lib/db/migrations"
}); 