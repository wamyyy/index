/**
 * admin.js  –  Portfolio Admin Panel
 * Backend : Supabase  |  Author: Ayoub Elwamy
 * ES Module → loaded with  type="module"
 *
 * KEY RULES for ES Modules + inline onclick=:
 *  - Every function called from onclick="" MUST be on window.
 *  - UUIDs in onclick must be wrapped in single-quotes:
 *    onclick="window.deleteProject('${p.id}')"
 */

import { supabase } from './supabase-config.js';

// Theme
(function () {
    const t = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
})();

const AUTH_KEY = 'portfolio_admin_auth';

// ══════════════════════════════════════════
// AUTH

// 1. Check l-auth mli kat-hla l-page (Musa7a7)
async function checkAdminAccess() {
    const { data: { user }, error } = await supabase.auth.getUser();

    // 1. Ila makanch ga3 user dakhil
    if (error || !user) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Check wach had l-user huwa ntaya (Admin)
    // Kay-checki email (Google) AWLA username (Login 3adi)
    const isAdminEmail = user.email === 'ayoubelwamy10121964@gmail.com';
    
    // Ghadi n-checkiw l-username f metadata (ila knti m-configuriha f login)
    // Awla ghir l-email dyal l-user li m-creyi f Supabase
    const isAdminUser = user.email === 'ayoubelwamy' || user.user_metadata?.username === 'ayoubelwamy';

    if (!isAdminEmail && !isAdminUser) {
        console.error("Access Denied: Machi ntaya!");
        await supabase.auth.signOut(); // Kharjo nishan
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html'; 
        return;
    }
}
// 2. Run l-check nishan
checkAdminAccess();
// ══════════════════════════════════════════
async function verifyAuth() {
    if (sessionStorage.getItem(AUTH_KEY) === 'true') return true;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return true;
    window.location.href = 'login.html';
    return false;
}

document.getElementById('logoutBtn').addEventListener('click', async e => {
    e.preventDefault();
    await supabase.auth.signOut();
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
});


// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function showToast(msg, type = 'success', duration = 3000) {
    const t = document.getElementById('adminToast');
    if (!t) return;
    t.textContent = msg;
    t.className = `admin-toast show ${type}`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = 'admin-toast'; }, duration);
}

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const section = btn.dataset.section;
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`section-${section}`)?.classList.remove('hidden');

        const titles = {
            projects: 'Featured Projects', photo: 'Profile Photo',
            articles: 'Latest Articles',  videos: 'Video URLs',
            journey:  'My Journey',        messages: 'Messages'
        };
        document.getElementById('sectionTitle').textContent = titles[section] || section;

        ['addProjectBtn','addArticleBtn','addVideoBtn','addJourneyBtn'].forEach(id => {
            document.getElementById(id)?.style.setProperty('display','none');
        });
        const btnMap = { projects:'addProjectBtn', articles:'addArticleBtn', videos:'addVideoBtn', journey:'addJourneyBtn' };
        if (btnMap[section]) document.getElementById(btnMap[section])?.style.setProperty('display','inline-flex');

        if (section === 'photo')    loadCurrentPhoto();
        if (section === 'journey')  loadJourney();
        if (section === 'messages') loadMessages();
    });
});

const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle) sidebar.classList.remove('open');
    });
}

// ══════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
    if (error) { showToast('Failed to load projects: ' + error.message, 'error'); return; }
    renderProjectCards(data || []);
}

function categoryLabel(cat) {
    return { web:'🌐 Web', mobile:'📱 Mobile', '3d':'🧊 3D', design:'🎨 Design', ai:'🤖 AI/ML' }[cat] || cat;
}

function renderProjectCards(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!projects.length) {
        grid.innerHTML = '<div class="loading-spinner">No projects yet. Click "Add Project" to get started!</div>';
        return;
    }
    grid.innerHTML = projects.map(p => `
        <div class="project-admin-card" id="proj-${p.id}">
            <div class="proj-card-thumb" style="${p.image ? '' : `background:${p.color}`}">
                ${p.image
                    ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<i class="${p.icon || 'fas fa-code'}" style="font-size:2rem;color:rgba(255,255,255,0.8);"></i>`}
            </div>
            <div class="proj-card-body">
                <div class="proj-card-cat">${categoryLabel(p.category)}</div>
                <div class="proj-card-title">${p.title}</div>
                <div class="proj-card-desc">${p.description}</div>
                <div class="proj-card-tags">${(p.tags||[]).map(t=>`<span class="proj-tag">${t}</span>`).join('')}</div>
                <div class="proj-card-actions">
                    <button class="btn-edit" onclick="window.openProjectModal('${p.id}')"><i class="fas fa-pen"></i> Edit</button>
                    ${p.link && p.link !== '#' ? `<a href="${p.link}" target="_blank" class="btn-ghost"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    <button class="btn-danger" onclick="window.deleteProject('${p.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>`).join('');
}

