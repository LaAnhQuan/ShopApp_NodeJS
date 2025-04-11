import Joi from "joi";

class UpdateNewsRequest {
    constructor(data) {
        this.title = data.title;
        this.image = data.image;
        this.content = data.content;
        this.product_ids = data.product_ids;
    }
    static validate(data) {
        const schema = Joi.object({
            title: Joi.string().optional().allow(null),
            image: Joi.string().uri().allow("", null).optional(),
            content: Joi.string().optional().allow(null),
        });

        return schema.validate(data); // {error, values}
    }
}

export default UpdateNewsRequest;