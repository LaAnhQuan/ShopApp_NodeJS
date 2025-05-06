import path from 'path'
import multer from 'multer'
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destinationPath = path.join(__dirname, '../uploads')
        callback(null, destinationPath)
    },
    filename: (req, file, callback) => {
        const newFileName = `${Date.now()}-${file.originalname}`
        callback(null, newFileName)
    },
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback("Only image files are allowed to be uploaded!", false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fieldSize: 1024 * 1024 * 5 //limit 5Mb 
    }
})

export default upload