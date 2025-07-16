import { env } from "@/env.server";
import { db } from "./kasely";
import bcrypt from "bcryptjs";

async function main() {
  const EMAIL_ADMIN = env().EMAIL_ADMIN;
  const PASSWORD_ADMIN = env().PASSWORD_ADMIN;

  const user = await db().selectFrom("users").select("id").executeTakeFirst();

  if (!user) {
    const { id: user_id } = await db()
      .insertInto("users")
      .values({
        name: "Super Admin",
        role: "super_admin",
        created_at: new Date(),
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    await db()
      .insertInto("user_credentials")
      .values({
        user_id,
        email_verified: true,
        type: "password",
        email: EMAIL_ADMIN,
        password_hash: await bcrypt.hash(PASSWORD_ADMIN, 10),
      })
      .execute();

    console.log("✅ Super admin criado.");
  } else {
    console.log("ℹ️ Super admin já existe.");
  }
  process.exit();
}

main();
