import { InputWithLabel } from "@/components/inputWithLabel";

import { Button } from "@/components/ui/button";
import { Form, Link, useNavigate, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Login" },
  { name: "login", content: "Page login" },
];

export function loader() {
  return null;
}

export default function Component() {
  const navigate = useNavigate();

  return (
    <Form method="POST">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[384px] flex flex-col gap-4 px-4 mt-12 ">
          <InputWithLabel
            label="Email"
            name="email"
            placeholder="Email"
            id="Email"
          />
          <div className="flex flex-col w-full items-center">
            {/* <PasswordInput label="Senha" /> */}
            <Link
              className="text-orange-dark font-medium text-sm self-start"
              to="/auth/forgot-password"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Button className="bg-orange cursor-pointer">Login</Button>
          <Button
            type="button"
            onClick={() => navigate("/auth/sign-up")}
            className="bg-orange cursor-pointer w-full"
          >
            Registrar
          </Button>
        </div>
      </div>
    </Form>
  );
}
