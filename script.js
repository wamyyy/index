/**
 * script.js  –  Portfolio Frontend Logic
 * Backend: Supabase  |  Author: Ayoub Elwamy
 * ─────────────────────────────────────────
 * Imports Supabase client via ES Module.
 * All <script> tags in HTML must have  type="module".
 */

import { supabase } from './supabase-config.js';

// ========== LANGUAGE / RTL ==========
const currentLang = document.documentElement.lang || 'en';
const isRTL = currentLang === 'ar';

const translations = {
    en: {
        loading_text: 'Loading Portfolio',
        search_placeholder: 'Search projects...',
        chat_welcome: "👋 Hi! I'm Ayoub's portfolio assistant. Ask me anything about his skills, services, or availability!",
        chat_placeholder: 'Ask me anything...',
        chat_replies: { services: 'Services', availability: 'Availability', projects: 'Projects' },
        chat_resp_available: "Yes, I'm available for new projects! Feel free to reach out via the contact form.",
        chat_resp_projects: 'Sure! You can view my featured projects in the section above. I specialise in React, 3D, and Mobile apps.',
        chat_resp_services: 'I offer web design, web development, and UI/UX design services.',
        chat_resp_default: "That's a great question! Let's discuss it further via the contact form.",
        chat_name: "Ayoub's Assistant",
        chat_status: 'Online',
        toast_success: '✨ Thank you for your message!',
        toast_newsletter: '🎉 Thank you for subscribing!',
        no_projects: 'No projects yet. Add some from the admin panel!',
        no_articles: 'No articles yet. Add some from the admin panel!',
        read_more: 'Read More →',
        no_video: 'No video configured yet. Please add a video in the admin panel!',
        modal_links_title: 'Project Links',
        modal_links_subtitle: 'Choose your destination',
        modal_visit: 'Visit Website',
        modal_repo: 'View Repository'
    },
    ar: {
        loading_text: 'جاري تحميل المحفظة',
        search_placeholder: 'ابحث عن المشاريع...',
        chat_welcome: '👋 مرحباً! أنا مساعد أيوب الرقمي. اسألني أي شيء عن مهاراته أو خدماته!',
        chat_placeholder: 'اسألني أي شيء...',
        chat_replies: { services: 'الخدمات', availability: 'التوفر', projects: 'المشاريع' },
        chat_resp_available: 'نعم، أنا متاح للمشاريع الجديدة! تواصل معي عبر نموذج الاتصال.',
        chat_resp_projects: 'بالتأكيد! يمكنك عرض مشاريعي في قسم المشاريع أعلاه.',
        chat_resp_services: 'أقدم خدمات تصميم وتطوير الويب، بالإضافة إلى تصميم واجهات المستخدم.',
        chat_resp_default: 'هذا سؤال رائع! دعنا نناقش ذلك في رسالة عبر نموذج الاتصال.',
        chat_name: 'مساعد أيوب',
        chat_status: 'متصل الآن',
        toast_success: '✨ شكراً لرسالتك!',
        toast_newsletter: '🎉 شكراً على اشتراكك!',
        no_projects: 'لا توجد مشاريع بعد. أضف بعضها من لوحة التحكم!',
        no_articles: 'لا توجد مقالات بعد. أضف بعضها من لوحة التحكم!',
        read_more: 'اقرأ المزيد ←',
        no_video: 'لم يتم تكوين أي فيديو بعد. يرجى إضافة فيديو في لوحة التحكم!',
        modal_links_title: 'روابط المشروع',
        modal_links_subtitle: 'اختر وجهتك',
        modal_visit: 'زيارة الموقع',
        modal_repo: 'عرض المستودع'
    },
    fr: {
        loading_text: 'Chargement du Portfolio',
        search_placeholder: 'Rechercher des projets...',
        chat_welcome: "👋 Bonjour ! Je suis l'assistant numérique d'Ayoub. Posez-moi vos questions !",
        chat_placeholder: 'Posez votre question...',
        chat_replies: { services: 'Services', availability: 'Disponibilité', projects: 'Projets' },
        chat_resp_available: 'Oui, je suis disponible pour de nouveaux projets ! Contactez-moi via le formulaire.',
        chat_resp_projects: 'Bien sûr ! Vous pouvez voir mes projets dans la section Projets ci-dessus.',
        chat_resp_services: 'Je propose des services de design et développement web, ainsi que du design UI/UX.',
        chat_resp_default: "C'est une excellente question ! Discutons-en via le formulaire de contact.",
        chat_name: "Assistant d'Ayoub",
        chat_status: 'En ligne',
        toast_success: '✨ Merci pour votre message !',
        toast_newsletter: '🎉 Merci pour votre inscription !',
        no_projects: "Pas encore de projets. Ajoutez-en depuis le panneau d'administration !",
        no_articles: "Pas encore d'articles. Ajoutez-en depuis le panneau d'administration !",
        read_more: 'Lire Plus →',
        no_video: "Aucune vidéo configurée. Veuillez ajouter une vidéo dans le panneau d'administration !",
        modal_links_title: 'Liens du Projet',
        modal_links_subtitle: 'Choisissez votre destination',
        modal_visit: 'Visiter le Site',
        modal_repo: 'Voir le Dépôt'
    }
};

