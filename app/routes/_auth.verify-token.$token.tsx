import { Button } from "@/components/ui/button";
import { Form, useNavigate, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Register" },
  { name: "register", content: "Page for register user" },
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
          <p className="text-2xl font-medium text-center">
            Token Válidado com sucesso 🎉
          </p>
          <Button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="bg-orange cursor-pointer mt-5"
          >
            Voltar
          </Button>
        </div>
      </div>
    </Form>
  );
}
