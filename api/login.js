const jwt = require('jsonwebtoken');
const { SECRET, cors } = require('./utils/auth');

module.exports = async function handler(req, res) {
    if (cors(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body || {};

    if (username === 'ayoubelwamy' && password === 'ayoub101219642006') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '8h' });
        res.status(200).json({ success: true, token });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
};
