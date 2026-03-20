const multer = require('multer');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

/**
 * Parses multipart/form-data request and returns a Base64 data URL
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {string} fieldName 
 */
async function handleUpload(req, res, fieldName = 'image') {
    try {
        // Run the multer middleware to parse the request
        await runMiddleware(req, res, uploadMiddleware.single(fieldName));
        
        // If a file was uploaded, convert it to Base64
        if (req.file && req.file.buffer) {
            const base64Str = req.file.buffer.toString('base64');
            const mimeType = req.file.mimetype;
            return `data:${mimeType};base64,${base64Str}`;
        }
        return null; // no file uploaded
    } catch (error) {
        console.error("Upload error:", error);
        return null;
    }
}

module.exports = { handleUpload };
