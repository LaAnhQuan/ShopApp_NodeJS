import Joi from "joi";
//import bcrypt from 'bcryptjs'; // Assuming bcrypt is used for encrypting the password

class InsertUserRequest {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
        this.role = data.role;
        this.avatar = data.avatar;
        this.phone = data.phone;
    }

    encryptPassword(password) {
        // Encrypt the password before storing it
        //   const salt = bcrypt.genSaltSync(10);
        //   return bcrypt.hashSync(password, salt);
        return "faked hashed password"
    }

    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(), // Ensure password has a minimum length
            name: Joi.string().required(),
            role: Joi.number().integer().min(1).required(), // Ensure role is a positive integer
            avatar: Joi.string().uri().allow('').optional(), // Optional and must be a valid URL
            phone: Joi.string().optional() // Optional field for phone numbers
        });

        return schema.validate(data); // Returns {error, value}
    }
}


export default InsertUserRequest;
