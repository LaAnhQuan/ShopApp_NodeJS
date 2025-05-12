/**
 - Upload file to local server
 - Upload images to Google Firebase(Filestore)
 - Cloundinary, AWS, ...
*/
import { error } from 'console'
import path from 'path'
import fs from 'fs'
import db from '../models';
import { Sequelize } from "sequelize";
import os from 'os';
import { getAvatarURL } from "../helpers/imageHelper";

const checkImageInUse = async (imageUrl) => {
    const modelFields = {
        User: 'avatar',     // Trường `avatar` cho User
        Category: 'image',
        Brand: 'image',
        Product: 'image',
        News: 'image',
        Banner: 'image',
        ProductImage: 'image_url'
    };

    const models = [db.User, db.Category, db.Brand, db.Product, db.News, db.Banner, db.ProductImage];

    // Duyệt qua từng model
    for (let model of models) {
        // Lấy tên trường tương ứng từ đối tượng modelFields
        const fieldName = modelFields[model.name];

        // Tạo đối tượng truy vấn dựa trên tên trường
        let query = {};
        query[fieldName] = imageUrl;

        // Tìm bản ghi với điều kiện truy vấn
        const result = await model.findOne({ where: query });
        if (result) {
            console.log(`Found in model :  ${model.name}, Field: ${fieldName}, Image URL: ${imageUrl}`)
            return true; // Nếu tìm thấy bản ghi, trả về true
        }
    }

    return false; // Nếu không tìm thấy bản ghi nào, trả về false
};
module.exports = {
    uploadImages: async (req, res) => {
        // Kiem tra neu khong co file nao duoc tai len
        if (req.files.length === 0) {
            throw new Error('No file is upload');
        }
        //Tra ve duong dan cua cac file anh duoc tai len 
        const uploadedImagesPaths = req.files.map(file => path.basename(file.path).trim())

        res.status(201).json({
            message: 'Upload image successfully',
            files: uploadedImagesPaths
        })
    },
    viewImage: async (req, res) => {
        const { fileName } = req.params
        const imagePath = path.join(path.join(__dirname, '../uploads'), fileName)
        fs.access(imagePath, fs.constants.F_OK, (error) => {
            if (error) {
                // If the file does not exist, send a 404 response
                return res.status(404).send('Image not found')
            }
            // If the file exists, send it as the response
            res.sendFile(imagePath)
        })

    },

    deleteImage: async (req, res) => {
        const { url: rawUrl } = req.body;
        //Trim any spaces around the URL to ensure accurate comparison and file operations
        const url = rawUrl.trim();
        try {
            // check if the image URL is still in use in any of the database tables 
            const isInUse = await checkImageInUse(url);
            if (isInUse) {
                return res.status(500).json({
                    message: 'Image still using in database'
                });
            }

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                // Assume url is a local filename
                const filePath = path.join(__dirname, '../uploads/', path.basename(url));

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                return res.status(200).json(
                    { message: 'Image successfully deleted from local storage' });

            } else {
                return res.status(400).json({ message: 'Invalid image URL format' });
            }

        } catch (error) {
            res.status(500).json({
                message: 'Error while deleting the image',
                error: error.message
            });
        }
    }
}