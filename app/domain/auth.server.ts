import { applySchema, composable, fromSuccess } from "composable-functions";
import { schemaEmail, shemaSignIn, shemaSignUp } from "./auth.commom";
import { db } from "@/db/kasely";
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "./email.server";
import { add } from "date-fns";
import { randomUUID } from "crypto";

export const ensureEmailNotInUse = applySchema(schemaEmail)(
  async ({ email }) => {
    const existing = await db()
      .selectFrom("user_credentials")
      .where("email", "=", email)
      .executeTakeFirst();

    if (existing) throw new Error("Já existe uma conta com esse e-mail.");

    return true;
  }
);

const registerUser = applySchema(shemaSignUp)(
  async ({ email, name, password }) => {
    const password_hash = await bcrypt.hash(password, 10);
    const trx = await db().startTransaction().execute();

    try {
      const { id: user_id } = await trx
        .insertInto("users")
        .values({ name, role: "user" })
        .returning("id")
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("user_credentials")
        .values({ email, password_hash, user_id, type: "password" })
        .executeTakeFirstOrThrow();

      const tokenData = generateEmailVerificationTokenData(user_id);
      await trx
        .insertInto("email_tokens")
        .values(tokenData)
        .executeTakeFirstOrThrow();
      await trx.commit().execute();

      await createOrUpdateEmailVerificationToken(user_id, name, email);
    } catch (err) {
      await trx.rollback().execute();
      throw new Error("Erro ao registrar usuário.");
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
    throw new Error("E-mail ou senha incorretos.");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("E-mail ou senha incorretos.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});

const resendVerificationEmailIfNotVerified = composable(
  async (email: string) => {
    const user = await db()
      .selectFrom("user_credentials as uc")
      .innerJoin("users as u", "u.id", "uc.user_id")
      .select(["u.id", "u.name", "uc.email", "uc.email_verified"])
      .where("uc.email", "=", email)
      .executeTakeFirstOrThrow();

    if (user.email_verified) throw new Error("E-mail já verificado.");

    const token = await createOrUpdateEmailVerificationToken(
      user.id,
      user.name,
      user.email
    );
    return { token };
  }
);

const resendVerificationUsingToken = async (token: string) => {
  const existing = await db()
    .selectFrom("email_tokens as et")
    .innerJoin("user_credentials as uc", "uc.user_id", "et.user_id")
    .innerJoin("users as u", "u.id", "uc.user_id")
    .select([
      "et.user_id",
      "et.expires_at",
      "uc.email_verified",
      "u.name",
      "uc.email",
    ])
    .where("et.id", "=", token)
    .executeTakeFirst();

  if (!existing) {
    return { success: false, error: "Token inválido." };
  }

  if (existing.email_verified) {
    return { success: false, error: "E-mail já verificado." };
  }

  const newToken = await createOrUpdateEmailVerificationToken(
    existing.user_id,
    existing.name,
    existing.email
  );

  await sendConfirmationEmail({
    name: existing.name,
    email: existing.email,
    token: newToken,
  });

  return { success: true };
};

const verifyConfirmationToken = composable(async (id: string) => {
  const emailToken = await db()
    .selectFrom("email_tokens")
    .where("id", "=", id)
    .select("id")
    .executeTakeFirstOrThrow();

  if (!emailToken.id) {
    throw new Error("Registro não encontrado!");
  }

  return id;
});

const verifyLatestEmailToken = composable(async (token: string) => {
  const found = await db()
    .selectFrom("email_tokens")
    .where("type", "=", "email_verification")
    .where("token", "=", token)
    .where("expires_at", ">", new Date())
    .orderBy("expires_at", "desc")
    .select(["id", "user_id"])
    .executeTakeFirst();

  if (!found) throw new Error("Token inválido ou expirado.");

  return found;
});

const confirmEmailVerification = composable(async (token: string) => {
  const tokenData = await fromSuccess(verifyLatestEmailToken)(token);

  await db()
    .updateTable("user_credentials")
    .where("user_id", "=", tokenData.user_id)
    .set({ email_verified: true })
    .execute();

  await db()
    .deleteFrom("email_tokens")
    .where("user_id", "=", tokenData.user_id)
    .where("type", "=", "email_verification")
    .execute();

  return { success: true };
});

async function createOrUpdateEmailVerificationToken(
  user_id: string,
  name: string,
  email: string
) {
  const tokenData = generateEmailVerificationTokenData(user_id);

  const existing = await db()
    .selectFrom("email_tokens")
    .select("id")
    .where("user_id", "=", user_id)
    .where("type", "=", "email_verification")
    .executeTakeFirst();

  if (existing) {
    await db()
      .updateTable("email_tokens")
      .where("id", "=", existing.id)
      .set(tokenData)
      .executeTakeFirstOrThrow();
  } else {
    await db()
      .insertInto("email_tokens")
      .values(tokenData)
      .executeTakeFirstOrThrow();
  }

  await sendConfirmationEmail({ email, name, token: tokenData.token });

  return tokenData.token;
}

function generateEmailVerificationTokenData(user_id: string) {
  return {
    type: "email_verification" as const,
    token: randomUUID(),
    user_id,
    expires_at: add(new Date(), { days: 1 }),
  };
}

export {
  registerUser,
  verifyConfirmationToken,
  login,
  createOrUpdateEmailVerificationToken,
  confirmEmailVerification,
  resendVerificationEmailIfNotVerified,
  resendVerificationUsingToken,
};
