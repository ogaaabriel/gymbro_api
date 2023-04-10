import { z } from "zod";

export const CreateEventValidate = z
  .object({
    title: z.string({ required_error: "Título não pode ser nulo" }),
    description: z.string({ required_error: "Título não pode ser nulo" }),
    eventDate: z
      .string({ required_error: "Data do evento não pode ser nula" })
      .datetime({ message: "Data inválida" }),
    public: z.boolean().optional(),
    hasLimit: z.boolean().optional(),
    limitCount: z
      .number()
      .positive({ message: "Número máximo de participantes deve ser positivo" })
      .gt(1, "Número de participantes deve ser maior que 1")
      .optional(),
    adminId: z.number({ required_error: "Admin Id não pode ser nulo" }),
  })
  .refine((schema) => {
    return schema.hasLimit === true && schema.limitCount;
  }, "Deve ser informado um limite de participantes")
  .refine((schema) => {
    const dateInput = new Date(schema.eventDate);
    const dateNow = new Date();
    return dateInput > dateNow;
  }, "Data do evento não pode ser menor que a data atual");
