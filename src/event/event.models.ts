import { z } from "zod";
import { UpdateEventDate, UpdateEventInfo } from "../types/event";

const isValidLimit = (schema: UpdateEventInfo) => {
  if (schema.hasLimit) {
    return schema.limitCount && schema.limitCount > 1;
  }
  return true;
};

const isValidDate = (schema: UpdateEventDate) => {
  const dateInput = new Date(schema.eventDate);
  const dateNow = new Date();
  return dateInput > dateNow;
};

export const CreateEventValidate = z
  .object({
    title: z.string({ required_error: "Título não pode ser nulo" }),
    description: z.string({ required_error: "Título não pode ser nulo" }),
    eventTypeId: z.number({ required_error: "Por favor, informe a categoria do evento" }),
    eventDate: z
      .string({ required_error: "Data do evento não pode ser nula" })
      .datetime({ message: "Data inválida" }),
    isPublic: z.boolean().optional(),
    hasLimit: z.boolean().optional(),
    limitCount: z
      .number()
      .optional(),
    geocode: z.array(z.number({ required_error: "Geocode não pode ser nulo" })),
    address: z.string({ required_error: "Endereço não pode ser nulo" }),
    adminId: z.number({ required_error: "Admin Id não pode ser nulo" }),
  })
  .refine(isValidLimit, "Deve ser informado um limite de participantes maior que 1")
  .refine(isValidDate, "Data do evento não pode ser menor que a data atual");

export const UpdateEventInfoValidate = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    eventTypeId: z.number().positive({ message: "Por favor, informe a categoria do evento" }),
    isPublic: z.boolean().optional(),
    hasLimit: z.boolean().optional(),
    limitCount: z
      .number()
      .optional(),
    geocode: z
      .array(z.number({ required_error: "Geocode não pode ser nulo" }))
      .optional(),
    address: z.string().optional(),
  })
  .refine(isValidLimit, "Deve ser informado um limite de participantes maior que 1");

export const UpdateEventDateValidate = z
  .object({
    eventDate: z
      .string({ required_error: "Data do evento não pode ser nula" })
      .datetime({ message: "Data inválida" }),
  })
  .refine(isValidDate, "Data do evento não pode ser menor que a data atual");
