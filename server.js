const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;
const SECRET = 'ayoub_admin_secret_2026';
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${ext}`;
        cb(null, name);
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Read data
function getData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper: Write data
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware: Verify JWT
function auth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

// ========== PUBLIC ROUTES ==========

// GET portfolio data (public)
app.get('/api/portfolio', (req, res) => {
    const data = getData();
    res.json(data);
});

// POST login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'ayoubelwamy' && password === 'ayoub101219642006') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '8h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// ========== PROTECTED ROUTES ==========

// POST upload profile photo
app.post('/api/admin/photo', auth, upload.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const data = getData();
    data.profilePhoto = `/uploads/${req.file.filename}`;
    saveData(data);
    res.json({ success: true, profilePhoto: data.profilePhoto });
});

// GET all projects (admin)
app.get('/api/admin/projects', auth, (req, res) => {
    const data = getData();
    res.json(data.projects);
});

// POST add project
app.post('/api/admin/projects', auth, upload.single('image'), (req, res) => {
    const data = getData();
    const body = req.body;
    const newProject = {
        id: Date.now(),
        title: body.title || '',
        description: body.description || '',
        category: body.category || 'web',
        icon: body.icon || 'fas fa-code',
        color: body.color || 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)',
        image: req.file ? `/uploads/${req.file.filename}` : '',
        tags: body.tags ? body.tags.split(',').map(t => t.trim()) : [],
        features: body.features ? body.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
        link: body.link || '#',
        github: body.github || '#'
    };
    data.projects.push(newProject);
    saveData(data);
    res.json({ success: true, project: newProject });
});

// PUT edit project
app.put('/api/admin/projects/:id', auth, upload.single('image'), (req, res) => {
    const data = getData();
    const idx = data.projects.findIndex(p => p.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    const body = req.body;
    const existing = data.projects[idx];
    data.projects[idx] = {
        ...existing,
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        category: body.category ?? existing.category,
        icon: body.icon ?? existing.icon,
        color: body.color ?? existing.color,
        image: req.file ? `/uploads/${req.file.filename}` : (body.keepImage ? existing.image : ''),
        tags: body.tags ? body.tags.split(',').map(t => t.trim()) : existing.tags,
        features: body.features ? body.features.split('\n').map(f => f.trim()).filter(Boolean) : existing.features,
        link: body.link ?? existing.link,
        github: body.github ?? existing.github
    };
    saveData(data);
    res.json({ success: true, project: data.projects[idx] });
});

// DELETE project
app.delete('/api/admin/projects/:id', auth, (req, res) => {
    const data = getData();
    const idx = data.projects.findIndex(p => p.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    data.projects.splice(idx, 1);
    saveData(data);
    res.json({ success: true });
});

// Fallback: serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ CV Portfolio server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin Panel: http://localhost:${PORT}/login.html`);
});
