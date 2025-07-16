import { shemaSignIn } from "@/domain/auth.commom";
import { eyePassword } from "@/domain/auth.ui";
import { useState } from "react";
import {
  Link,
  redirect,
  useNavigate,
  type ActionFunctionArgs,
  type MetaFunction,
} from "react-router";
import { SchemaForm } from "@/components/ui/schema-form";
import { performMutation } from "remix-forms";
import { login } from "@/domain/auth.server";
import { setFlashMessage } from "@/utils/flash-messages";

export const meta: MetaFunction = () => [
  { title: "Login" },
  { name: "login", content: "Page login" },
];

export function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await performMutation({
    request,
    schema: shemaSignIn,
    mutation: login,
  });

  if (!result.success) {
    return redirect(
      ".",
      await setFlashMessage(request, "Usuário não encontrado", "error")
    );
  }

  redirect("home");
}

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <SchemaForm
      schema={shemaSignIn}
      labels={{
        email: "E-mail",
        password: "Senha",
      }}
      placeholders={{
        email: "E-mail",
        password: "Senha",
      }}
      method="POST"
    >
      {({ Field, Errors, Button }) => (
        <>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[384px] flex flex-col gap-4 px-4 mt-12 ">
              <Field name="email">
                {({ Label, Input, Errors }) => (
                  <>
                    <Label />
                    <Input />
                    <Errors />
                  </>
                )}
              </Field>
              <div className="flex flex-col w-full items-center">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                >
                  {({ Label, Input, Errors }) => (
                    <>
                      <div className="flex justify-between w-full">
                        <Label />
                        <button
                          className="flex text-blue font-bold cursor-pointer"
                          type="button"
                          tabIndex={1}
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {eyePassword(showPassword)}
                          <span className="min-w-[55px] text-right text-lg text-gray-darker font-normal">
                            {showPassword ? "Ocultar" : "Mostrar"}
                          </span>
                        </button>
                      </div>
                      <Input autoCapitalize="none" />
                      <Errors />
                    </>
                  )}
                </Field>
                <Link
                  className="text-orange-dark font-medium text-sm self-start"
                  to="/auth/forgot-password"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <Button>Login</Button>
              <Button type="button" onClick={() => navigate("/sign-up")}>
                Registrar
              </Button>
            </div>
          </div>
        </>
      )}
    </SchemaForm>
  );
}
