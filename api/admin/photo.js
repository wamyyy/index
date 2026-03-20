const { auth, cors } = require('../../utils/auth');
const { getData, saveData } = require('../../utils/db');
const { handleUpload } = require('../../utils/upload');

module.exports.config = {
    api: {
        bodyParser: false,
    },
};

module.exports = exports = async function handler(req, res) {
    if (cors(req, res)) return;
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    if (!auth(req, res)) return;

    const imageUrl = await handleUpload(req, res, 'photo');

    if (!imageUrl) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = getData();
    data.profilePhoto = imageUrl;
    saveData(data);

    return res.status(200).json({ success: true, profilePhoto: data.profilePhoto });
};
