"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (file, folder = "nomad-ai") => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(file, {
            folder,
            resource_type: "auto",
        });
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Failed to upload to Cloudinary");
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        throw new Error("Failed to delete from Cloudinary");
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map