import type { JSX } from "react";

const Errors = (props: JSX.IntrinsicElements["div"]) => {
  return <div className="flex flex-col space-y-2 text-center" {...props} />;
};

export { Errors };
