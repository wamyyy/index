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
    if (!auth(req, res)) return;

    const { id } = req.query; // populated by Vercel for [id].js dynamic routes
    const data = getData();
    const idx = data.projects.findIndex(p => String(p.id) === String(id));

    if (idx === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (req.method === 'DELETE') {
        data.projects.splice(idx, 1);
        saveData(data);
        return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
        const imageUrl = await handleUpload(req, res, 'image');
        const body = req.body || {}; // populated by multer
        const existing = data.projects[idx];

        data.projects[idx] = {
            ...existing,
            title: body.title ?? existing.title,
            description: body.description ?? existing.description,
            category: body.category ?? existing.category,
            icon: body.icon ?? existing.icon,
            color: body.color ?? existing.color,
            // If new image uploaded, use it. Else check if we should keep existing.
            image: imageUrl ? imageUrl : ((body.keepImage === 'true' || body.keepImage === true) ? existing.image : ''),
            tags: body.tags ? body.tags.split(',').map(t => t.trim()) : existing.tags,
            features: body.features ? body.features.split('\n').map(f => f.trim()).filter(Boolean) : existing.features,
            link: body.link ?? existing.link,
            github: body.github ?? existing.github
        };
        saveData(data);
        return res.status(200).json({ success: true, project: data.projects[idx] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
