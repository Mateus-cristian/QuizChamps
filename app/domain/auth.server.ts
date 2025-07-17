import { applySchema, InputError } from "composable-functions";
import { shemaSignIn, shemaSignUp } from "./auth.commom";
import { db } from "@/db/kasely";
import bcrypt from "bcryptjs";
import { redirect } from "react-router";

const SALT_ROUNDS = 10;

const registerUser = applySchema(shemaSignUp)(
  async ({ email, name, password }) => {
    const user = await db()
      .selectFrom("user_credentials")
      .where("email", "=", email)
      .execute();

    if (user) {
      throw new InputError("user already exists");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const trx = await db().startTransaction().execute();

    try {
      const { id: user_id } = await trx
        .insertInto("users")
        .values({
          name,
          role: "user",
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("user_credentials")
        .values({
          email,
          password_hash,
          user_id,
          type: "password",
        })
        .executeTakeFirstOrThrow();

      await trx.commit().execute();
    } catch (error) {
      await trx.rollback().execute();
    }

    return true;
  }
);

const login = applySchema(shemaSignIn)(async ({ email, password }) => {
  const user = await db()
    .selectFrom("user_credentials as uc")
    .innerJoin("users as u", "u.id", "uc.user_id")
    .select(["email", "u.id", "u.name", "uc.password_hash", "email_verified"])
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user || !user.password_hash) {
    throw new InputError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new InputError("Invalid credentials");
  }

  if (!user.email_verified) {
    redirect("/send-confirmation-email");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});

export { registerUser, login };
