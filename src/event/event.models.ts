import { z } from "zod";
import { UpdateEventDate, UpdateEventInfo } from "../types/event";

const isValidLimit = (schema: UpdateEventInfo) => {
  if (schema.hasLimit) {
    return schema.limitCount;
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
    eventDate: z
      .string({ required_error: "Data do evento não pode ser nula" })
      .datetime({ message: "Data inválida" }),
    isPublic: z.boolean().optional(),
    hasLimit: z.boolean().optional(),
    limitCount: z
      .number()
      .positive({ message: "Número máximo de participantes deve ser positivo" })
      .gt(1, "Número de participantes deve ser maior que 1")
      .optional(),
    geocode: z.array(z.number({ required_error: "Geocode não pode ser nulo" })),
    address: z.string({ required_error: "Endereço não pode ser nulo" }),
    adminId: z.number({ required_error: "Admin Id não pode ser nulo" }),
  })
  .refine(isValidLimit, "Deve ser informado um limite de participantes")
  .refine(isValidDate, "Data do evento não pode ser menor que a data atual");

export const UpdateEventInfoValidate = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
    hasLimit: z.boolean().optional(),
    limitCount: z
      .number()
      .positive({ message: "Número máximo de participantes deve ser positivo" })
      .gt(1, "Número de participantes deve ser maior que 1")
      .optional(),
    geocode: z
      .array(z.number({ required_error: "Geocode não pode ser nulo" }))
      .optional(),
    address: z.string().optional(),
  })
  .refine(isValidLimit, "Deve ser informado um limite de participantes");

export const UpdateEventDateValidate = z
  .object({
    eventDate: z
      .string({ required_error: "Data do evento não pode ser nula" })
      .datetime({ message: "Data inválida" }),
  })
  .refine(isValidDate, "Data do evento não pode ser menor que a data atual");
