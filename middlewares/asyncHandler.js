import e from "express";
import { stack } from "sequelize/lib/utils";

const asyncHandler = (fn) => {

    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            console.log('Detailed Error:', error);
            console.log('Error Details : ', { message: error.message, stack: error.stack })
            return res.status(500).json({
                message: 'Internal Server Error',
                //Including the error message can help with debugging
                //You might include more details based on the environment 
                error: process.env.NODE_ENV === 'development' ? error : ""
            });
        }
    }
}

export default asyncHandler