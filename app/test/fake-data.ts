import * as authServer from "../domain/auth.server";
import { db } from "@/db/kasely";

export const fakeUser = {
  email: "testuser@example.com",
  name: "Test User",
  password: "123456",
};

export function getFakeUser(overrides?: Partial<typeof fakeUser>) {
  return { ...fakeUser, ...overrides };
}

export const fakeAdmin = {
  email: "admin@example.com",
  name: "Admin",
  password: "admin123",
};

export function getFakeAdmin(overrides?: Partial<typeof fakeAdmin>) {
  return { ...fakeAdmin, ...overrides };
}

export async function createUserDirect(overrides?: Partial<typeof fakeUser>) {
  const user = getFakeUser({ password: "SenhaValida1!", ...overrides });

  const userRow = await db()
    .insertInto("users")
    .values({ name: user.name })
    .returning("id")
    .executeTakeFirstOrThrow();

  await db()
    .insertInto("user_credentials")
    .values({
      user_id: userRow.id,
      email: user.email,
      password_hash: user.password,
    })
    .executeTakeFirst();

  return { ...user, user_id: userRow.id };
}

export async function createAndRegisterUser(
  overrides?: Partial<typeof fakeUser>
) {
  const user = getFakeUser({ password: "SenhaValida1!", ...overrides });
  await authServer.registerUser(user);
  return user;
}