const trans = translations[currentLang] || translations.en;

// ========== FALLBACK DATA (shown while Supabase loads) ==========
const DEFAULT_DATA = {
    profilePhoto: 'assets/img/ayoub.jpg',
    projects: [
        { id: 1, title: 'E-Commerce Platform', description: 'Full-stack shopping experience with modern UI and payment integration', category: 'web', icon: 'fas fa-shopping-cart', color: 'linear-gradient(135deg, #1a7b8e 0%, #2c3e50 100%)', image: '', tags: ['React', 'Node.js', 'MongoDB'], features: ['Modern UI', 'Payment Integration', 'Admin Panel'], link: '#', github: 'https://github.com/wamyyy' },
        { id: 2, title: 'Fitness Tracking App', description: 'Mobile app for workout tracking and progress analytics', category: 'mobile', icon: 'fas fa-mobile-alt', color: 'linear-gradient(135deg, #a33568 0%, #2c3e50 100%)', image: '', tags: ['Flutter', 'Firebase', 'UI/UX'], features: ['Workout Tracker', 'Progress Charts', 'Push Notifications'], link: '#', github: 'https://github.com/wamyyy' },
        { id: 3, title: 'Interactive 3D Portfolio', description: 'Immersive web experience using WebGL and physics animations', category: '3d', icon: 'fas fa-cube', color: 'linear-gradient(135deg, #356ba3 0%, #1a2332 100%)', image: '', tags: ['Three.js', 'WebGL', 'GSAP'], features: ['3D Animations', 'WebGL Rendering', 'Physics Engine'], link: '#', github: 'https://github.com/wamyyy' },
        { id: 4, title: 'AI Dashboard', description: 'Analytics platform with ML insights and real-time visualization', category: 'web', icon: 'fas fa-brain', color: 'linear-gradient(135deg, #7b351a 0%, #2c3e50 100%)', image: '', tags: ['Python', 'TensorFlow', 'D3.js'], features: ['ML Models', 'Real-time Charts', 'AI Insights'], link: '#', github: 'https://github.com/wamyyy' }
    ],
    articles: [],
    videos: [],
    timeline: [
        { id: 1, date: '2024 - Present', title: 'Full-Stack Developer', company: 'Freelance', description: 'Building modern web applications with React, Node.js, and cloud technologies.', icon: 'fas fa-briefcase' }
    ]
};

// ─────────────────────────────────────────────────────────
// In-memory portfolio state (populated from Supabase)
// ─────────────────────────────────────────────────────────
let portfolioState = { ...DEFAULT_DATA };

// ========== LOADING SCREEN ==========
// The CSS already defines .loading-screen.hidden { opacity:0; visibility:hidden }
// so we just toggle that class — no inline style fights.
// ES modules are always deferred (run after DOM is parsed), so
// getElementById is safe here at top level.
(function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingPercentageEl = document.getElementById('loadingPercentage');

    // Elements not found = no loading screen in this page, bail silently.
    if (!loadingScreen || !loadingPercentageEl) return;

    let percentage = 0;
    let done = false;

    function hide() {
        if (done) return;
        done = true;
        clearInterval(interval);
        clearTimeout(failsafe);
        // Use the CSS class — style.css defines .loading-screen.hidden
        loadingScreen.classList.add('hidden');
    }

    const interval = setInterval(() => {
        percentage += Math.floor(Math.random() * 3) + 1; // 1-3 per tick
        if (percentage >= 100) {
            percentage = 100;
            loadingPercentageEl.textContent = '100%';
            setTimeout(hide, 150);
        } else {
            loadingPercentageEl.textContent = percentage + '%';
        }
    }, 20); // 20ms × ~40 ticks ≈ 800ms

    // Absolute failsafe: hide after 2s regardless
    const failsafe = setTimeout(hide, 2000);
})();

