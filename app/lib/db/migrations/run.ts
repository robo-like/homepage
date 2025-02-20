import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Ensure directories exist
const dbDir = path.join(process.cwd(), 'data');
const migrationsDir = path.dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize the SQLite database
const sqlite = new Database(path.join(dbDir, 'database.sqlite'));
const db = drizzle(sqlite);

// Run migrations
async function main() {
    console.log('Running migrations...');
    await migrate(db, {
        migrationsFolder: path.dirname(fileURLToPath(import.meta.url))
    });
    console.log('Migrations completed!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Migration failed!');
    console.error(err);
    process.exit(1);
}); 