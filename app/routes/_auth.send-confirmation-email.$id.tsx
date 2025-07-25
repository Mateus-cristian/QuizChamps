import { Button } from "@/components/ui/button";
import { resendVerificationUsingToken } from "@/domain/auth.server";
import { setFlashMessage } from "@/utils/flash-messages";
import {
  Form,
  redirect,
  useNavigate,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

export const meta: MetaFunction = () => [
  { title: "Register" },
  { name: "register", content: "Page for register user" },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = params.id;

  if (!token) {
    return redirect(
      "/sign-in",
      await setFlashMessage(request, "Token inválido ou ausente.", "error")
    );
  }

  return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const token = params.id;

  if (!token) {
    return redirect(
      "/sign-in",
      await setFlashMessage(request, "Token inválido ou ausente.", "error")
    );
  }

  const result = await resendVerificationUsingToken(token);

  if (result.success) {
    return redirect(
      `/sign-in`,
      await setFlashMessage(
        request,
        "Um e-mail de confirmação foi enviado para o endereço cadastrado.",
        "success"
      )
    );
  }

  return redirect(".");
}

export default function Component() {
  const navigate = useNavigate();

  return (
    <Form method="POST">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[384px] flex flex-col gap-4 px-4 mt-12 ">
          <p className="text-2xl font-medium text-center">
            Um e-mail de confirmação foi enviado para o endereço cadastrado.
          </p>
          <Button type="submit" className="cursor-pointer mt-5">
            Reenviar email de confirmação
          </Button>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => navigate("/sign-in")}
          >
            Voltar
          </Button>
        </div>
      </div>
    </Form>
  );
}
