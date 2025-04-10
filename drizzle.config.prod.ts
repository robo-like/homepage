require("dotenv").config(); 
require("dotenv").config({ path: '.env.local' }); 

import type { Config } from "drizzle-kit";

/** I think this should only be needed for migrations
 *  running locally. 
 */
export default {
  schema: "./app/lib/db/schema.ts",
  out: "./app/lib/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_PROD_DATABASE_URL!,
    authToken: process.env.TURSO_PROD_AUTH_TOKEN,
  },
} satisfies Config;
