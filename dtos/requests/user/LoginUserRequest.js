import Joi from "joi";
//import bcrypt from 'bcryptjs'; // Assuming bcrypt is used for encrypting the password

class LoginUserRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
    }


    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).required(), // Ensure password has a minimum length
            phone: Joi.string().optional() // Optional field for phone numbers
        });

        return schema.validate(data); // Returns {error, value}
    }
}


export default LoginUserRequest