let currentEditId = null;
let selectedColor = 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)';
let currentImageData = '';

window.openProjectModal = async function (id = null) {
    currentEditId = id;
    currentImageData = '';
    document.getElementById('projectModal').classList.add('active');
    document.getElementById('projectForm').reset();
    document.getElementById('projImgPreview').classList.add('hidden');
    document.getElementById('formError').classList.add('hidden');
    selectedColor = 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)';
    document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
    document.querySelector('.color-opt')?.classList.add('selected');
    document.getElementById('projColor').value = selectedColor;

    if (id) {
        document.getElementById('modalHeading').textContent = 'Edit Project';
        const { data: p, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (error || !p) { showToast('Could not load project.', 'error'); return; }
        document.getElementById('projTitle').value    = p.title       || '';
        document.getElementById('projDesc').value     = p.description || '';
        document.getElementById('projCategory').value = p.category    || 'web';
        document.getElementById('projLink').value     = p.link        || '';
        document.getElementById('projGithub').value   = p.github      || '';
        document.getElementById('projTags').value     = (p.tags    || []).join(', ');
        document.getElementById('projFeatures').value = (p.features|| []).join('\n');
        selectedColor = p.color || selectedColor;
        document.getElementById('projColor').value = selectedColor;
        document.querySelectorAll('.color-opt').forEach(o => {
            o.classList.toggle('selected', o.dataset.val === selectedColor);
        });
        if (p.image) {
            currentImageData = p.image;
            const prev = document.getElementById('projImgPreview');
            prev.src = p.image;
            prev.classList.remove('hidden');
        }
    } else {
        document.getElementById('modalHeading').textContent = 'Add New Project';
    }
};

window.closeProjectModal = function () {
    document.getElementById('projectModal').classList.remove('active');
    currentEditId = null; currentImageData = '';
};

document.getElementById('projectModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) window.closeProjectModal();
});

document.querySelectorAll('.color-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedColor = opt.dataset.val;
        document.getElementById('projColor').value = selectedColor;
    });
});

const projImgInput = document.getElementById('projImgInput');
const imgDrop = document.getElementById('imgDrop');
imgDrop.addEventListener('click', () => projImgInput.click());
projImgInput.addEventListener('change', () => {
    const file = projImgInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        currentImageData = ev.target.result;
        const prev = document.getElementById('projImgPreview');
        prev.src = currentImageData; prev.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});

document.getElementById('projectForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('projTitle').value.trim();
    const desc  = document.getElementById('projDesc').value.trim();
    if (!title || !desc) {
        const errEl = document.getElementById('formError');
        errEl.textContent = 'Title and description are required.';
        errEl.classList.remove('hidden');
        return;
    }
    const payload = {
        title, description: desc,
        category: document.getElementById('projCategory').value,
        icon: 'fas fa-code', color: selectedColor,
        image: currentImageData || '',
        tags: document.getElementById('projTags').value.split(',').map(t=>t.trim()).filter(Boolean),
        features: document.getElementById('projFeatures').value.split('\n').map(f=>f.trim()).filter(Boolean),
        link:   document.getElementById('projLink').value.trim()   || '#',
        github: document.getElementById('projGithub').value.trim() || '#'
    };
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    let error;
    if (currentEditId) {
        ({ error } = await supabase.from('projects').update(payload).eq('id', currentEditId));
        if (!error) showToast('Project updated!', 'success');
    } else {
        ({ error } = await supabase.from('projects').insert([payload]));
        if (!error) showToast('Project added!', 'success');
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save Project';
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    window.closeProjectModal(); loadProjects();
});

window.deleteProject = async function (id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Project deleted.', 'success');
    document.getElementById(`proj-${id}`)?.remove();
    if (!document.querySelector('#projectsGrid .project-admin-card')) loadProjects();
};

// ══════════════════════════════════════════
// ARTICLES
// ══════════════════════════════════════════
async function loadArticles() {
    const grid = document.getElementById('articlesGrid');
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load articles: ' + error.message, 'error'); return; }
    renderArticleCards(data || []);
}

