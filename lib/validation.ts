import { z } from "zod";

export const userFormValidation = z.object({
  username: z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(50, "Username cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
      "Invalid phone number"
    ),
});
