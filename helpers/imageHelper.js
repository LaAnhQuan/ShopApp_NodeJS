// File: imageHelper.js
import os from 'os';

/**
 * Ensures the avatar URL is prefixed with the API address if it is not already a full URL.
 * @param {string} avatarPath - The path to the user's avatar.
 * @returns {string} The full URL to the user's avatar.
 */
export const getAvatarURL = (imageName) => {
    if (imageName && !imageName.includes('http')) {
        const API_PREFIX = `http://${os.hostname()}:${process.env.PORT || 3000}/api`;
        return `${API_PREFIX}/images/${imageName}`;
    }
    return imageName;
};
