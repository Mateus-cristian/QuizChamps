import type { JSX } from "react";

const InputWrapper = (props: JSX.IntrinsicElements["div"]) => {
  return <div className="flex items-center gap-2" {...props} />;
};

export { InputWrapper };
