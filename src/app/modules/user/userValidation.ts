import z from "zod";

const createUserValidationSchema = z.object({
    name: z.string().nonempty("Name is required"),
    password: z.string(),
    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact Number is required"),
    role: z.enum(["BUYER", "SELLER", "ADMIN"]).optional(),
});

export const UserValidation = {
    createUserValidationSchema,
};