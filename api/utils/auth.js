const jwt = require('jsonwebtoken');

const SECRET = 'ayoub_admin_secret_2026';

function auth(req, res) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return false;
    }
    
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Store for further usage if needed
        return true;
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
        return false;
    }
}

// Utility to handle OPTIONS preflight explicitly in serverless routes
function cors(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}

module.exports = { auth, cors, SECRET };
