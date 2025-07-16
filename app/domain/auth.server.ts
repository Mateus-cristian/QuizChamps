import { applySchema, InputError } from "composable-functions";
import { shemaSignIn, shemaSignUp } from "./auth.commom";
import { db } from "@/db/kasely";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

const registerUser = applySchema(shemaSignUp)(
  async ({ email, name, password }) => {
    const user = await db()
      .selectFrom("users")
      .where("email", "=", email)
      .execute();

    if (user) {
      throw new InputError("user already exists");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    await db()
      .insertInto("users")
      .values({
        name,
        email,
        password_hash,
      })
      .execute();

    return true;
  }
);

const login = applySchema(shemaSignIn)(async ({ email, password }) => {
  const user = await db()
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) {
    throw new InputError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new InputError("Invalid credentials");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});

export { registerUser, login };