// ========== TOAST ==========
window.showToast = function (message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
};

// ========== SUPABASE DATA FETCHERS ==========
async function fetchPortfolioData() {
    try {
        const [projRes, artRes, vidRes, timelineRes, photoRes] = await Promise.all([
            supabase.from('projects').select('*').order('created_at', { ascending: true }),
            supabase.from('articles').select('*').order('created_at', { ascending: false }),
            supabase.from('videos').select('*').order('created_at', { ascending: false }),
            supabase.from('timeline').select('*').order('created_at', { ascending: false }),
            supabase.from('settings').select('value').eq('key', 'profilePhoto').maybeSingle()
        ]);

        if (projRes.data)     portfolioState.projects  = projRes.data;
        if (artRes.data)      portfolioState.articles  = artRes.data;
        if (vidRes.data)      portfolioState.videos    = vidRes.data;
        if (timelineRes.data) portfolioState.timeline  = timelineRes.data;
        if (photoRes.data)    portfolioState.profilePhoto = photoRes.data.value;

    } catch (err) {
        console.warn('Supabase fetch error – using fallback data:', err.message);
    }
}

// ─────────────────────────────────────────────────────────
// RENDER HELPERS
// ─────────────────────────────────────────────────────────
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const projects = portfolioState.projects;

    if (portfolioState.profilePhoto) {
        document.querySelectorAll('.profile-img').forEach(img => img.setAttribute('src', portfolioState.profilePhoto));
    }

    if (!projects.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary);">${trans.no_projects}</div>`;
        return;
    }

    grid.innerHTML = projects.map(p => `
        <div class="project-card reveal-item" data-category="${p.category}" data-title="${p.title}" data-tags="${(p.tags || []).join(' ')}"
             onclick="window.openProjectLinksModal('${p.id}')" style="cursor:pointer;">
            <div class="project-image" style="background:${p.color || 'linear-gradient(135deg,#1a7b8e,#2c3e50)'}">
                ${p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">` : `<i class="${p.icon || 'fas fa-code'} project-icon"></i>`}
                <div class="project-shimmer"></div>
            </div>
            <div class="project-overlay">
                <h4>${p.title}</h4>
                <p>${p.description}</p>
                <div class="project-features" style="display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem;font-size:.8rem;color:var(--text-secondary);">
                    ${(p.features || []).slice(0, 3).map(f => `<span><i class="fas fa-check-circle" style="color:var(--primary);font-size:.7rem;margin-right:.4rem;"></i>${f}</span>`).join('')}
                </div>
                <div class="project-tags">
                    ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    initProjectFilters();
}

function renderArticles() {
    const grid = document.getElementById('portfolioBlogGrid');
    if (!grid) return;

    const articles = portfolioState.articles;

    if (!articles.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary);">${trans.no_articles}</div>`;
        return;
    }

    grid.innerHTML = articles.map(a => `
        <div class="blog-card">
            <div class="blog-image" style="background:${a.color || 'linear-gradient(135deg,#1a7b8e,#7ba8a8)'};">
                <i class="${a.icon || 'fas fa-file-code'} blog-img-icon"></i>
                <div class="blog-date">${a.date || ''}</div>
            </div>
            <div class="blog-content">
                <span class="blog-category">${a.category || ''}</span>
                <h3 class="blog-title">${a.title}</h3>
                <p class="blog-excerpt">${a.excerpt || ''}</p>
                <a href="${a.link && a.link !== '#' ? a.link : 'javascript:void(0)'}" class="blog-read-more" ${a.link && a.link !== '#' ? 'target="_blank"' : ''}>
                    ${trans.read_more}
                </a>
            </div>
        </div>
    `).join('');
}

