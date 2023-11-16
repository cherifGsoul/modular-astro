import z from "zod"

export type UserForm = {
    firstname: string
    lastname: string
    emailAddress: string
    emailAddressConfirmation: string
    password: string
    passwordConfrimation: string
    username: string
}

export const schema: z.ZodType<UserForm> = z.object({
    firstname: z.string().min(4),
    lastname: z.string().min(4),
    emailAddress: z.string().email(),
    emailAddressConfirmation: z.string().email(),
    password: z.string().min(4).max(8),
    passwordConfrimation: z.string().min(4).max(8),
    username: z.string().min(5).max(8)
}).superRefine(({passwordConfrimation, password, emailAddress, emailAddressConfirmation}, context) => {
    if (passwordConfrimation !== password) {
        context.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }

    if (emailAddressConfirmation !== emailAddress) {
        context.addIssue({
            code: "custom",
            message: "The email addresses did not match"
        });
    }
})


const toRegisterUserCommand = (form: UserForm) => {

}
