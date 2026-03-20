const { getData } = require('./utils/db');
const { cors } = require('./utils/auth');

module.exports = async function handler(req, res) {
    if (cors(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = getData();
    res.status(200).json(data);
};
