import Joi from "joi";

class UpdateProductRequest {
    constructor(data) {
        this.name = data.name;
        this.price = data.price;
        this.oldprice = data.oldprice;
        this.image = data.image;
        this.description = data.description;
        this.specification = data.specification;
        this.buyturn = data.buyturn;
        this.quantity = data.quantity;
        this.brand_id = data.brand_id;
        this.category_id = data.category_id;
        this.attributes = data.attributes; // Mảng attributes động
        this.variants = data.variants;
        this.variant_values = data.variant_values
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().optional(),
            price: Joi.number().positive().optional(),
            oldprice: Joi.number().positive().optional(),
            image: Joi.string().allow("").optional(),
            description: Joi.string().optional(),
            specification: Joi.string().optional(),
            buyturn: Joi.number().integer().min(0).optional(),
            quantity: Joi.number().integer().min(0).optional(),
            brand_id: Joi.number().integer().optional(),
            category_id: Joi.number().integer().optional(),
            attributes: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(), //Tên thuộc tính, ví dụ : "Màn hình", "RAM"
                    value: Joi.string().required() // Giá trị thuộc tính, ví dụ: "6.7 inch", "8GB"
                })
            ).optional(), //Mảng attributes là tùy chọn
            variants: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    values: Joi.array().items(Joi.string()).required()
                })
            ).optional(),
            variant_values: Joi.array().items(
                Joi.object({
                    variant_combination: Joi.array().items(Joi.string()).required(),
                    price: Joi.number().positive().optional(),
                    old_price: Joi.number().positive().optional(),
                    stock: Joi.number().integer().min(0).optional(),
                    image: Joi.string().allow(""),
                })
            ).optional()
        });

        return schema.validate(data); // {error, value}
    }
}

export default UpdateProductRequest;
