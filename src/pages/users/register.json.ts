
import { UserFromDTO } from "../../modules/identityaccess"
import z from "zod"

export let data: { [k: string]: FormDataEntryValue } = {
    firstname: '',
    lastname: "",
    emailAddress: "",
    emailAddressConfirmation: "",
    password: "",
    passwordConfrimation: "",
    username: ""
}

export const POST = async ({ request }) => {
    const form = await request.formData()
    data = Object.fromEntries(form)
    try {
        const result = UserFromDTO.schema.parse(data)
        return new Response(JSON.stringify(result), { status: 201 })
    } catch(err) {
        if (err instanceof z.ZodError) {
            const body = { errors: err.flatten(), data }
            return new Response(JSON.stringify(body), {status: 422})
        } 
    }
}