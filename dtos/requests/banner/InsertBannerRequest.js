import Joi from "joi";

class InsertBannerRequest {
    constructor(data) {
        this.name = data.title;
        this.image = data.image;
        this.status = data.content;
    }
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().required(),
            image: Joi.string().allow("", null),
            status: Joi.number().integer().min(1).required(),
        });

        return schema.validate(data); // {error, values}
    }
}

export default InsertBannerRequest;