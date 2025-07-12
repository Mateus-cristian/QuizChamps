import { sessionStorage } from "@/session";

export type Flash = {
  message: string;
  type: "success" | "error" | "info" | "warning" | "custom" | "loading";
  timeout: number;
};

export async function getFlashMessage(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const raw = session.get("flashMessage");
  let flash: Flash | null = null;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed.message === "string" &&
        typeof parsed.type === "string" &&
        typeof parsed.timeout === "number"
      ) {
        flash = parsed;
      }
    } catch {
      // fallback: flash permanece null
    }
  }

  return {
    flash,
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}

export async function setFlashMessage(
  request: Request,
  message: Flash["message"],
  type: Flash["type"] = "info",
  timeout: Flash["timeout"] = 4
) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  session.flash("flashMessage", JSON.stringify({ message, type, timeout }));

  return {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  };
}
