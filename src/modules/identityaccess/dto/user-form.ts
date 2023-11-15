import z from "zod"

export type UserForm = {
    firstname: string
    lastname: string
    emailAddress: string
    password: string
    passwordConfrimation: string
}

export const schema: z.ZodType<UserForm> = z.object({
    firstname: z.string().min(4),
    lastname: z.string().min(4),
    emailAddress: z.string().email(),
    password: z.string().min(4).max(8),
    passwordConfrimation: z.string().min(4).max(8)
}).superRefine(({passwordConfrimation, password}, context) => {
    if (passwordConfrimation !== password) {
        context.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }
})

