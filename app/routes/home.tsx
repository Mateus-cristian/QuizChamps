import { Welcome } from "../welcome/welcome";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "New React Router App" },
  { name: "description", content: "Welcome to React Router!" },
];

export function loader() {
  return null; 
}

export default function Home() {
  return <Welcome />;
}
