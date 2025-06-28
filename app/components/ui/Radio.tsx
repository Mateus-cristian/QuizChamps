import React, { type JSX } from "react";
import { cn } from "../lib/utils";

const Radio = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ type = "radio", className, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-4 w-4 rounded-full",
      className,
      !className && "border-gray-300 text-pink-600 focus:ring-pink-500"
    )}
    {...props}
  />
));

export { Radio };
