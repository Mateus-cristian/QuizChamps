import { SchemaForm } from "@/components/ui/schema-form";
import { schemaEmail, shemaSignUp } from "@/domain/auth.commom";
import { eyePassword } from "@/domain/auth.ui";
import { useState } from "react";
import {
  redirect,
  useNavigate,
  type ActionFunctionArgs,
  type MetaFunction,
} from "react-router";
import { performMutation } from "remix-forms";
import { ensureEmailNotInUse, registerUser } from "@/domain/auth.server";
import { setFlashMessage } from "@/utils/flash-messages";

export const meta: MetaFunction = () => [
  { title: "Register" },
  { name: "register", content: "Page for register user" },
];

export function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const isUserNotExistsResult = await performMutation({
    request,
    schema: schemaEmail,
    mutation: ensureEmailNotInUse,
  });

  if (!isUserNotExistsResult.success) {
    return redirect(
      ".",
      await setFlashMessage(
        request,
        "Este e-mail já está cadastrado. Se você esqueceu sua senha, redefina-a para acessar sua conta.",
        "warning"
      )
    );
  }

  const result = await performMutation({
    request,
    schema: shemaSignUp,
    mutation: registerUser,
  });

  if (!result.success) {
    return redirect(
      ".",
      await setFlashMessage(
        request,
        "Ocorreu um erro ao criar o usuário,tente novamente,caso persista contate suporte",
        "error"
      )
    );
  }

  return redirect(
    "/sign-in",
    await setFlashMessage(
      request,
      "Um e-mail de confirmação foi enviado para o endereço cadastrado.",
      "success"
    )
  );
}

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <SchemaForm
      schema={shemaSignUp}
      labels={{
        email: "E-mail",
        name: "Nome",
        password: "Senha",
        confirmPassword: "Confirmar senha",
      }}
      placeholders={{
        email: "E-mail",
        name: "Nome",
        password: "Senha",
        confirmPassword: "Confirmar senha",
      }}
      method="POST"
    >
      {({ Field, Errors, Button }) => (
        <>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[384px] flex flex-col gap-4 px-4 mt-12 ">
              <Field name="name">
                {({ Label, Input, Errors }) => (
                  <>
                    <Label />
                    <Input />
                    <Errors />
                  </>
                )}
              </Field>
              <Field name="email">
                {({ Label, Input, Errors }) => (
                  <>
                    <Label />
                    <Input />
                    <Errors />
                  </>
                )}
              </Field>
              <Field
                name="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
              >
                {({ Label, Input, Errors }) => (
                  <>
                    <div className="flex justify-between">
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
              <Field
                name="confirmPassword"
                label="Confirmar senha"
                type={showPassword ? "text" : "password"}
              >
                {({ Label, Input, Errors }) => (
                  <>
                    <div className="flex justify-between">
                      <Label />
                    </div>
                    <Input autoCapitalize="none" />
                    <Errors />
                  </>
                )}
              </Field>
              <Errors />
              <Button>Cadastrar</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </div>
          </div>
        </>
      )}
    </SchemaForm>
  );
}
