const fs = require('fs');
const path = require('path');

let _data = null;

function getData() {
    if (!_data) {
        try {
            // Load from data.json originally
            const dataPath = path.join(process.cwd(), 'data.json');
            const fileContent = fs.readFileSync(dataPath, 'utf-8');
            _data = JSON.parse(fileContent);
        } catch (err) {
            console.error('Error loading initial data.json:', err);
            _data = { profilePhoto: "", projects: [] };
        }
    }
    return _data;
}

function saveData(data) {
    _data = data;
}

module.exports = { getData, saveData };
