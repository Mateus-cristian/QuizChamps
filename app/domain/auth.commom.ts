import { z } from "zod";

const shemaSignIn = z.object({
    email: z.string().email("O email é obrigatorio"),
    password: z.string().nonempty("A senha é obrigatoria")
})

const shemaSignUp = z.object({
    name: z.string().min(1,"O nome é obrigatorio"),
    email: z.string().email("O email é obrigatorio"),
    password: z.string()
                .min(8, "A senha deve ter no mínimo 8 caracteres")
                .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
                .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
                .regex(/[0-9]/, "A senha deve conter pelo menos um número")
                .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
    confirmPassword: z.string()
                .min(8, "A senha deve ter no mínimo 8 caracteres")
                .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
                .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
                .regex(/[0-9]/, "A senha deve conter pelo menos um número")
                .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"], 
  });

export { shemaSignIn, shemaSignUp }