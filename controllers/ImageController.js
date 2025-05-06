/**
 - Upload file to local server
 - Upload images to Google Firebase(Filestore)
 - Cloundinary, AWS, ...
*/
import { error } from 'console'
import path from 'path'
import fs from 'fs'

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

    }
}