import Joi from "joi";
import { UserRole } from "../../../constants";
import { join } from "path";
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
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(), // optional(Login Facebook, Google)
            name: Joi.string().required(),
            role: Joi.number().required().default(1),
            avatar: Joi.string().uri().allow('').optional(), // Optional and must be a valid URL
            phone: Joi.string().optional() // Optional field for phone numbers
        });

        return schema.validate(data); // Returns {error, value}
    }
}


export default InsertUserRequest;
