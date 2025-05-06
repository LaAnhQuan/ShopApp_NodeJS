/**
 - Upload file to local server
 - Upload images to Google Firebase(Filestore)
 - Cloundinary, AWS, ...
*/
import { error } from 'console'
import path from 'path'

module.exports = {
    uploadImages: async (req, res) => {
        // Kiem tra neu khong co file nao duoc tai len
        if (req.files.length === 0) {
            throw new error('No file is upload');
        }
        //Tra ve duong dan cua cac file anh duoc tai len 
        const uploadedImagesPaths = req.files.map(file => path.basename(file.path))

        res.status(201).json({
            message: 'Upload image successfully',
            files: uploadedImagesPaths
        })
    },
}