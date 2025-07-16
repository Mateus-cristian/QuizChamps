import { Form, Outlet, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "New React Router App" },
  { name: "description", content: "Welcome to React Router!" },
];

export function loader() {
  return null;
}

export default function Auth() {
  return (
    <div>
      <div className="flex justify-center flex-col h-screen w-full">
        <h1 className="text-center font-bold text-3xl">QuizChamps</h1>
        <Outlet />
      </div>
    </div>
  );
}