function renderArticleCards(articles) {
    const grid = document.getElementById('articlesGrid');
    if (!articles.length) {
        grid.innerHTML = '<div class="loading-spinner">No articles yet. Click "Add Article" to get started!</div>';
        return;
    }
    grid.innerHTML = articles.map(a => `
        <div class="project-admin-card" id="art-${a.id}">
            <div class="proj-card-thumb" style="background:${a.color||'linear-gradient(135deg,#1a7b8e,#7ba8a8)'}">
                <i class="${a.icon||'fas fa-file-code'}" style="font-size:2rem;color:rgba(255,255,255,0.8);"></i>
            </div>
            <div class="proj-card-body">
                <div class="proj-card-cat">${a.category||''} • ${a.date||''}</div>
                <div class="proj-card-title">${a.title}</div>
                <div class="proj-card-desc" style="max-height:3rem;overflow:hidden;">${a.excerpt}</div>
                <div class="proj-card-actions" style="margin-top:1rem;">
                    <button class="btn-edit" onclick="window.openArticleModal('${a.id}')"><i class="fas fa-pen"></i> Edit</button>
                    ${a.link && a.link !== '#' ? `<a href="${a.link}" target="_blank" class="btn-ghost"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    <button class="btn-danger" onclick="window.deleteArticle('${a.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>`).join('');
}

let currentArtEditId = null;
let selectedArtColor = 'linear-gradient(135deg, #1a7b8e, #7ba8a8)';

window.openArticleModal = async function (id = null) {
    currentArtEditId = id;
    document.getElementById('articleModal').classList.add('active');
    document.getElementById('articleForm').reset();
    selectedArtColor = 'linear-gradient(135deg, #1a7b8e, #7ba8a8)';
    document.querySelectorAll('#artColorOptions .color-opt').forEach(o => o.classList.remove('selected'));
    document.querySelector('#artColorOptions .color-opt')?.classList.add('selected');
    document.getElementById('artColor').value = selectedArtColor;

    if (id) {
        document.getElementById('articleModalHeading').textContent = 'Edit Article';
        const { data: a, error } = await supabase.from('articles').select('*').eq('id', id).single();
        if (error || !a) { showToast('Could not load article.', 'error'); return; }
        document.getElementById('artTitle').value    = a.title    || '';
        document.getElementById('artCategory').value = a.category || '';
        document.getElementById('artExcerpt').value  = a.excerpt  || '';
        document.getElementById('artLink').value     = a.link     || '';
        document.getElementById('artDate').value     = a.date     || '';
        document.getElementById('artIcon').value     = a.icon     || 'fas fa-file-code';
        selectedArtColor = a.color || selectedArtColor;
        document.getElementById('artColor').value = selectedArtColor;
        document.querySelectorAll('#artColorOptions .color-opt').forEach(o => {
            o.classList.toggle('selected', o.dataset.val === selectedArtColor);
        });
    } else {
        document.getElementById('articleModalHeading').textContent = 'Add New Article';
        document.getElementById('artDate').value = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    }
};

window.closeArticleModal = function () {
    document.getElementById('articleModal').classList.remove('active');
    currentArtEditId = null;
};

document.getElementById('articleModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) window.closeArticleModal();
});

document.querySelectorAll('#artColorOptions .color-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('#artColorOptions .color-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedArtColor = opt.dataset.val;
        document.getElementById('artColor').value = selectedArtColor;
    });
});

document.getElementById('articleForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title   = document.getElementById('artTitle').value.trim();
    const excerpt = document.getElementById('artExcerpt').value.trim();
    if (!title || !excerpt) { showToast('Title and excerpt are required.', 'error'); return; }
    const payload = {
        title, excerpt,
        category: document.getElementById('artCategory').value.trim(),
        date:     document.getElementById('artDate').value.trim(),
        link:     document.getElementById('artLink').value.trim(),
        icon:     document.getElementById('artIcon').value.trim() || 'fas fa-file-code',
        color:    selectedArtColor
    };
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    let error;
    if (currentArtEditId) {
        ({ error } = await supabase.from('articles').update(payload).eq('id', currentArtEditId));
        if (!error) showToast('Article updated!', 'success');
    } else {
        ({ error } = await supabase.from('articles').insert([payload]));
        if (!error) showToast('Article added!', 'success');
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save Article';
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    window.closeArticleModal(); loadArticles();
});

