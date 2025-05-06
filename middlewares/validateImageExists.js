import fs from 'fs'
import path from 'path';

const validateImageExists = (req, res, next) => {
    const imageName = req.body.image;
    // Check if imageName does NOT start with 'http://' or 'https://'
    if (imageName && !imageName.startsWith('http://') && !imageName.startsWith('https://')) {
        // Build the local path to where the image should be located
        const imagePath = path.join(__dirname, '../uploads', imageName);

        // Check if the image file exists on the server
        if (!fs.existsSync(imagePath)) {
            // If the file doesn't exist, return a 404 error response
            return res.status(404).json({
                message: 'Image file does not exist',
            });
        }
    }

    // If imageName is empty or a URL, or the file exists, continue to the next middleware
    next();
};
export default validateImageExists;