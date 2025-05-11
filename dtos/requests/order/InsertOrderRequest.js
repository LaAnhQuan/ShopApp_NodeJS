import Joi from "joi";

class InsertOrderRequest {
    constructor(data) {
        this.user_id = data.user_id;
        this.status = data.status;
        this.note = data.note;
        this.total = data.total;
        this.phone = data.phone;
        this.address = data.address;
    }

    static validate(data) {
        const schema = Joi.object({
            user_id: Joi.number().integer().required(),
            status: Joi.number().integer().min(1).required(),
            note: Joi.string().optional().allow(''),
            phone: Joi.string().pattern(/^[0-9]+$/).required(), //Yêu cầu phone là chuỗi số, bắt buộc
            address: Joi.string().allow('').optional(), // Cho phép address là chuỗi có thể để trống
            total: Joi.number().integer().min(0).required()
        });

        return schema.validate(data); // Returns {error, value}
    }
}

export default InsertOrderRequest;