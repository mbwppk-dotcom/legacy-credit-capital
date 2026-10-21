/**
 * DreamScore — Modern Interactive Engine
 * Golden & Cream Luxury Theme
 */

// ── Hero Canvas Particles (Warm Gold & Champagne) ──────────────
(function() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', function() { resize(); spawnAll(); }, { passive: true });

    const goldColors = ['#C5A059', '#D4AF37', '#DFBE7E', '#EDDDBE', '#B88E3E'];

    function Particle() { this.reset(true); }
    Particle.prototype.reset = function(init) {
        this.x  = Math.random() * W;
        this.y  = init ? Math.random() * H : H + 16;
        this.r  = Math.random() * 1.5 + 0.4;
        this.vy = Math.random() * 0.55 + 0.15;
        this.op = Math.random() * 0.55 + 0.15;
        this.wb = Math.random() * Math.PI * 2;
        this.ws = (Math.random() - 0.5) * 0.024;
        this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
    };

    function spawnAll() {
        particles = [];
        const count = window.innerWidth < 600 ? 55 : 110;
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    spawnAll();

    let raf;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.y  -= p.vy;
            p.wb += p.ws;
            p.x  += Math.sin(p.wb) * 0.35;
            p.op -= 0.00065;
            if (p.y < -12 || p.op <= 0) p.reset(false);
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.op);
            ctx.fillStyle   = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        raf = requestAnimationFrame(draw);
    }
    draw();
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
})();

// ── Hero Counter Animation ─────────────────────────────────────
function animateCounter(el) {
    const target   = parseFloat(el.dataset.target) || 0;
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 2200;
    const start    = performance.now();

    function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4);
        const v = Math.floor(e * target);
        if (target >= 1000) el.textContent = prefix + Math.floor(v / 1000) + suffix;
        else el.textContent = prefix + v + suffix;
        if (p < 1) requestAnimationFrame(step);
        else {
            if (target >= 1000) el.textContent = prefix + Math.floor(target / 1000) + suffix;
            else el.textContent = prefix + target + suffix;
        }
    }
    requestAnimationFrame(step);
}

let countersDone = false;
function checkCounters() {
    if (countersDone) return;
    const stats = document.querySelector('.hero-stats');
    if (!stats) return;
    if (stats.getBoundingClientRect().top < window.innerHeight * 0.95) {
        countersDone = true;
        document.querySelectorAll('.hero-stat-num[data-target]').forEach(animateCounter);
    }
}
window.addEventListener('scroll', checkCounters, { passive: true });
setTimeout(function() {
    if (!countersDone) {
        countersDone = true;
        document.querySelectorAll('.hero-stat-num[data-target]').forEach(animateCounter);
    }
}, 1200);

// ── Scroll-triggered animations (data-anim & data-stagger) ─────
(function() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-anim], [data-stagger]').forEach(el => el.classList.add('anim-in'));
        return;
    }
    const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-anim], [data-stagger]').forEach(function(el) {
        io.observe(el);
    });
})();

// ── Testimonial score counter on scroll ─────────────────────────
(function() {
    let done = false;
    function countScores() {
        if (done) return;
        const section = document.querySelector('.testimonials-section');
        if (!section) return;
        if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
            done = true;
            document.querySelectorAll('.score-value').forEach(function(el) {
                const target = parseInt(el.textContent.trim(), 10);
                if (isNaN(target)) return;
                const start = performance.now();
                const duration = 1400;
                (function step(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const e = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(e * target);
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = target;
                })(start);
            });
        }
    }
    window.addEventListener('scroll', countScores, { passive: true });
})();

// ── Navbar Behavior ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navCollapse = document.getElementById('navCollapse');

    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Mobile nav toggle
    if (navToggle && navCollapse) {
        const setOpen = (open) => {
            navCollapse.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
            document.body.style.overflow = open ? 'hidden' : '';
        };
        navToggle.addEventListener('click', () => setOpen(!navCollapse.classList.contains('open')));
        navCollapse.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
        window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); });
    }
});

// ── FAQ Accordion ──────────────────────────────────────────────
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

// ── Simple Consultation Modal ──────────────────────────────────
function openFormModal() {
    const modal = document.getElementById('formModal');
    if (!modal) return;
    modal.classList.add('active');
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

function closeFormModal() {
    const modal = document.getElementById('formModal');
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => { modal.classList.remove('active'); document.body.style.overflow = ''; }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    const formModal = document.getElementById('formModal');
    if (formModal) {
        formModal.addEventListener('click', e => {
            if (e.target === formModal) closeFormModal();
        });
    }
});

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/EzwplJXjhDjj4GFSqiXG";

