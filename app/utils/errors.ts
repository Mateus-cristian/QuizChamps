const ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
} as const;

type ErrorCode = keyof typeof ERROR_CODES;

type ErrorDetail = {
  message: string;
  code?: ErrorCode;
};

function extractCodeAndMessageError(errors: unknown): ErrorDetail {
  const fallback = { message: "Erro desconhecido" };

  if (!errors || typeof errors !== "object" || errors === null) return fallback;

  const raw = (errors as any)._global?.[0];
  if (!raw || typeof raw !== "string") return fallback;

  try {
    const parsed = JSON.parse(raw);
    return {
      message: parsed.message || fallback.message,
      code: parsed.code,
    };
  } catch {
    return { message: raw };
  }
}

function AppError(message: string, code?: ErrorCode, status = 400): Error {
  const payload = { message, code, status };

  const error = new Error(JSON.stringify(payload)) as Error & typeof payload;

  error.name = "AppError";
  error.code = code;
  error.status = status;

  Object.setPrototypeOf(error, Error.prototype);

  return error;
}

export { extractCodeAndMessageError, AppError, ERROR_CODES };
