import { Kysely, sql } from "kysely";
import { pool } from "../kasely";

export async function up(db: Kysely<any>) {
  await pool.query(`CREATE TYPE role_type AS ENUM ('user', 'admin');`);

  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("role", sql`role_type`, (col) => col.notNull().defaultTo("user"))
    .addColumn("avatar_url", "text")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .execute();

  await pool.query(
    `CREATE TYPE credential_type AS ENUM ('password', 'oauth');`
  );

  await db.schema
    .createTable("user_credentials")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("type", sql`credential_type`, (col) =>
      col.notNull().defaultTo("password")
    )
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("password_hash", "text")
    .addColumn("provider", "text")
    .addColumn("provider_id", "text")
    .addColumn("email_verified", "boolean", (col) => col.defaultTo(false))
    .addColumn("verification_token", "text")
    .addColumn("token_expires_at", "timestamp")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .addUniqueConstraint("user_credentials_email_unique", ["email", "type"])
    .execute();

  await db.schema
    .createTable("email_tokens")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade")
    )
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("used", "boolean", (col) => col.defaultTo(false))
    .execute();

  await db.schema
    .createTable("quizzes")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("created_by", "uuid", (col) =>
      col.references("users.id").onDelete("set null")
    )
    .addColumn("is_active", "boolean", (col) => col.defaultTo(true))
    .addColumn("scheduled_for", "timestamp")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("questions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("quiz_id", "uuid", (col) =>
      col.references("quizzes.id").onDelete("cascade")
    )
    .addColumn("text", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("options")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("question_id", "uuid", (col) =>
      col.references("questions.id").onDelete("cascade")
    )
    .addColumn("text", "text", (col) => col.notNull())
    .addColumn("is_correct", "boolean", (col) => col.defaultTo(false))
    .execute();

  await db.schema
    .createTable("answers")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade")
    )
    .addColumn("quiz_id", "uuid", (col) =>
      col.references("quizzes.id").onDelete("cascade")
    )
    .addColumn("question_id", "uuid", (col) =>
      col.references("questions.id").onDelete("cascade")
    )
    .addColumn("option_id", "uuid", (col) =>
      col.references("options.id").onDelete("set null")
    )
    .addColumn("answered_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable("quiz_results")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade")
    )
    .addColumn("quiz_id", "uuid", (col) =>
      col.references("quizzes.id").onDelete("cascade")
    )
    .addColumn("score", "integer", (col) => col.notNull())
    .addColumn("duration", "integer")
    .addColumn("completed_at", "timestamp", (col) => col.defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable("quiz_results").execute();
  await db.schema.dropTable("answers").execute();
  await db.schema.dropTable("options").execute();
  await db.schema.dropTable("questions").execute();
  await db.schema.dropTable("quizzes").execute();
  await db.schema.dropTable("email_tokens").execute();
  await db.schema.dropTable("user_credentials").execute();
  await db.schema.dropTable("users").execute();

  await pool.query(`DROP TYPE IF EXISTS credential_type`);
  await pool.query(`DROP TYPE IF EXISTS role_type`);
}