function handleSubmit(event) {
    event.preventDefault();
    closeFormModal();
    window.open(BOOKING_URL, '_blank');
}

// ── In-Page Consultation Section Form Handler ──────────────────
function handleSectionConsultSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const msg = document.getElementById('consultSectionMsg');
    const submitBtn = form.querySelector('.consult-submit-button');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving Your Session...';
    }
    
    if (msg) {
        msg.className = 'consult-section-form-msg is-success';
        msg.innerHTML = '<i class="fas fa-check-circle"></i> Request received! Opening live calendar to pick your time slot...';
    }

    setTimeout(function() {
        window.open(BOOKING_URL, '_blank');
        form.reset();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Submitted (Calendar Opened)';
            setTimeout(function() {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Request My Free Call & Action Plan';
            }, 3500);
        }
    }, 1000);
}

// ── Image Modal / Lightbox ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('imageModal')) {
        const modalHTML = `
            <div id="imageModal" class="image-modal">
                <div style="position:relative;max-width:90%;max-height:90%;">
                    <img id="modalImage" class="modal-image" src="" alt="Enlarged view">
                </div>
                <button class="close-button" onclick="closeImageModal()" type="button" aria-label="Close image">&times;</button>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('imageModal');
    document.querySelectorAll('.testimonial-image img').forEach(img => {
        img.addEventListener('click', function() { openImageModal(this.src, this.alt); });
    });
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal || (e.target.closest('div') === modal.firstElementChild && e.target.id !== 'modalImage')) {
                closeImageModal();
            }
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeImageModal(); });
    }
});

function openImageModal(src, alt) {
    const modal = document.getElementById('imageModal');
    const img   = document.getElementById('modalImage');
    if (!modal || !img) return;
    img.src = src;
    img.alt = alt || 'Enlarged client screenshot';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ── Credit Assessment Popup (5 Steps) ──────────────────────────
let creditCurrentStep = 1;
const creditTotalSteps = 5;
let creditAnswers = {};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(openCreditPopup, 10000);
    initCreditPopup();
});

function initCreditPopup() {
    updateCreditProgressBar();
    updateCreditStepIndicators();
    updateCreditNavigation();
}

function openCreditPopup() {
    const popup = document.getElementById('creditAssessmentPopup');
    if (!popup) return;
    creditCurrentStep = 1;
    creditAnswers = {};
    popup.classList.add('popup-active');
    setTimeout(() => popup.classList.add('popup-show'), 10);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    showCreditStep(1);
    initCreditPopup();
}

function closeCreditPopup() {
    const popup = document.getElementById('creditAssessmentPopup');
    if (!popup) return;
    popup.classList.remove('popup-show');
    setTimeout(() => { 
        popup.classList.remove('popup-active'); 
        document.body.style.overflow = ''; 
        document.documentElement.style.overflowX = 'hidden';
    }, 420);
}

function showCreditStep(step) {
    document.querySelectorAll('.credit-popup-step').forEach(s => s.classList.remove('step-active'));
    const el = document.querySelector(`[data-credit-step="${step}"]`);
    if (el) el.classList.add('step-active');
    updateCreditProgressBar();
    updateCreditStepIndicators();
    updateCreditNavigation();
}

function updateCreditProgressBar() {
    const bar = document.getElementById('creditProgressBar');
    if (bar) bar.style.width = `${(creditCurrentStep / creditTotalSteps) * 100}%`;
}

function updateCreditStepIndicators() {
    document.querySelectorAll('.credit-step-dot').forEach((dot, i) => {
        const s = i + 1;
        dot.classList.remove('dot-active', 'dot-completed');
        if (s < creditCurrentStep) dot.classList.add('dot-completed');
        else if (s === creditCurrentStep) dot.classList.add('dot-active');
    });
}

function updateCreditNavigation() {
    const backBtn = document.querySelector('.credit-btn-back');
    const nextBtn = document.querySelector('.credit-btn-next');
    const nav     = document.getElementById('creditPopupNavigation');
    if (!backBtn || !nextBtn || !nav) return;

    if (creditCurrentStep === 5) { nav.style.display = 'none'; return; }
    nav.style.display = 'flex';
    backBtn.style.display = creditCurrentStep === 1 ? 'none' : 'block';

    const sel = document.querySelector(`[data-credit-step="${creditCurrentStep}"] .credit-option-button.option-selected`);
    nextBtn.disabled = !sel;
}

function nextCreditStep() {
    const sel = document.querySelector(`[data-credit-step="${creditCurrentStep}"] .credit-option-button.option-selected`);
    if (!sel) {
        // Shake the options grid instead of alert
        const grid = document.querySelector(`[data-credit-step="${creditCurrentStep}"] .credit-options-grid`);
        if (grid) {
            grid.classList.add('options-shake');
            setTimeout(() => grid.classList.remove('options-shake'), 500);
        }
        return;
    }
    creditAnswers[`step${creditCurrentStep}`] = sel.dataset.creditValue;
    if (creditCurrentStep < creditTotalSteps) {
        creditCurrentStep++;
        showCreditStep(creditCurrentStep);
    }
}

function prevCreditStep() {
    if (creditCurrentStep > 1) {
        creditCurrentStep--;
        showCreditStep(creditCurrentStep);
    }
}

document.addEventListener('click', function(e) {
    const opt = e.target.closest('.credit-option-button');
    if (!opt) return;
    const step = opt.closest('.credit-popup-step');
    if (!step) return;
    step.querySelectorAll('.credit-option-button').forEach(o => o.classList.remove('option-selected'));
    opt.classList.add('option-selected');
    updateCreditNavigation();

    // Auto-advance smoothly after 320ms (skip on last question step 4→5)
    const stepNum = parseInt(step.dataset.creditStep);
    if (stepNum < 4) {
        setTimeout(function() {
            const currentSel = document.querySelector(`[data-credit-step="${creditCurrentStep}"] .credit-option-button.option-selected`);
            if (currentSel && creditCurrentStep < creditTotalSteps) {
                creditAnswers[`step${creditCurrentStep}`] = currentSel.dataset.creditValue;
                creditCurrentStep++;
                showCreditStep(creditCurrentStep);
            }
        }, 320);
    }
});

document.addEventListener('click', function(e) {
    const popup = document.getElementById('creditAssessmentPopup');
    if (e.target === popup) closeCreditPopup();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popup = document.getElementById('creditAssessmentPopup');
        if (popup && popup.classList.contains('popup-show')) closeCreditPopup();
    }
});

// ── Generic Lead Form Wire ─────────────────────────────────────
function wireLeadForm({ formId, endpoint, extraData = () => ({}), onSuccess = null }) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnLabel  = form.querySelector('.btn-label');
        const btnSpin   = form.querySelector('.btn-spinner');
        const msg       = form.querySelector('[role="status"]');

        if (msg) {
            msg.textContent = '';
            msg.className = msg.className.replace(/\bis-(error|success)\b/g, '').trim();
        }
        if (submitBtn) submitBtn.disabled = true;
        if (btnLabel)  btnLabel.hidden = true;
        if (btnSpin)   btnSpin.hidden  = false;

        const payload = Object.assign({}, Object.fromEntries(new FormData(form).entries()), extraData());

        try {
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrf = csrfMeta ? csrfMeta.content : '';
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type':     'application/json',
                    'Accept':           'application/json',
                    'X-CSRF-TOKEN':     csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payload),
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok || !data.success) {
                if (msg) {
                    msg.classList.add('is-error');
                    msg.textContent = data.message || 'Something went wrong. Please try again.';
                }
                if (submitBtn) submitBtn.disabled = false;
                if (btnLabel)  btnLabel.hidden = false;
                if (btnSpin)   btnSpin.hidden  = true;
                return;
            }

            if (msg) {
                msg.classList.add('is-success');
                msg.textContent = data.message || 'Thanks — we will be in touch shortly!';
            }
            form.reset();
            if (typeof onSuccess === 'function') onSuccess();
        } catch {
            if (msg) {
                msg.classList.add('is-error');
                msg.textContent = 'Network error. Please try again.';
            }
            if (submitBtn) submitBtn.disabled = false;
            if (btnLabel)  btnLabel.hidden = false;
            if (btnSpin)   btnSpin.hidden  = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    wireLeadForm({
        formId:   'creditPopupLeadForm',
        endpoint: '/leads/popup',
        extraData: () => ({
            credit_score:     creditAnswers.step1 || null,
            available_credit: creditAnswers.step2 || null,
            credit_goal:      creditAnswers.step3 || null,
            timeline:         creditAnswers.step4 || null,
        }),
        onSuccess: () => setTimeout(closeCreditPopup, 2200),
    });

    wireLeadForm({
        formId:   'leadCtaForm',
        endpoint: '/leads/cta',
    });
});
