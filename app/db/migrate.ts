import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import * as fs from "fs/promises";
import { db as createDb } from "./kasely";
import { sql } from "kysely";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MIGRATIONS_PATH = resolve(__dirname, "migrations");

function stripExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

async function getMigrationFiles() {
  const files = await fs.readdir(MIGRATIONS_PATH);
  return files.filter((file) => file.endsWith(".ts")).sort();
}

export async function runMigrations(direction: "up" | "down") {
  const db = createDb();

  try {
    await db.schema
      .createTable("migrations")
      .ifNotExists()
      .addColumn("name", "text", (col) => col.primaryKey())
      .addColumn("executed_at", "timestamp", (col) => col.defaultTo(sql`now()`))
      .execute();

    const executed = await db.selectFrom("migrations").select("name").execute();
    const executedNames = new Set(executed.map((m) => m.name));

    let files = await getMigrationFiles();

    if (direction === "down") {
      files = files
        .filter((file) => executedNames.has(stripExtension(file)))
        .reverse();
    } else {
      files = files.filter((file) => !executedNames.has(stripExtension(file)));
    }

    for (const file of files) {
      const migration = await import(join(MIGRATIONS_PATH, file));
      const fn = direction === "up" ? migration.up : migration.down;

      console.log(`${direction.toUpperCase()}: ${file}`);
      await fn(db);

      const nameWithoutExt = stripExtension(file);
      if (direction === "up") {
        await db
          .insertInto("migrations")
          .values({ name: nameWithoutExt })
          .execute();
      } else {
        await db
          .deleteFrom("migrations")
          .where("name", "=", nameWithoutExt)
          .execute();
      }
    }
  } finally {
    await db.destroy();
  }
}
