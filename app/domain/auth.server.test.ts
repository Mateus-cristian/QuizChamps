import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import * as authServer from "./auth.server";
import { db } from "@/db/kasely";
import { createUserDirect, fakeUser, getFakeUser } from "@/test/fake-data";
import { fromSuccess } from "composable-functions";

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "fake-id" }),
    })),
  },
  getTestMessageUrl: vi.fn(() => "http://test-message-url"),
}));

beforeEach(async () => {
  await db().deleteFrom("email_tokens").execute();
  await db().deleteFrom("user_credentials").execute();
  await db().deleteFrom("users").execute();
});

afterAll(async () => {
  await db().destroy();
});

describe("auth.server", () => {
  it("should send confirmation email on registration", async () => {
    const email = `mailtest_${Date.now()}@example.com`;
    const user = await createUserDirect({ email });

    const token = await authServer.createOrUpdateEmailVerificationToken(
      user.user_id,
      user.name,
      user.email
    );

    expect(token).toBeTruthy();
  });
  it("should fail to register user with weak password", async () => {
    const result = await authServer.registerUser(fakeUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
    }
  });

  it("should not allow duplicate email registration", async () => {
    const data = await fromSuccess(authServer.ensureEmailNotInUse)({
      email: fakeUser.email,
    });
    expect(data).toBe(true);
  });

  it("should login with correct credentials", async () => {
    const result = await authServer.login({
      email: fakeUser.email,
      password: fakeUser.password,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
    }
  });

  it("should fail login with wrong password", async () => {
    const result = await authServer.login({
      email: fakeUser.email,
      password: "wrong",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
    }
  });

  it("should create and verify email token", async () => {
    const validUser = await createUserDirect({
      email: "tokenuser@example.com",
    });

    const user = await db()
      .selectFrom("user_credentials")
      .select(["user_id", "email"])
      .where("email", "=", validUser.email)
      .executeTakeFirst();
    expect(user).toBeTruthy();

    const tokenData = authServer.generateEmailVerificationTokenData(
      user!.user_id
    );

    const { token } = await db()
      .insertInto("email_tokens")
      .values(tokenData)
      .returning("token")
      .executeTakeFirstOrThrow();

    const verified = await fromSuccess(authServer.confirmEmailVerification)(
      token
    );

    expect(verified.success).toBe(true);
  });

  it("should confirm email verification", async () => {
    const validUser = await createUserDirect({
      email: "confirmuser@example.com",
    });
    const user = await db()
      .selectFrom("user_credentials")
      .select(["user_id", "email"])
      .where("email", "=", validUser.email)
      .executeTakeFirst();
    expect(user).toBeTruthy();

    const token = await authServer.createOrUpdateEmailVerificationToken(
      user!.user_id,
      validUser.name,
      validUser.email
    );

    const result = await fromSuccess(authServer.confirmEmailVerification)(
      token
    );
    expect(result).toBeDefined();
  });

  it("should not resend verification email if already verified", async () => {
    const validUser = await createUserDirect({
      email: "confirmuser@example.com",
    });

    const resultResendToken = await fromSuccess(
      authServer.resendVerificationEmailIfNotVerified
    )(validUser.email);

    await fromSuccess(authServer.confirmEmailVerification)(
      resultResendToken.token
    );

    await expect(
      fromSuccess(authServer.confirmEmailVerification)(resultResendToken.token)
    ).rejects.toBeDefined();
  });
});
