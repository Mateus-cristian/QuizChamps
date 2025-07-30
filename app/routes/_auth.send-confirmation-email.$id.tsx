import { Button } from "@/components/ui/button";
import { resendVerificationUsingToken } from "@/domain/auth.server";
import {
  Form,
  useNavigate,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

export const meta: MetaFunction = () => [
  { title: "Register" },
  { name: "register", content: "Page for register user" },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const token = params.id as string;
  await resendVerificationUsingToken(token);

  return null;
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
          <Button
            variant={"default"}
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