function renderTimeline() {
    const container = document.querySelector('.timeline-container');
    if (!container || !portfolioState.timeline.length) return;

    container.innerHTML = '<div class="timeline-line"></div>' +
        portfolioState.timeline.map(e => `
            <div class="timeline-item fade-in">
                <div class="timeline-content">
                    <div class="timeline-date">${e.date || ''}</div>
                    <h3 class="timeline-title">${e.title || ''}</h3>
                    <p class="timeline-company">${e.company || ''}</p>
                    <p class="timeline-description">${e.description || ''}</p>
                </div>
                <div class="timeline-dot"></div>
            </div>
        `).join('');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    container.querySelectorAll('.timeline-item').forEach(el => obs.observe(el));
}

function renderVideo() {
    const videos = portfolioState.videos;
    if (!videos.length) return;

    const v = videos[0];
    const thumbBg = document.getElementById('videoThumbBg');
    if (thumbBg) {
        if (v.image_url) {
            thumbBg.style.backgroundImage = `url('${v.image_url}')`;
        } else if (v.category === 'youtube') {
            const yId = getYoutubeId(v.url);
            if (yId) thumbBg.style.backgroundImage = `url('https://img.youtube.com/vi/${yId}/maxresdefault.jpg')`;
        }
    }
}

// ========== YOUTUBE HELPER ==========
function getYoutubeId(url) {
    const m = url.match(/(?:youtu\.be\/|v\/|watch\?v=|&v=)([^#&?]{11})/);
    return m ? m[1] : null;
}

// ========== PROJECT LINKS MODAL ==========
window.openProjectLinksModal = function (id) {
    const p = portfolioState.projects.find(x => String(x.id) === String(id));
    if (!p) return;

    const modal = document.getElementById('projectLinksModal');
    if (!modal) return;

    // Set project title
    const titleEl = document.getElementById('modalProjectTitle');
    if (titleEl) titleEl.textContent = p.title;

    const liveBtn   = document.getElementById('modalLiveLink');
    const githubBtn = document.getElementById('modalGithubLink');

    // ── Live / Website button ──
    // Always show it; if no real link, clicking opens github as fallback
    const hasLive = p.link && p.link !== '#';
    liveBtn.style.display = 'flex';
    liveBtn.href = hasLive ? p.link : 'javascript:void(0)';
    if (hasLive) {
        liveBtn.setAttribute('target', '_blank');
        liveBtn.onclick = function(e) {
            e.preventDefault();
            window.open(p.link, '_blank');
            window.closeLinksModal();
        };
    } else {
        liveBtn.removeAttribute('target');
        liveBtn.onclick = function(e) {
            e.preventDefault();
            window.closeLinksModal();
            window.showToast('No live URL configured for this project.', 'info');
        };
    }
    liveBtn.innerHTML = `
        <div class="choice-icon"><i class="fas fa-globe"></i></div>
        <div class="choice-content">
            <h3>${trans.modal_visit}</h3>
            <span>${hasLive ? p.link.replace(/^https?:\/\//, '').slice(0, 40) : 'Not available yet'}</span>
        </div>
        <i class="fas fa-chevron-right arrow"></i>`;

    // ── GitHub / Repository button ──
    const githubUrl = (p.github && p.github !== '#') ? p.github : 'https://github.com/wamyyy';
    githubBtn.style.display = 'flex';
    githubBtn.href = githubUrl;
    githubBtn.setAttribute('target', '_blank');
    githubBtn.onclick = function(e) {
        e.preventDefault();
        window.open(githubUrl, '_blank');
        window.closeLinksModal();
    };
    githubBtn.innerHTML = `
        <div class="choice-icon"><i class="fab fa-github"></i></div>
        <div class="choice-content">
            <h3>${trans.modal_repo}</h3>
            <span>${githubUrl.replace('https://github.com/', '@')}</span>
        </div>
        <i class="fas fa-chevron-right arrow"></i>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeLinksModal = function () {
    const modal = document.getElementById('projectLinksModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
};

// ========== MAIN DOM-READY ==========
document.addEventListener('DOMContentLoaded', async () => {
    if (isRTL) document.body.classList.add('rtl');

    // Localised placeholders
    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) projectSearch.placeholder = trans.search_placeholder;

    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = trans.chat_placeholder;

    const chatbotName = document.querySelector('.chatbot-name');
    if (chatbotName) chatbotName.textContent = trans.chat_name;

    const chatbotStatus = document.querySelector('.chatbot-status');
    if (chatbotStatus) chatbotStatus.innerHTML = `<span class="status-dot"></span> ${trans.chat_status}`;

    // Fetch from Supabase, then render
    await fetchPortfolioData();
    renderProjects();
    renderArticles();
    renderTimeline();
    renderVideo();

    // ─── MODAL OVERLAY CLOSE ───
    const modalOverlay = document.getElementById('projectLinksModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', e => { if (e.target.id === 'projectLinksModal') window.closeLinksModal(); });
        // Close modal with Escape key
        document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeLinksModal(); });
    }

    // ─── VIDEO PLAY BTN ───
    const playVideoBtn = document.getElementById('playVideoBtn');
    if (playVideoBtn) {
        playVideoBtn.addEventListener('click', function () {
            const videos = portfolioState.videos;
            if (!videos.length) { showToast(trans.no_video, 'error'); return; }

            const v = videos[0];
            const container = document.getElementById('videoPlayer');
            const thumbBg = document.getElementById('videoThumbBg');

            if (thumbBg) thumbBg.style.display = 'none';
            playVideoBtn.style.display = 'none';

            if (v.category === 'youtube') {
                const yId = getYoutubeId(v.url);
                if (yId) {
                    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${yId}?autoplay=1" frameborder="0" allowfullscreen style="border-radius:16px;"></iframe>`;
                    container.style.display = 'block';
                } else {
                    window.open(v.url, '_blank');
                    if (thumbBg) thumbBg.style.display = 'block';
                    playVideoBtn.style.display = 'flex';
                }
            } else {
                container.innerHTML = `<video width="100%" height="100%" autoplay controls style="border-radius:16px;background:#000;"><source src="${v.url}" type="video/mp4"></video>`;
                container.style.display = 'block';
            }
        });
    }

    // ─── SCROLL PROGRESS ───
    window.addEventListener('scroll', function () {
        const bar = document.getElementById('scrollProgress');
        if (bar) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = ((window.scrollY / h) * 100) + '%';
        }
    });

    // ─── HAMBURGER ───
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    function closeMenu() {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
        menuOverlay?.classList.remove('active');
    }

    if (hamburger && navLinks && menuOverlay) {
        hamburger.addEventListener('click', e => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
        menuOverlay.addEventListener('click', closeMenu);
        window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }

    // ─── THEME TOGGLE ───
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = document.getElementById('themeIcon');
    const html = document.documentElement;

    if (themeToggle && themeIcon) {
        const cur = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', cur);
        themeIcon.className = cur === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

        themeToggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // ─── SCROLL ANIMATIONS ───
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.2 });
    document.querySelectorAll('.fade-in, .scale-in').forEach(el => obs.observe(el));

    // ─── STATS COUNTER ───
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        let counted = false;
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'), 10);
                        if (isNaN(target)) return;
                        let cur = 0;
                        const inc = Math.ceil(target / 60);
                        const timer = setInterval(() => {
                            cur += inc;
                            if (cur >= target) { stat.textContent = target + '+'; clearInterval(timer); }
                            else stat.textContent = cur;
                        }, 25);
                    });
                }
            });
        }, { threshold: 0.5 }).observe(statsSection);
    }

    // ─── SKILLS BARS ───
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll('.skill-progress').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-progress') + '%';
                    });
                }
            });
        }, { threshold: 0.3 }).observe(skillsSection);
    }

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── CONTACT FORM → SUPABASE ───
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.disabled = true; btn.textContent = '...';

            const fd = new FormData(this);
            const payload = {
                name: fd.get('name'),
                email: fd.get('email'),
                subject: fd.get('subject'),
                message: fd.get('message')
            };

            // Save to Supabase messages table
            const { error } = await supabase.from('messages').insert([payload]);
            if (error) console.warn('Supabase message error:', error.message);

            showToast(trans.toast_success, 'success');
            contactForm.reset();
            btn.disabled = false; btn.textContent = original;
        });
    }

    // ─── NEWSLETTER FORM ───
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const orig = btn.textContent;
            btn.disabled = true; btn.textContent = '...';
            setTimeout(() => {
                showToast(trans.toast_newsletter, 'success');
                newsletterForm.reset();
                btn.disabled = false; btn.textContent = orig;
            }, 600);
        });
    }

    // ─── LOGO SCROLL TO TOP ───
    const logo = document.querySelector('.logo');
    if (logo) { logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); logo.style.cursor = 'pointer'; }

    // ─── PARTICLE CANVAS ───
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: Math.min(60, Math.floor(window.innerWidth / 20)) }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1
        }));

        (function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(122,168,168,0.4)';
                ctx.fill();
            });
            requestAnimationFrame(animate);
        })();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ─── CHATBOT ───
    const chatbotBubble   = document.getElementById('chatbotBubble');
    const chatbotPanel    = document.getElementById('chatbotPanel');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSend     = document.getElementById('chatbotSend');
    const chatbotClear    = document.getElementById('chatbotClear');
    const chatbotTyping   = document.getElementById('chatbotTyping');

    if (chatbotBubble && chatbotPanel) {
        chatbotBubble.addEventListener('click', () => {
            chatbotPanel.classList.toggle('active');
            const open  = chatbotBubble.querySelector('.chatbot-icon-open');
            const close = chatbotBubble.querySelector('.chatbot-icon-close');
            const isOpen = chatbotPanel.classList.contains('active');
            if (open)  open.style.display  = isOpen ? 'none'  : 'block';
            if (close) close.style.display = isOpen ? 'block' : 'none';
        });

        const append = (text, sender) => {
            const div = document.createElement('div');
            div.className = `chat-msg ${sender}`;
            div.innerHTML = `<div class="msg-bubble">${text}</div>`;
            chatbotMessages.appendChild(div);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        const botReply = (userMsg) => {
            if (chatbotTyping) chatbotTyping.style.display = 'flex';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            setTimeout(() => {
                if (chatbotTyping) chatbotTyping.style.display = 'none';
                const m = userMsg.toLowerCase();
                let reply = trans.chat_resp_default;
                if (m.includes('availab') || m.includes('متاح') || m.includes('dispo')) reply = trans.chat_resp_available;
                else if (m.includes('project') || m.includes('مشروع') || m.includes('projet')) {
                    reply = trans.chat_resp_projects;
                    setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 500);
                } else if (m.includes('service') || m.includes('خدمة')) reply = trans.chat_resp_services;
                append(reply, 'bot');
            }, 1000);
        };

        const initChat = () => {
            chatbotMessages.innerHTML = `
                <div class="chat-msg bot"><div class="msg-bubble">${trans.chat_welcome}</div></div>
                <div class="chat-quick-replies">
                    <button class="quick-reply" data-msg="What are your services?">${trans.chat_replies.services}</button>
                    <button class="quick-reply" data-msg="Are you available?">${trans.chat_replies.availability}</button>
                    <button class="quick-reply" data-msg="Show me your projects">${trans.chat_replies.projects}</button>
                </div>`;
        };
        initChat();
        chatbotClear?.addEventListener('click', initChat);

        chatbotSend?.addEventListener('click', () => {
            const text = chatInput?.value.trim();
            if (text) { append(text, 'user'); chatInput.value = ''; botReply(text); }
        });
        chatInput?.addEventListener('keypress', e => { if (e.key === 'Enter') chatbotSend.click(); });
        chatbotMessages.addEventListener('click', e => {
            if (e.target.classList.contains('quick-reply')) {
                const t = e.target.getAttribute('data-msg');
                append(t, 'user'); botReply(t);
            }
        });
    }
});

// ========== PROJECT FILTERS ==========
function initProjectFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const val = this.getAttribute('data-filter');
            document.querySelectorAll('.project-card').forEach(card => {
                const show = val === 'all' || card.getAttribute('data-category') === val;
                card.style.display = show ? 'block' : 'none';
                if (show) setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
                else { card.style.opacity = '0'; card.style.transform = 'scale(0.8)'; setTimeout(() => (card.style.display = 'none'), 350); }
            });
        });
    });

    const ps = document.getElementById('projectSearch');
    if (ps) {
        ps.oninput = function () {
            const q = this.value.toLowerCase();
            document.querySelectorAll('.project-card').forEach(card => {
                const match = (card.dataset.title || '').toLowerCase().includes(q) || (card.dataset.tags || '').toLowerCase().includes(q);
                card.style.display = match ? 'block' : 'none';
            });
        };
    }
}
