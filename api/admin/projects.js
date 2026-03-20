const { auth, cors } = require('../utils/auth');
const { getData, saveData } = require('../utils/db');
const { handleUpload } = require('../utils/upload');

// Disable Vercel's default body parser to allow multer to process the multipart/form-data
module.exports.config = {
    api: {
        bodyParser: false,
    },
};

module.exports = exports = async function handler(req, res) {
    if (cors(req, res)) return;

    // Both GET and POST are protected under admin routes
    // But since `bodyParser: false` means req.body is undefined initially, 
    // we must handle auth by parsing the headers manually, which our auth utility does perfectly.
    if (!auth(req, res)) return; 

    if (req.method === 'GET') {
        const data = getData();
        return res.status(200).json(data.projects);
    }

    if (req.method === 'POST') {
        // Parse the upload and the rest of the form fields
        const imageUrl = await handleUpload(req, res, 'image');
        
        const data = getData();
        const body = req.body || {}; // populated by multer!
        
        const newProject = {
            id: Date.now(),
            title: body.title || '',
            description: body.description || '',
            category: body.category || 'web',
            icon: body.icon || 'fas fa-code',
            color: body.color || 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)',
            image: imageUrl || '',
            tags: body.tags ? body.tags.split(',').map(t => t.trim()) : [],
            features: body.features ? body.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
            link: body.link || '#',
            github: body.github || '#'
        };
        
        data.projects.push(newProject);
        saveData(data);
        
        return res.status(200).json({ success: true, project: newProject });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
