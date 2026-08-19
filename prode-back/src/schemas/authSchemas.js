import { z } from "zod";


export const registerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),

  email: z
    .string()
    .email("El email no es válido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("El email no es válido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});


