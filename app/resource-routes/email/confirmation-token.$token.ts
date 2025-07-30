import { confirmEmailVerification } from "@/domain/auth.server";
import { setFlashMessage } from "@/utils/flash-messages";
import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const tokenId = params.token as string;

  const result = await confirmEmailVerification(tokenId);

  const messageFlash = !result.success
    ? "Usuário já verificado ou token inválido!"
    : "Email verificado com sucesso!";
  const typeFlash = !result.success ? "error" : "success";

  return redirect(
    "/sign-in",
    await setFlashMessage(request, messageFlash, typeFlash)
  );
}
