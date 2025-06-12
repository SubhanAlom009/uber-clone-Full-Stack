import { User } from "../models/user.model.js";

export const createUser = async ({
    firstname,
    lastname,
    email,
    password,
})=>{
    

    if(!firstname || !email || !password){
        throw new Error("Please fill all the fields");
    }

    try {
        const user = await User.create({
            fullname: {
                firstname,
                lastname,
            },
            email,
            password,
        });

        return user;
    } catch (error) {
        throw new Error("Failed to create user");
    }
}