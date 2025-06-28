import { cn } from "app/components/lib/utils";
import type { JSX } from "react";

const Field = ({ className, ...props }: JSX.IntrinsicElements["div"]) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props} />
  );
};

export { Field };
