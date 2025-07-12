import { applySchema, InputError } from "composable-functions";
import { shemaSignUp } from "./auth.commom";
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

export { registerUser };
