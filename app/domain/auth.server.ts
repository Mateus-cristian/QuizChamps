import { applySchema } from "composable-functions";
import { schemaEmail, shemaSignIn, shemaSignUp } from "./auth.commom";
import { db } from "@/db/kasely";
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "./email.server";
import { add } from "date-fns";
import { randomUUID } from "crypto";
import { AppError, ERROR_CODES } from "@/utils/errors";

const SALT_ROUNDS = 10;

const isUserNotExists = applySchema(schemaEmail)(async ({ email }) => {
  const user = await db()
    .selectFrom("user_credentials")
    .where("email", "=", email)
    .executeTakeFirst();

  if (user) {
    throw new Error();
  }

  return true;
});

const registerUser = applySchema(shemaSignUp)(
  async ({ email, name, password }) => {
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

      const expiresAtDate = add(new Date(), {
        days: 1,
      });

      const token = randomUUID();

      await trx
        .insertInto("email_tokens")
        .values({
          type: "email_verification",
          token,
          user_id,
          expires_at: expiresAtDate,
        })
        .executeTakeFirstOrThrow();

      await trx.commit().execute();

      await sendConfirmationEmail({ email, name, token });
    } catch (error) {
      await trx.rollback().execute();
      throw new Error();
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
    throw AppError("Invalid credentials", ERROR_CODES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw AppError("Invalid credentials", ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (!user.email_verified) {
    throw AppError("Email not verified", ERROR_CODES.EMAIL_NOT_VERIFIED);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});

export { registerUser, isUserNotExists, login };
