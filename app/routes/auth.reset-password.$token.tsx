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
          <Button className="bg-orange cursor-pointer">Cadastrar</Button>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-orange cursor-pointer"
          >
            Voltar
          </Button>
        </div>
      </div>
    </Form>
  );
}
