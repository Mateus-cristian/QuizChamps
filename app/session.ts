import { createCookieSessionStorage } from "react-router";

type SessionData = {
  userId?: string;
  flashMessage?: string;
};

type SessionFlashData = {
  flashMessage?: string;
};

const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: process.env.NODE_ENV === "production",
  },
});

export { sessionStorage };
