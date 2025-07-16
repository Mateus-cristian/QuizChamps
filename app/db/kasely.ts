import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./schema";
import { env } from "@/env.server";

const pool = new Pool({
  connectionString: env().DATABASE_URL,
});

const db = () =>
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

export { db, pool };
