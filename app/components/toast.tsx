import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { CircleAlert, TriangleAlert } from "lucide-react";

type ToastType =
  | "success"
  | "error"
  | "loading"
  | "custom"
  | "warning"
  | "blank"
  | "info";

type Flash = {
  message: string;
  type: ToastType;
  timeout: number;
};

type ToastFunction = (message: string, options?: any) => void;
type ToastCustomFunction = (
  toastElement: React.ReactElement,
  options?: any
) => void;

type CustomToastProps = {
  type: "warning" | "info" | "custom";
  message: string;
};

export function CustomToast({ type, message }: CustomToastProps) {
  const icon =
    type === "info" ? (
      <CircleAlert className="text-blue-500" size={20} />
    ) : (
      <TriangleAlert className="text-yellow-500" size={20} />
    );

  return (
    <div
      className="flex items-center px-3 py-3 bg-white text-neutral-800 rounded-lg shadow-lg w-[230px] max-w-[350px] pointer-events-auto "
      style={{
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
      }}
      role="alert"
    >
      {icon}
      <div className=" flex-1 ml-3 text-gray-700 whitespace-pre-line font-normal leading-snug">
        {message}
      </div>
    </div>
  );
}

function callToast(
  toastMethod: ToastFunction | ToastCustomFunction,
  type: ToastType,
  message: string,
  options: any
) {
  if (type === "custom" || type === "warning" || type === "info") {
    return (toastMethod as ToastCustomFunction)(
      <CustomToast type={type} message={message} />,
      options
    );
  } else {
    return (toastMethod as ToastFunction)(message, options);
  }
}

type ToastProviderProps = {
  flash: Flash | null;
};

export function ToastProvider({ flash }: ToastProviderProps) {
  useEffect(() => {
    if (!flash) return;

    import("react-hot-toast").then(({ default: toast }) => {
      const toastMethods: Record<
        ToastType,
        ToastFunction | ToastCustomFunction
      > = {
        success: toast.success,
        error: toast.error,
        loading: toast.loading,
        custom: toast.custom,
        warning: toast.custom,
        info: toast.custom,
        blank: toast.custom,
      };

      const toastMethod = toastMethods[flash.type] ?? toast;

      callToast(toastMethod, flash.type, flash.message, {
        duration: flash.timeout * 1000,
      });
    });
  }, [flash]);

  return <Toaster position="top-right" />;
}
