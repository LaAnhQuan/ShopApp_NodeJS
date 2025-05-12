// File: imageHelper.js
import os from 'os';

/**
 * Ensures the avatar URL is prefixed with the API address if it is not already a full URL.
 * @param {string} avatarPath - The path to the user's avatar.
 * @returns {string} The full URL to the user's avatar.
 */
export const getAvatarURL = (imageName) => {
    // Kiểm tra nếu imageName không có giá trị hoặc là một chuỗi rỗng
    if (!imageName) {
        return "";
    }
    // Nếu avatar không phải là một URL HTTP và có giá trị, nối nó với API_PREFIX để tạo URL đầy đủ
    if (!imageName.includes('http')) {
        const API_PREFIX = `http://${os.hostname()}:${process.env.PORT || 3000}/api`;
        return `${API_PREFIX}/images/${imageName}`;
    }
    // Nếu imageName là một URL HTTP, trả về nguyên vẹn
    return imageName;
};
