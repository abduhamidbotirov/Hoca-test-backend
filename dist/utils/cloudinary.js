var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL);
function uploader(data, name) {
    return __awaiter(this, void 0, void 0, function* () {
        cloudinary.uploader.destroy(name);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            cloudinary.uploader
                .upload_stream({
                folder: "img",
                public_id: name,
                use_filename: true,
            }, (error, result) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                }
                else if (result) {
                    // Create a new work experience record
                    resolve(result.secure_url);
                }
            })).end(data);
        }));
    });
}
export default uploader;
