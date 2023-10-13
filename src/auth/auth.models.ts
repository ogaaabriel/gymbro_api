import { z } from "zod";

export const LoginValidate = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string(),
});

export const SignupValidate = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/, {
      message:
        "A senha deve ter pelo menos 8 caracteres, contendo letras, números e caracteres especiais",
    }),
  firstName: z
    .string({ required_error: "Nome não pode ser nulo" })
    .min(3, { message: "Nome deve ter ao menos 3 caracteres" }),
  lastName: z
    .string({ required_error: "Sobrenome não pode ser nulo" })
    .min(3, { message: "Sobrenome deve ter ao menos 3 caracteres" }),
});

export const emailValidate = (email: string) => {
  const schema = z
    .string({ required_error: "Email não pode ser nulo" })
    .email({ message: "Email inválido" });
  schema.parse(email);
};

export const passwordValidate = (password: string) => {
  const schema = z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/, {
      message:
        "A senha deve ter pelo menos 8 caracteres, contendo letras, números e caracteres especiais",
    });
  schema.parse(password);
};
