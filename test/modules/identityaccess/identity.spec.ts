import { test } from "tap";

test('identity', (t) => {
    let users: Users = new InMemoryUsers()
    let identity: Identity = new Identity(users)

    t.afterEach(async () => {
        await users.clear()
    })
   

    t.test("authenticate user", async () => {
        const invalidatedUser = {
            person:{
                personalName: {
                    firstName: "Cherif",
                    lastName: "Bouch"
                }
            },
            password: "azerty",
            emailAddress: "cherif@site.com"
        };

        const userWasRegistred = await registerUser(invalidatedUser);
        const signInData = {
            emailAddress: invalidatedUser.emailAddress,
            password: invalidatedUser.password,
        }
        const userToken = await authenticate(signInData)
        t.equal(userToken.id, userWasRegistred.id)
        t.equal(userToken.emailAddress, userWasRegistred.emailAddress)

    })
})