require("dotenv").config(); 
require("dotenv").config({ path: '.env.local' }); 

import type { Config } from "drizzle-kit";

export default {
  schema: "./app/lib/db/schema.ts",
  out: "./app/lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
