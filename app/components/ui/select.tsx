import * as React from "react";
import { cn } from "../lib/utils";

type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition outline-none focus-visible:ring-[3px] disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export { Select };
