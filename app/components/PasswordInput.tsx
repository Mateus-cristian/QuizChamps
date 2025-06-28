import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, type InputProps } from "./ui/input";
import { cn } from "app/components/lib/utils";
import { Label } from "./ui/label";

interface InputPropsComponent extends InputProps {
  label: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputPropsComponent>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;

    return (
      <div className="relative w-full">
        <div className="grid w-full max-w-sm items-center gap-3 ">
          <Label htmlFor={props.label}>{props.label}</Label>
          <Input
            placeholder={props.label}
            type={showPassword ? "text" : "password"}
            className={cn("hide-password-toggle pr-10 w-full", className)}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 bottom-0 px-3 py-2 hover:bg-transparent h-[36px]"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showPassword && !disabled ? (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