window.deleteArticle = async function (id) {
    if (!confirm('Delete this article?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Article deleted.', 'success');
    document.getElementById(`art-${id}`)?.remove();
    if (!document.querySelector('#articlesGrid .project-admin-card')) loadArticles();
};

// ══════════════════════════════════════════
// VIDEOS
// ══════════════════════════════════════════
async function loadVideos() {
    const grid = document.getElementById('videosGrid');
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load videos: ' + error.message, 'error'); return; }
    renderVideoCards(data || []);
}

function renderVideoCards(videos) {
    const grid = document.getElementById('videosGrid');
    if (!videos.length) {
        grid.innerHTML = '<div class="loading-spinner">No videos yet. Click "Add Video" to get started!</div>';
        return;
    }
    grid.innerHTML = videos.map(v => {
        let icon = 'fas fa-video', color = '#2c3e50';
        if (v.category === 'youtube') { icon = 'fab fa-youtube'; color = '#ef4444'; }
        if (v.category === 'vimeo')   { icon = 'fab fa-vimeo-v';  color = '#0ea5e9'; }
        return `
        <div class="project-admin-card" id="vid-${v.id}">
            <div class="proj-card-thumb" style="background:${color};display:flex;align-items:center;justify-content:center;">
                <i class="${icon}" style="font-size:2.5rem;color:rgba(255,255,255,.9);"></i>
            </div>
            <div class="proj-card-body">
                <div class="proj-card-cat" style="color:${color};border-color:${color}33;background:${color}11;">${v.category.toUpperCase()}</div>
                <div class="proj-card-title">${v.title}</div>
                <div class="proj-card-desc" style="font-size:.75rem;color:var(--text-secondary);margin:.3rem 0;">${v.description||''}</div>
                <div class="proj-card-desc" style="font-size:.7rem;color:var(--primary);word-break:break-all;">${v.url}</div>
                <div class="proj-card-actions" style="margin-top:1rem;">
                    <button class="btn-edit" onclick="window.openVideoModal('${v.id}')"><i class="fas fa-pen"></i> Edit</button>
                    <a href="${v.url}" target="_blank" class="btn-ghost"><i class="fas fa-external-link-alt"></i></a>
                    <button class="btn-danger" onclick="window.deleteVideo('${v.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

let currentVidEditId = null;

window.openVideoModal = async function (id = null) {
    currentVidEditId = id;
    document.getElementById('videoModal').classList.add('active');
    document.getElementById('videoForm').reset();
    document.getElementById('vidImage').value = '';

    if (id) {
        document.getElementById('videoModalHeading').textContent = 'Edit Video';
        const { data: v, error } = await supabase.from('videos').select('*').eq('id', id).single();
        if (error || !v) { showToast('Could not load video.', 'error'); return; }
        document.getElementById('vidTitle').value    = v.title       || '';
        document.getElementById('vidCategory').value = v.category    || 'youtube';
        document.getElementById('vidUrl').value      = v.url         || '';
        document.getElementById('vidDesc').value     = v.description || '';
        document.getElementById('vidImage').value    = v.image_url   || '';
    } else {
        document.getElementById('videoModalHeading').textContent = 'Add New Video';
    }
};

window.closeVideoModal = function () {
    document.getElementById('videoModal').classList.remove('active');
    currentVidEditId = null;
};

document.getElementById('videoModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) window.closeVideoModal();
});

document.getElementById('videoForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('vidTitle').value.trim();
    const url   = document.getElementById('vidUrl').value.trim();
    if (!title || !url) { showToast('Title and URL are required.', 'error'); return; }
    const payload = {
        title, url,
        category:    document.getElementById('vidCategory').value,
        description: document.getElementById('vidDesc').value.trim(),
        image_url:   document.getElementById('vidImage').value.trim()
    };
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    let error;
    if (currentVidEditId) {
        ({ error } = await supabase.from('videos').update(payload).eq('id', currentVidEditId));
        if (!error) showToast('Video updated!', 'success');
    } else {
        ({ error } = await supabase.from('videos').insert([payload]));
        if (!error) showToast('Video added!', 'success');
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save Video';
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    window.closeVideoModal(); loadVideos();
});

window.deleteVideo = async function (id) {
    if (!confirm('Delete this video?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Video deleted.', 'success');
    document.getElementById(`vid-${id}`)?.remove();
    if (!document.querySelector('#videosGrid .project-admin-card')) loadVideos();
};

document.getElementById('vidImageFile').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Thumbnail must be under 2 MB.', 'error'); this.value = ''; return; }
    const reader = new FileReader();
    reader.onload = ev => { document.getElementById('vidImage').value = ev.target.result; showToast('Thumbnail ready!', 'success'); };
    reader.readAsDataURL(file);
});

// ══════════════════════════════════════════
// PROFILE PHOTO
// ══════════════════════════════════════════
async function loadCurrentPhoto() {
    const { data } = await supabase.from('settings').select('value').eq('key', 'profilePhoto').maybeSingle();
    const img = document.getElementById('currentPhoto');
    if (img) img.src = data?.value || 'assets/img/ayoub.jpg';
}

const fileDrop   = document.getElementById('fileDrop');
const photoInput = document.getElementById('photoInput');
fileDrop.addEventListener('click', () => photoInput.click());
fileDrop.addEventListener('dragover',  e => { e.preventDefault(); fileDrop.style.borderColor = 'var(--primary)'; });
fileDrop.addEventListener('dragleave', () => { fileDrop.style.borderColor = ''; });
fileDrop.addEventListener('drop', e => {
    e.preventDefault(); fileDrop.style.borderColor = '';
    if (e.dataTransfer.files[0]) { photoInput.files = e.dataTransfer.files; handlePhotoPreview(); }
});
photoInput.addEventListener('change', handlePhotoPreview);

function handlePhotoPreview() {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('photoPreview').src = e.target.result;
        document.getElementById('photoPreviewWrap').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

window.clearPhotoPreview = function () {
    photoInput.value = '';
    document.getElementById('photoPreviewWrap').classList.add('hidden');
};

document.getElementById('photoForm').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('uploadPhotoBtn');
    document.getElementById('photoMsg').classList.add('hidden');
    if (!photoInput.files[0]) { showToast('Please select an image first.', 'error'); return; }
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    const reader = new FileReader();
    reader.onload = async ev => {
        const base64 = ev.target.result;
        const { error } = await supabase.from('settings').upsert({ key: 'profilePhoto', value: base64 }, { onConflict: 'key' });
        if (error) { showToast('Upload error: ' + error.message, 'error'); }
        else {
            document.getElementById('currentPhoto').src = base64;
            showToast('Profile photo saved!', 'success');
            document.getElementById('photoMsg').classList.remove('hidden');
            window.clearPhotoPreview();
        }
        btn.disabled = false; btn.innerHTML = '<i class="fas fa-upload"></i> Upload Photo';
    };
    reader.readAsDataURL(photoInput.files[0]);
});

// ══════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════
async function loadMessages() {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load messages: ' + error.message, 'error'); return; }
    renderMessageCards(data || []);
    updateMsgBadge();
}

async function updateMsgBadge() {
    const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false);
    const badge = document.getElementById('msgBadge');
    if (!badge) return;
    if (count > 0) { badge.textContent = count; badge.style.display = 'inline-block'; }
    else badge.style.display = 'none';
}

function renderMessageCards(messages) {
    const container = document.getElementById('messagesContainer');
    const summary   = document.getElementById('msgSummary');
    if (!messages.length) {
        container.innerHTML = '<div class="loading-spinner">No messages found.</div>';
        if (summary) summary.textContent = 'Inbox empty';
        return;
    }
    if (summary) summary.textContent = `Showing ${messages.length} message(s)`;
    container.innerHTML = messages.map(m => `
        <div class="msg-card ${m.read?'':'unread'}" id="msg-${m.id}">
            <div class="msg-card-header">
                <div>${m.read?'':'<span class="msg-unread-dot"></span>'}<span class="msg-sender">${m.name||'Anonymous'}</span></div>
                <div class="msg-email">${m.email||''}</div>
                <div class="msg-date">${new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div class="msg-subject">Subject: ${m.subject||'(No Subject)'}</div>
            <div class="msg-body">${m.message||''}</div>
            <div class="msg-actions">
                ${m.read?'':` <button class="btn-read" onclick="window.markAsRead('${m.id}')"><i class="fas fa-check"></i> Mark as Read</button>`}
                <button class="btn-danger" style="padding:.45rem 1rem;" onclick="window.deleteMessage('${m.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>`).join('');
}

window.markAsRead = async function (id) {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    loadMessages();
};

window.deleteMessage = async function (id) {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', id);
    document.getElementById(`msg-${id}`)?.remove();
    updateMsgBadge();
};

window.deleteAllMessages = async function () {
    if (!confirm('Clear ALL messages?')) return;
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    loadMessages();
};

// ══════════════════════════════════════════
// MY JOURNEY
// ══════════════════════════════════════════
async function loadJourney() {
    const grid = document.getElementById('journeyGrid');
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
    const { data, error } = await supabase.from('timeline').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load journey: ' + error.message, 'error'); return; }
    renderJourneyCards(data || []);
}

function renderJourneyCards(entries) {
    const grid = document.getElementById('journeyGrid');
    if (!entries.length) {
        grid.innerHTML = '<div class="loading-spinner">No journey entries yet. Click "Add Entry" to get started!</div>';
        return;
    }
    grid.innerHTML = entries.map(e => `
        <div class="project-admin-card" id="journey-${e.id}">
            <div class="proj-card-thumb" style="background:linear-gradient(135deg,#1a7b8e,#2c3e50);display:flex;align-items:center;justify-content:center;">
                <i class="${e.icon||'fas fa-briefcase'}" style="font-size:2.2rem;color:rgba(255,255,255,.85);"></i>
            </div>
            <div class="proj-card-body">
                <div class="proj-card-cat">📅 ${e.date||''}</div>
                <div class="proj-card-title">${e.title}</div>
                <div class="proj-card-desc" style="color:var(--primary);font-size:.85rem;margin-bottom:.4rem;">${e.company||''}</div>
                <div class="proj-card-desc">${e.description}</div>
                <div class="proj-card-actions" style="margin-top:1rem;">
                    <button class="btn-edit" onclick="window.openJourneyModal('${e.id}')"><i class="fas fa-pen"></i> Edit</button>
                    <button class="btn-danger" onclick="window.deleteJourney('${e.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        </div>`).join('');
}

let currentJourneyEditId = null;

window.openJourneyModal = async function (id = null) {
    currentJourneyEditId = id;
    document.getElementById('journeyModal').classList.add('active');
    document.getElementById('journeyForm').reset();
    if (id) {
        document.getElementById('journeyModalHeading').textContent = 'Edit Journey Entry';
        const { data: entry, error } = await supabase.from('timeline').select('*').eq('id', id).single();
        if (error || !entry) { showToast('Could not load entry.', 'error'); return; }
        document.getElementById('journeyDate').value    = entry.date        || '';
        document.getElementById('journeyTitle').value   = entry.title       || '';
        document.getElementById('journeyCompany').value = entry.company     || '';
        document.getElementById('journeyDesc').value    = entry.description || '';
        document.getElementById('journeyIcon').value    = entry.icon        || 'fas fa-briefcase';
    } else {
        document.getElementById('journeyModalHeading').textContent = 'Add Journey Entry';
        document.getElementById('journeyIcon').value = 'fas fa-briefcase';
    }
};

window.closeJourneyModal = function () {
    document.getElementById('journeyModal').classList.remove('active');
    currentJourneyEditId = null;
};

document.getElementById('journeyModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) window.closeJourneyModal();
});

document.getElementById('journeyForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('journeyTitle').value.trim();
    const desc  = document.getElementById('journeyDesc').value.trim();
    if (!title || !desc) { showToast('Title and description are required.', 'error'); return; }
    const payload = {
        date:        document.getElementById('journeyDate').value.trim(),
        title, company: document.getElementById('journeyCompany').value.trim(),
        description: desc,
        icon:        document.getElementById('journeyIcon').value.trim() || 'fas fa-briefcase'
    };
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    let error;
    if (currentJourneyEditId) {
        ({ error } = await supabase.from('timeline').update(payload).eq('id', currentJourneyEditId));
        if (!error) showToast('Entry updated!', 'success');
    } else {
        ({ error } = await supabase.from('timeline').insert([payload]));
        if (!error) showToast('Entry added!', 'success');
    }
    btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Save Entry';
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    window.closeJourneyModal(); loadJourney();
});

window.deleteJourney = async function (id) {
    if (!confirm('Delete this journey entry?')) return;
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Entry deleted.', 'success');
    document.getElementById(`journey-${id}`)?.remove();
    if (!document.querySelector('#journeyGrid .project-admin-card')) loadJourney();
};

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
    const ok = await verifyAuth();
    if (!ok) return;
    loadProjects();
    loadArticles();
    loadVideos();
    loadCurrentPhoto();
    loadJourney();
    updateMsgBadge();
});
