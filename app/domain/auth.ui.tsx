import { Eye, EyeOff } from "lucide-react";

const eyePassword = (eyeOn: boolean) => {
  return eyeOn ? <EyeOff size={16} /> : <Eye size={16} />;
};

export { eyePassword };
