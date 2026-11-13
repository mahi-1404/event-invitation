// =====================================================
// ROYAL CELESTIAL INVITATION — INTERACTIVE ENGINE
// =====================================================

(function () {
    "use strict";

    /* =====================================================
       0. MOTION PREFERENCES
       -----------------------------------------------------
       "motion-ready" is only added when scroll reveals can actually
       run (IntersectionObserver present). Without it nothing is ever
       hidden, so the invitation stays fully readable if motion fails.
       ===================================================== */

    const reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

    function prefersReducedMotion() {
        return !!(reduceMotionQuery && reduceMotionQuery.matches);
    }

    function onReduceMotionChange(handler) {
        if (!reduceMotionQuery) return;
        if (reduceMotionQuery.addEventListener) reduceMotionQuery.addEventListener("change", handler);
        else if (reduceMotionQuery.addListener) reduceMotionQuery.addListener(handler);
    }

    if ("IntersectionObserver" in window) {
        document.documentElement.classList.add("motion-ready");
    }

    // Timings (ms) for the envelope choreography. Keep in step with the CSS tokens.
    const ENVELOPE_TIMING = {
        sealPress: 220,        // seal responds to the tap
        screenFade: 1750,      // flap (850) + letter lift (950) have finished
        reducedFade: 450,      // reduced motion: plain, short crossfade
        revealSettle: [200, 600, 1200]
    };
    const HERO_START_DELAY = 380; // let the previous screen finish fading first

    /* =====================================================
       1. EVENT DATA INITIALIZATION
       ===================================================== */

    const data = typeof eventData !== "undefined" ? eventData : {};

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    }

    function setMany(ids, value) {
        ids.forEach(id => setText(id, value));
    }

    function loadEventData() {
        const opening = data.opening || {};
        const reveal = data.reveal || {};
        const welcome = data.welcome || {};
        const invitation = data.invitation || {};
        const details = data.details || {};
        const date = data.date || {};
        const reception = data.reception || {};
        const muhurtham = data.muhurtham || {};

        // Page Title & Meta
        if (data.pageTitle) {
            document.title = data.pageTitle;
            setText("pageTitle", data.pageTitle);
        }

        // Screen 1: Opening Screen
        setMany(["openingLine1", "letterLine1"], opening.line1 || "YOU ARE");
        setMany(["openingEmphasis", "letterEmphasis"], opening.emphasis || "Invited");
        setMany(["openingLine2", "letterLine2"], opening.line2 || "TO SOMETHING SPECIAL");
        setText("openButtonText", opening.openButton || "TAP TO OPEN");
        setText("openingHint", opening.hint || "A little moment awaits you");

        // Screen 2: Reveal Screen
        setText("revealEyebrow", reveal.eyebrow || "A LITTLE SURPRISE");
        setText("revealTitle", reveal.title || "Something beautiful awaits");
        setText("revealDescription", reveal.description || "Scratch the golden surface to reveal the special moment.");
        setText("scratchPrompt", reveal.prompt || "SCRATCH HERE");
        setText("scratchPromptDetail", reveal.promptDetail || "TO REVEAL");
        setText("revealCompleteMessage", reveal.completeMessage || "A beautiful moment");

        const revealImage = document.getElementById("revealImage");
        if (revealImage && data.revealImage) {
            revealImage.src = data.revealImage;
            revealImage.alt = reveal.imageAlt || "Special memory";
        }

        // Screen 3: Welcome & Hero Section
        setText("invitationEyebrow", invitation.eyebrow || "SAVE THE DATE");
        setText("welcomeEyebrow", welcome.eyebrow || "A SPECIAL DAY AWAITS");
        setText("welcomeDescription", welcome.description || "Come celebrate a beautiful moment with us and be part of memories that will last forever.");
        setText("welcomeNamesSuffix", welcome.namesSuffix || "together with our families");
        setText("welcomeScrollHint", welcome.scrollHint || "SCROLL TO EXPLORE");

        const welcomeTitle = document.getElementById("welcomeTitle");
        if (welcomeTitle) {
            welcomeTitle.innerHTML = (welcome.title || "With love,|we invite you")
                .split("|")
                .map(part => `<span>${part}</span>`)
                .join("<br>");
        }

        const names = Array.isArray(data.names) ? data.names.filter(Boolean) : ["Nithin N S", "Lekhana C"];
        setText("eventNames", names.join(" & "));

        // Titles
        const title = data.title || {};
        setText("eventTitleLine1", title.line1 || "Nithin N S");
        setText("eventTitleLine2", title.line2 || "Lekhana C");
        setText("familyLine", invitation.familyLine || "Together with our beloved families");

        // Date Display
        setText("eventWeekday", date.weekday || "Sunday");
        setText("eventDateDay", date.day || "20");
        setText("eventDateMonth", date.month || "SEPTEMBER");
        setText("eventDateYear", date.year || "2026");
        // Time & Venue
        setText("eventTime", data.time || "10:20 AM – 11:10 AM");
        setText("eventVenue", data.venue || "Police Bhavan");
        setText("receptionDate", reception.date || "25 November 2026");
        setText("receptionTime", reception.time || "7:00 PM onwards");
        setText("muhurthamDate", muhurtham.date || "26 November 2026");
        setText("muhurthamTime", muhurtham.time || "10:20 AM – 11:10 AM");
        setText("eventDetailsVenue", data.venue || "Police Bhavan");
        setText("eventAddress", data.address || "Jockey Quarters\nJC Nagar\nMysuru");

        // Details Section
        setText("detailsEyebrow", details.eyebrow || "THE CELEBRATION");
        setText("detailsIntro", details.intro || "Join us as we celebrate this beautiful occasion surrounded by the people who mean the most to us.");
        setText("venueDetailsLabel", details.venueLabel || "VENUE");
        setText("locationButtonText", details.locationButton || "VIEW LOCATION");
        setText("detailsFooterLeft", details.footerLeft || "WITH LOVE");
        setText("detailsFooterRight", details.footerRight || "SEE YOU THERE");

        const detailsTitle = document.getElementById("detailsTitle");
        if (detailsTitle) {
            detailsTitle.innerHTML = (details.title || "A Day To|Remember")
                .split("|")
                .map(part => `<span>${part}</span>`)
                .join("<br>");
        }

        // Location Map Button
        const locationButton = document.getElementById("locationButton");
        if (locationButton) {
            if (data.mapLink) {
                locationButton.onclick = () => window.open(data.mapLink, "_blank", "noopener,noreferrer");
            } else {
                locationButton.hidden = true;
            }
        }

        // Render Media Gallery, Itinerary, and Countdown
        renderItinerary();
        renderGallery();
        initCountdown();
        initRSVP();
        initBlessings();
    }


    /* =====================================================
       2. AMBIENT BACKGROUND (quiet, sparse, slow)
       -----------------------------------------------------
       Only runs while the full invitation is on screen. It sits
       behind the opaque opening/reveal screens, so drawing there
       would be wasted work. Stops when the tab is hidden, when the
       guest prefers reduced motion, or when frames get slow.
       ===================================================== */

    const ambientCanvas = document.getElementById("ambientCanvas");
    let ambientCtx = null;
    let ambientStars = [];
    let ambientMotes = [];
    let ambientSprite = null;
    let ambientWanted = false;     // the invitation is open and wants a background
    let ambientRunning = false;
    let ambientDegraded = false;   // frames were too slow: fall back to a still frame
    let ambientRaf = 0;
    let ambientLastTime = 0;
    let ambientSlowFrames = 0;
    let ambientWidth = 0;
    let ambientHeight = 0;

    const AMBIENT_FRAME_MS = 33;   // ~30fps is plenty for slow drift

    function buildAmbientSprite() {
        // One soft gold glow, drawn once and reused for every mote
        const size = 128;
        const sprite = document.createElement("canvas");
        sprite.width = size;
        sprite.height = size;
        const ctx = sprite.getContext("2d");
        if (!ctx) return null;
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(232, 198, 124, 1)");
        grad.addColorStop(1, "rgba(232, 198, 124, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return sprite;
    }

    function layoutAmbient(force) {
        if (!ambientCanvas || !ambientCtx) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Mobile browsers fire "resize" as the address bar shows/hides. Ignore
        // small height changes so the particles don't reshuffle mid-scroll.
        if (!force && w === ambientWidth && Math.abs(h - ambientHeight) < 160) return;

        ambientWidth = w;
        ambientHeight = h;
        ambientCanvas.width = w;
        ambientCanvas.height = h;

        const small = w < 700;
        const starCount = small ? 26 : Math.min(54, Math.floor((w * h) / 24000));
        const moteCount = small ? 3 : 6;

        ambientStars = [];
        for (let i = 0; i < starCount; i++) {
            ambientStars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 0.9 + 0.35,
                alpha: Math.random() * 0.35 + 0.15,
                speed: Math.random() * 0.25 + 0.12,   // radians per second: slow twinkle
                phase: Math.random() * Math.PI * 2
            });
        }

        ambientMotes = [];
        for (let i = 0; i < moteCount; i++) {
            ambientMotes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 50 + 45,
                alpha: Math.random() * 0.035 + 0.015,
                vx: (Math.random() - 0.5) * 3,        // px per second
                vy: -(Math.random() * 4 + 2)
            });
        }

        if (!ambientRunning) drawAmbientFrame(0, 0);
    }

    function drawAmbientFrame(seconds, dt) {
        if (!ambientCtx) return;
        ambientCtx.clearRect(0, 0, ambientWidth, ambientHeight);

        if (ambientSprite) {
            for (const m of ambientMotes) {
                m.x += m.vx * dt;
                m.y += m.vy * dt;
                if (m.y < -m.radius) m.y = ambientHeight + m.radius;
                if (m.x < -m.radius) m.x = ambientWidth + m.radius;
                if (m.x > ambientWidth + m.radius) m.x = -m.radius;
                ambientCtx.globalAlpha = m.alpha;
                ambientCtx.drawImage(ambientSprite, m.x - m.radius, m.y - m.radius, m.radius * 2, m.radius * 2);
            }
        }

        ambientCtx.fillStyle = "rgb(253, 243, 205)";
        for (const s of ambientStars) {
            ambientCtx.globalAlpha = s.alpha * (0.65 + 0.35 * Math.sin(seconds * s.speed + s.phase));
            ambientCtx.beginPath();
            ambientCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ambientCtx.fill();
        }
        ambientCtx.globalAlpha = 1;
    }

    function tickAmbient(now) {
        if (!ambientRunning) return;
        ambientRaf = requestAnimationFrame(tickAmbient);

        if (!ambientLastTime) ambientLastTime = now;
        const elapsed = now - ambientLastTime;
        if (elapsed < AMBIENT_FRAME_MS) return;

        // Frames taking far longer than budgeted means a weak device: give up quietly
        if (elapsed > 90) {
            ambientSlowFrames++;
            if (ambientSlowFrames > 12) {
                ambientDegraded = true;
                stopAmbient();
                drawAmbientFrame(0, 0);
                return;
            }
        } else if (ambientSlowFrames > 0) {
            ambientSlowFrames--;
        }

        ambientLastTime = now;
        drawAmbientFrame(now / 1000, Math.min(elapsed, 100) / 1000);
    }

    function startAmbient() {
        ambientWanted = true;
        if (!ambientCtx || ambientRunning) return;
        if (document.hidden) return;
        if (prefersReducedMotion() || ambientDegraded) {
            drawAmbientFrame(0, 0);
            return;
        }
        ambientRunning = true;
        ambientLastTime = 0;
        ambientSlowFrames = 0;
        ambientRaf = requestAnimationFrame(tickAmbient);
    }

    function stopAmbient() {
        ambientRunning = false;
        if (ambientRaf) cancelAnimationFrame(ambientRaf);
        ambientRaf = 0;
    }

    function initAmbientCanvas() {
        if (!ambientCanvas) return;
        ambientCtx = ambientCanvas.getContext("2d");
        if (!ambientCtx) return;
        ambientSprite = buildAmbientSprite();

        layoutAmbient(true);
        window.addEventListener("resize", () => layoutAmbient(false));

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) stopAmbient();
            else if (ambientWanted) startAmbient();
        });

        onReduceMotionChange(() => {
            if (prefersReducedMotion()) {
                stopAmbient();
                drawAmbientFrame(0, 0);
            } else if (ambientWanted) {
                startAmbient();
            }
        });
    }


    /* =====================================================
       3. GOLD SPARKLES (small, rare celebration accents)
       -----------------------------------------------------
       Kept under the name triggerConfetti so existing call sites
       work, but it is deliberately restrained: few, small, gold,
       slow, and skipped entirely for reduced motion.
       ===================================================== */

    const confettiCanvas = document.getElementById("confettiCanvas");
    let confettiCtx = null;
    let confettiParticles = [];
    let isConfettiActive = false;
    const MAX_SPARKLES = 40;

    function initConfettiCanvas() {
        if (!confettiCanvas) return;
        confettiCtx = confettiCanvas.getContext("2d");
        function resize() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();
    }

    function triggerConfetti(originX, originY, count = 12) {
        if (prefersReducedMotion() || !confettiCanvas || !confettiCtx) return;
        const room = MAX_SPARKLES - confettiParticles.length;
        const total = Math.min(count, 20, room);
        if (total <= 0) return;

        const colors = ["#fdf3cd", "#f5d77f", "#e5c982", "#d4af37"];
        const ox = originX !== undefined ? originX : confettiCanvas.width / 2;
        const oy = originY !== undefined ? originY : confettiCanvas.height / 2;

        for (let i = 0; i < total; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 2.2 + 0.8;
            confettiParticles.push({
                x: ox,
                y: oy,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 0.8,
                size: Math.random() * 2.2 + 1.6,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.9,
                decay: Math.random() * 0.007 + 0.009,
                shape: Math.random() > 0.65 ? "spark" : "dot"
            });
        }

        if (!isConfettiActive) {
            isConfettiActive = true;
            requestAnimationFrame(renderConfetti);
        }
    }

    function renderConfetti() {
        if (!confettiCtx) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        if (!confettiParticles.length) {
            isConfettiActive = false;
            return;
        }

        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.985;
            p.vy = p.vy * 0.985 + 0.025; // very light gravity
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                confettiParticles.splice(i, 1);
                continue;
            }

            confettiCtx.globalAlpha = p.alpha;
            confettiCtx.fillStyle = p.color;
            confettiCtx.beginPath();
            if (p.shape === "spark") {
                // tiny four-point sparkle
                const r = p.size * 1.8;
                confettiCtx.moveTo(p.x, p.y - r);
                confettiCtx.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
                confettiCtx.quadraticCurveTo(p.x, p.y, p.x, p.y + r);
                confettiCtx.quadraticCurveTo(p.x, p.y, p.x - r, p.y);
                confettiCtx.quadraticCurveTo(p.x, p.y, p.x, p.y - r);
            } else {
                confettiCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            confettiCtx.fill();
        }
        confettiCtx.globalAlpha = 1;

        requestAnimationFrame(renderConfetti);
    }


    /* =====================================================
       4. AUDIO & MUSIC CONTROLLER
       ===================================================== */

    let backgroundAudio = null;
    let isMusicPlaying = false;
    const musicToggle = document.getElementById("musicToggle");
    const musicStatusText = document.getElementById("musicStatusText");

    function initAudio() {
        const musicConfig = data.music || {};
        if (!musicConfig.enabled || !musicConfig.source) {
            if (musicToggle) musicToggle.style.display = "none";
            return;
        }

        backgroundAudio = new Audio(musicConfig.source);
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.6;

        // Music is never autoplayed with sound: it starts paused, and the
        // equalizer only moves while audio is genuinely playing.
        setMusicUI(false);

        if (musicToggle) {
            musicToggle.addEventListener("click", toggleMusic);
            musicToggle.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMusic();
                }
            });
        }
    }

    // Single place that keeps the label, state and equalizer in agreement
    function setMusicUI(playing) {
        isMusicPlaying = playing;
        if (musicToggle) {
            musicToggle.classList.toggle("paused", !playing);
            musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
            musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
        }
        if (musicStatusText) musicStatusText.textContent = playing ? "Music Playing" : "Music Paused";
    }

    function startMusic() {
        if (!backgroundAudio || isMusicPlaying) return;
        backgroundAudio.play().then(() => {
            setMusicUI(true);
        }).catch(() => {
            // Autoplay blocked by browser policy; the guest can press Play music
        });
    }

    function toggleMusic() {
        if (!backgroundAudio) return;
        if (isMusicPlaying) {
            backgroundAudio.pause();
            setMusicUI(false);
            showToast("Music paused");
        } else {
            backgroundAudio.play().then(() => {
                setMusicUI(true);
                showToast("Music playing");
            }).catch(() => {
                showToast("Music could not be played");
            });
        }
    }


    /* =====================================================
       5. ENVELOPE OPENING EXPERIENCE
       ===================================================== */

    let envelopeOpened = false;
    const openingScreen = document.getElementById("openingScreen");
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    const openInvitationBtn = document.getElementById("openInvitation");
    const revealSection = document.getElementById("revealSection");
    const waxSeal = document.getElementById("waxSeal");

    // Every pending step of the opening sequence is tracked so that
    // "Skip to Invitation" can cancel it and nothing fires late.
    let envelopeTimers = [];

    function envelopeLater(fn, ms) {
        const id = setTimeout(fn, ms);
        envelopeTimers.push(id);
        return id;
    }

    function clearEnvelopeTimers() {
        envelopeTimers.forEach(clearTimeout);
        envelopeTimers = [];
    }

    // Transition from the envelope screen to the scratch reveal
    function showRevealScreen() {
        if (openingScreen) openingScreen.classList.add("hidden");
        if (!revealSection) return;

        revealSection.classList.add("active");
        revealSection.removeAttribute("aria-hidden");
        // Measure now and again as the entrance settles
        // (setupScratchCanvas is a no-op once the user starts scratching)
        setupScratchCanvas();
        ENVELOPE_TIMING.revealSettle.forEach(ms => envelopeLater(setupScratchCanvas, ms));
    }

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        // Start background music (user gesture, so browsers allow it)
        startMusic();

        if (!openingScreen) {
            showRevealScreen();
            return;
        }

        // Reduced motion: no seal choreography or 3D flap, just a short crossfade
        if (prefersReducedMotion()) {
            openingScreen.classList.add("opening");
            envelopeLater(showRevealScreen, ENVELOPE_TIMING.reducedFade);
            return;
        }

        // 1. Seal gives one subtle press
        openingScreen.classList.add("seal-press");

        // 2. Seal breaks, flap opens in 3D, letter lifts, button fades (all CSS, keyed off .opening)
        envelopeLater(() => {
            openingScreen.classList.remove("seal-press");
            openingScreen.classList.add("opening");
        }, ENVELOPE_TIMING.sealPress);

        // 3. Opening screen fades out while the reveal screen fades in
        envelopeLater(showRevealScreen, ENVELOPE_TIMING.screenFade);
    }

    if (openInvitationBtn) openInvitationBtn.addEventListener("click", openEnvelope);
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener("click", openEnvelope);
        // role="button" needs Enter and Space support, not just a click
        envelopeWrapper.addEventListener("keydown", (e) => {
            if (e.target !== envelopeWrapper) return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openEnvelope();
            }
        });
    }
    if (waxSeal) waxSeal.addEventListener("click", (e) => { e.stopPropagation(); openEnvelope(); });


    /* =====================================================
       6. SCRATCH-OFF REVEAL EXPERIENCE
       ===================================================== */

    const scratchCanvas = document.getElementById("scratchCanvas");
    const revealCover = document.getElementById("revealCover");
    const scratchContent = document.getElementById("scratchContent");
    const photoRevealCard = document.getElementById("photoReveal");
    const scratchParticles = document.getElementById("scratchParticles");
    const progressBar = document.getElementById("progressBar");
    const progressPercentage = document.getElementById("progressPercentage");
    const revealComplete = document.getElementById("revealComplete");
    const quickRevealBtn = document.getElementById("quickRevealBtn");
    const continueToInvitationBtn = document.getElementById("continueToInvitationBtn");
    const invitationScrollContainer = document.getElementById("invitationScrollContainer");

    let scratchCtx = null;
    let canvasW = 0;
    let canvasH = 0;
    let isScratching = false;
    let isRevealDone = false;
    let lastPoint = null;
    let lastParticleTime = 0;
    const FINISH_PERCENT = 55;
    let hasScratched = false;   // once true the foil is never redrawn (that would wipe progress)

    function setupScratchCanvas() {
        if (!scratchCanvas || !revealCover || isRevealDone || hasScratched) return;

        // Unscaled layout size: getBoundingClientRect() is shrunk by the scale-in animation
        const w = revealCover.offsetWidth || revealCover.clientWidth;
        const h = revealCover.offsetHeight || revealCover.clientHeight;
        if (!w || !h) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasW = Math.ceil(w);
        canvasH = Math.ceil(h);

        scratchCanvas.width = Math.round(canvasW * dpr);
        scratchCanvas.height = Math.round(canvasH * dpr);
        scratchCanvas.style.width = "100%";
        scratchCanvas.style.height = "100%";

        // The foil is read back to measure progress, so tell the browser up front
        scratchCtx = scratchCanvas.getContext("2d", { willReadFrequently: true });
        scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawGoldFoilSurface();

        setScratchProgress(0);
        isRevealDone = false;
        isScratching = false;
        lastPoint = null;
    }

    function drawGoldFoilSurface() {
        const ctx = scratchCtx;
        if (!ctx) return;

        // Luxurious Gilded Gold & Deep Plum Gradient
        const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
        grad.addColorStop(0, "#23163a");
        grad.addColorStop(0.35, "#3b2359");
        grad.addColorStop(0.7, "#281740");
        grad.addColorStop(1, "#180d2a");
        ctx.fillStyle = grad;
        ctx.fillRect(-4, -4, canvasW + 8, canvasH + 8);

        // Radiant Golden Shimmer Halo
        const glow = ctx.createRadialGradient(canvasW * 0.5, canvasH * 0.45, 10, canvasW * 0.5, canvasH * 0.45, canvasW * 0.65);
        glow.addColorStop(0, "rgba(245, 215, 127, 0.35)");
        glow.addColorStop(0.5, "rgba(212, 175, 55, 0.12)");
        glow.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(-4, -4, canvasW + 8, canvasH + 8);

        // Gold Leaf Dust & Star Spangles
        for (let i = 0; i < 90; i++) {
            const x = Math.random() * canvasW;
            const y = Math.random() * canvasH;
            const r = Math.random() * 1.6 + 0.4;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(253, 243, 205, ${Math.random() * 0.5 + 0.2})`;
            ctx.fill();
        }

        // Elegant Gold Filigree Inner Border
        ctx.save();
        ctx.strokeStyle = "rgba(245, 215, 127, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, canvasW - 20, canvasH - 20);
        ctx.strokeRect(14, 14, canvasW - 28, canvasH - 28);
        ctx.restore();
    }

    // Progress is a transform (scaleX) rather than an animated width, so it never triggers layout
    function setScratchProgress(percent) {
        if (progressBar) progressBar.style.transform = `scaleX(${Math.max(0, Math.min(100, percent)) / 100})`;
        if (progressPercentage) progressPercentage.textContent = `${percent}%`;
    }

    function getCoords(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        // The card is briefly scaled by its entrance animation, so map the
        // on-screen rect back to the canvas's own coordinate space.
        const scaleX = rect.width ? canvasW / rect.width : 1;
        const scaleY = rect.height ? canvasH / rect.height : 1;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function scratchAt(x, y) {
        if (!scratchCtx) return;
        const radius = 30;
        const grad = scratchCtx.createRadialGradient(x, y, 2, x, y, radius);
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(0.7, "rgba(0,0,0,0.95)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        scratchCtx.save();
        scratchCtx.globalCompositeOperation = "destination-out";
        scratchCtx.fillStyle = grad;
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, radius, 0, Math.PI * 2);
        scratchCtx.fill();
        scratchCtx.restore();
    }

    function scratchLine(p1, p2) {
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const steps = Math.max(1, Math.ceil(dist / 8));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            scratchAt(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
        }
    }

    // Small, quiet gold dust near the pointer. Bounded: at most MAX_SCRATCH_DUST
    // elements exist at once, and none at all for reduced motion.
    const MAX_SCRATCH_DUST = 10;
    let liveScratchDust = 0;

    function createSparkleParticle(x, y) {
        if (!scratchParticles || prefersReducedMotion()) return;
        const now = performance.now();
        if (now - lastParticleTime < 90 || liveScratchDust >= MAX_SCRATCH_DUST) return;
        lastParticleTime = now;

        const p = document.createElement("span");
        p.className = "scratch-particle";
        const size = Math.random() * 2.5 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty("--px", `${(Math.random() - 0.5) * 26}px`);
        p.style.setProperty("--py", `${(Math.random() - 0.5) * 26 - 6}px`);

        liveScratchDust++;
        scratchParticles.appendChild(p);
        setTimeout(() => {
            p.remove();
            liveScratchDust--;
        }, 700);
    }

    // Reading pixels back from the canvas is the most expensive thing the
    // scratch card does, so it is rate-limited while dragging.
    let lastPercentCheck = 0;

    function computeScratchPercent(force) {
        if (!scratchCtx || isRevealDone) return;
        const now = performance.now();
        if (!force && now - lastPercentCheck < 140) return;
        lastPercentCheck = now;

        const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imgData.data;
        const sampleRate = 16;
        let total = 0;
        let clear = 0;

        for (let i = 3; i < pixels.length; i += 4 * sampleRate) {
            total++;
            if (pixels[i] < 128) clear++;
        }

        const percent = Math.min(100, Math.round((clear / total) * 100));
        setScratchProgress(percent);

        if (percent >= FINISH_PERCENT) {
            completeReveal();
        }
    }

    function startScratch(e) {
        if (isRevealDone) return;
        isScratching = true;
        hasScratched = true;
        // First scratch: the prompt fades away and the foil sweep stops (CSS keys off this class)
        if (photoRevealCard) photoRevealCard.classList.add("is-scratched");
        if (scratchContent) scratchContent.style.opacity = "0";
        // keep receiving move events even if the finger drifts off the canvas
        try { scratchCanvas.setPointerCapture(e.pointerId); } catch (err) {}
        const pt = getCoords(e);
        lastPoint = pt;
        scratchAt(pt.x, pt.y);
        createSparkleParticle(pt.x, pt.y);
        e.preventDefault();
    }

    function moveScratch(e) {
        if (!isScratching || isRevealDone) return;
        const pt = getCoords(e);
        if (lastPoint) {
            scratchLine(lastPoint, pt);
        } else {
            scratchAt(pt.x, pt.y);
        }
        lastPoint = pt;
        createSparkleParticle(pt.x, pt.y);
        computeScratchPercent();
        e.preventDefault();
    }

    function endScratch() {
        if (!isScratching) return;
        isScratching = false;
        lastPoint = null;
        computeScratchPercent(true);
    }

    // Used by both finishing the scratch and the "Tap to Unveil Photo" shortcut,
    // so both get the same graceful ending.
    function completeReveal() {
        if (isRevealDone) return;
        isRevealDone = true;
        hasScratched = true;   // the foil must never be redrawn from here on
        isScratching = false;
        const reduced = prefersReducedMotion();

        // 1. Foil fades out, the photo settles from 1.02 to 1, helpers step aside (all CSS, keyed off .reveal-done)
        if (revealSection) revealSection.classList.add("reveal-done");
        if (photoRevealCard) photoRevealCard.classList.add("is-scratched");
        setScratchProgress(100);

        // 2. A single restrained sparkle once the photo is mostly clear
        envelopeLater(() => {
            if (!revealCover) return;
            const cardRect = revealCover.getBoundingClientRect();
            triggerConfetti(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, 12);
        }, reduced ? 0 : 420);

        // 3. Completion message rises in, then the "Explore" button
        envelopeLater(() => {
            if (!revealComplete) return;
            revealComplete.classList.add("visible");
            // Make sure the button is fully on screen and easy to tap
            envelopeLater(() => {
                if (!revealSection || !revealSection.classList.contains("active")) return;
                const btn = document.getElementById("continueToInvitationBtn");
                if (btn) btn.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
            }, 150);
        }, reduced ? 0 : 520);
    }

    // Quick Reveal Button
    if (quickRevealBtn) {
        quickRevealBtn.addEventListener("click", () => {
            completeReveal();
            showToast("✨ Photograph unveiled!");
        });
    }

    // Pointer Events for Scratch Canvas
    if (scratchCanvas) {
        scratchCanvas.addEventListener("pointerdown", startScratch);
        scratchCanvas.addEventListener("pointermove", moveScratch);
        scratchCanvas.addEventListener("pointerup", endScratch);
        scratchCanvas.addEventListener("pointercancel", endScratch);
        // Phones fire "resize" whenever the address bar shows/hides; setupScratchCanvas
        // ignores it once scratching has begun, so progress is never wiped.
        window.addEventListener("resize", () => {
            if (revealSection.classList.contains("active")) setupScratchCanvas();
        });
    }

    // Continue to Full Invitation
    let hasEnteredInvitation = false;

    function enterFullInvitation() {
        if (hasEnteredInvitation) return;
        hasEnteredInvitation = true;

        // Cancel anything still queued from the opening/reveal sequences
        clearEnvelopeTimers();
        const reduced = prefersReducedMotion();

        if (revealSection) {
            revealSection.classList.remove("active");
            revealSection.setAttribute("aria-hidden", "true");
        }

        if (invitationScrollContainer) {
            invitationScrollContainer.classList.add("active");
            window.scrollTo({ top: 0, behavior: "auto" });

            // The hero plays its editorial sequence once the previous screen has
            // mostly faded, so none of it is wasted underneath an overlay.
            const welcomeSection = document.getElementById("welcomeSection");
            setTimeout(() => {
                if (welcomeSection) welcomeSection.classList.add("hero-play");
            }, reduced ? 0 : HERO_START_DELAY);
        }

        // The quiet background layer only needs to run once the invitation is visible
        startAmbient();
    }

    if (continueToInvitationBtn) {
        continueToInvitationBtn.addEventListener("click", enterFullInvitation);
    }

    const skipEnvelopeBtn = document.getElementById("skipEnvelopeBtn");
    if (skipEnvelopeBtn) {
        skipEnvelopeBtn.addEventListener("click", () => {
            envelopeOpened = true; // the envelope can no longer be opened underneath
            startMusic();
            if (openingScreen) openingScreen.classList.add("hidden");
            enterFullInvitation();
        });
    }

    const skipRevealBtn = document.getElementById("skipRevealBtn");
    if (skipRevealBtn) {
        skipRevealBtn.addEventListener("click", enterFullInvitation);
    }

    const scrollIndicator = document.getElementById("scrollIndicator");
    if (scrollIndicator) {
        scrollIndicator.style.cursor = "pointer";
        scrollIndicator.addEventListener("click", () => {
            const detailsSection = document.getElementById("eventDetailsSection");
            if (detailsSection) detailsSection.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });
    }


    /* =====================================================
       7. LIVE COUNTDOWN TIMER
       ===================================================== */

    function initCountdown() {
        const cdDays = document.getElementById("cdDays");
        const cdHours = document.getElementById("cdHours");
        const cdMinutes = document.getElementById("cdMinutes");
        const cdSeconds = document.getElementById("cdSeconds");

        if (!cdDays) return;

        // Target Date
        let targetDate = new Date("2026-11-25T19:00:00");
        if (data.countdownTarget) {
            const parsed = new Date(data.countdownTarget);
            if (!isNaN(parsed.getTime())) targetDate = parsed;
        }

        function update() {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                cdDays.textContent = "00";
                cdHours.textContent = "00";
                cdMinutes.textContent = "00";
                cdSeconds.textContent = "00";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            cdDays.textContent = String(days).padStart(2, "0");
            cdHours.textContent = String(hours).padStart(2, "0");
            cdMinutes.textContent = String(minutes).padStart(2, "0");
            cdSeconds.textContent = String(seconds).padStart(2, "0");
        }

        update();
        setInterval(update, 1000);
    }


    /* =====================================================
       8. CALENDAR INTEGRATION & COPY ADDRESS
       ===================================================== */

    const addGoogleCalendarBtn = document.getElementById("addGoogleCalendarBtn");
    const downloadIcalBtn = document.getElementById("downloadIcalBtn");
    const copyAddressButton = document.getElementById("copyAddressButton");

    if (addGoogleCalendarBtn) {
        addGoogleCalendarBtn.addEventListener("click", () => {
            const title = encodeURIComponent("Nithin N S & Lekhana C — Wedding Celebration");
            const details = encodeURIComponent((data.details && data.details.intro) || "Join us to celebrate with Nithin N S and Lekhana C.");
            const location = encodeURIComponent(`${data.venue || "Police Bhavan"}, ${data.address || "Jockey Quarters, JC Nagar, Mysuru"}`);
            const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261125T133000Z/20261126T053000Z&details=${details}&location=${location}`;
            window.open(gcalUrl, "_blank", "noopener,noreferrer");
            showToast("Opening Google Calendar...");
        });
    }

    if (downloadIcalBtn) {
        downloadIcalBtn.addEventListener("click", () => {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Nithin N S and Lekhana C Wedding//Invitation//EN",
                "CALSCALE:GREGORIAN",
                "METHOD:PUBLISH",
                "BEGIN:VEVENT",
                "UID:nithin-lekhana-reception-2026@invitation",
                "DTSTAMP:20261113T000000Z",
                "DTSTART:20261125T133000Z",
                "DTEND:20261125T170000Z",
                "SUMMARY:Reception — Nithin N S & Lekhana C",
                "DESCRIPTION:Reception celebration for Nithin N S and Lekhana C.",
                "LOCATION:Police Bhavan, Jockey Quarters, JC Nagar, Mysuru",
                "END:VEVENT",
                "BEGIN:VEVENT",
                "UID:nithin-lekhana-muhurtham-2026@invitation",
                "DTSTAMP:20261113T000000Z",
                "DTSTART:20261126T045000Z",
                "DTEND:20261126T054000Z",
                "SUMMARY:Muhurtham — Nithin N S & Lekhana C",
                "DESCRIPTION:Muhurtham ceremony for Nithin N S and Lekhana C.",
                "LOCATION:Police Bhavan, Jockey Quarters, JC Nagar, Mysuru",
                "STATUS:CONFIRMED",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Nithin-Lekhana-Wedding-Invitation.ics";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showToast("Calendar invite downloaded!");
        });
    }

    const shareInviteBtn = document.getElementById("shareInviteBtn");
    if (shareInviteBtn) {
        shareInviteBtn.addEventListener("click", () => {
            const shareText = "You're cordially invited to celebrate the wedding of Nithin N S & Lekhana C. Reception: 25 November 2026 at 7:00 PM onwards. Muhurtham: 26 November 2026 from 10:20 AM to 11:10 AM. Venue: Police Bhavan, Jockey Quarters, JC Nagar, Mysuru. Please join us and shower your blessings:";
            const shareUrl = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: "Nithin N S & Lekhana C — Wedding Invitation",
                    text: shareText,
                    url: shareUrl
                }).catch(() => {});
            } else {
                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
                window.open(waUrl, "_blank", "noopener,noreferrer");
            }
        });
    }

    if (copyAddressButton) {
        copyAddressButton.addEventListener("click", () => {
            const address = `${data.venue || "Police Bhavan"}, ${data.address || "Jockey Quarters\nJC Nagar\nMysuru"}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(() => {
                    confirmAddressCopied();
                }).catch(() => {
                    fallbackCopy(address);
                });
            } else {
                fallbackCopy(address);
            }
        });
    }

    // Success is told in words (button label + toast), with a soft colour change as a bonus,
    // never by motion alone.
    let copyConfirmTimer = null;

    function confirmAddressCopied() {
        const label = document.getElementById("copyAddressText");
        const icon = document.getElementById("copyAddressIcon");
        if (copyAddressButton && label) {
            const original = label.dataset.original || label.textContent;
            label.dataset.original = original;
            label.textContent = "Address Copied";
            if (icon) icon.textContent = "✓";
            copyAddressButton.classList.add("is-success");
            clearTimeout(copyConfirmTimer);
            copyConfirmTimer = setTimeout(() => {
                label.textContent = original;
                if (icon) icon.textContent = "📋";
                copyAddressButton.classList.remove("is-success");
            }, 2200);
        }
        showToast("✓ Venue address copied to clipboard!");
    }

    function fallbackCopy(text) {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        confirmAddressCopied();
    }


    /* =====================================================
       9. ITINERARY TIMELINE RENDERING
       ===================================================== */

    function renderItinerary() {
        const timeline = document.getElementById("itineraryTimeline");
        if (!timeline) return;

        const defaultItinerary = [
            { time: "09:00 AM", title: "Welcoming of Baraat & Guests", desc: "A traditional welcome with floral showers, refreshing drinks, and auspicious music" },
            { time: "10:30 AM", title: "Auspicious Muhurtham", desc: "Sacred wedding rituals, Jeerakalla-Bellam, Saptapadi & Mangalya Dharana" },
            { time: "12:30 PM", title: "Grand Wedding Feast", desc: "A grand traditional wedding lunch to celebrate the newlyweds" },
            { time: "06:30 PM", title: "Evening Reception & Celebrations", desc: "An enchanting evening of music, celebrations, and photo memories" }
        ];

        const items = Array.isArray(data.itinerary) && data.itinerary.length ? data.itinerary : defaultItinerary;
        timeline.innerHTML = "";

        const icons = ["✨", "🎂", "🍽️", "📸", "🎁"];

        items.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "timeline-item";

            div.innerHTML = `
                <div class="timeline-content">
                    <span class="timeline-time-badge">${item.time}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.desc}</p>
                </div>
                <div class="timeline-node">
                    <span>${icons[index % icons.length]}</span>
                </div>
            `;

            timeline.appendChild(div);
        });
    }


    /* =====================================================
       10. MEDIA GALLERY & LIGHTBOX
       ===================================================== */

    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    const lightboxBackdrop = document.getElementById("lightboxBackdrop");

    let galleryItems = [];
    let currentLightboxIdx = 0;

    function renderGallery() {
        const mediaContainer = document.getElementById("eventMedia");
        if (!mediaContainer) return;

        const rawList = Array.isArray(data.gallery) ? data.gallery : [];
        galleryItems = rawList.map(item => (typeof item === "string" ? { src: item, caption: "Cherished Moment" } : item)).filter(i => i && i.src);

        if (!galleryItems.length) {
            mediaContainer.hidden = true;
            return;
        }

        mediaContainer.hidden = false;
        mediaContainer.innerHTML = "";

        const grid = document.createElement("div");
        grid.className = "media-gallery";

        galleryItems.forEach((item, index) => {
            const fig = document.createElement("figure");
            fig.className = "gallery-figure";
            fig.setAttribute("role", "button");
            fig.setAttribute("tabindex", "0");
            fig.setAttribute("aria-label", `View photo ${index + 1}`);
            fig.dataset.cursor = "View";

            fig.innerHTML = `
                <img src="${item.src}" alt="${item.caption || "Special moment"}" class="gallery-img" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-zoom-icon">🔍</span>
                    <span class="gallery-caption">${item.caption || "Special Memory"}</span>
                </div>
            `;

            fig.addEventListener("click", () => openLightbox(index));
            fig.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(index);
                }
            });

            // Images fade in when they arrive, independent of the scroll animation.
            // A cached image can already be complete before the listener is attached.
            const img = fig.querySelector("img");
            const markLoaded = () => img.classList.add("is-loaded");
            img.addEventListener("load", markLoaded);
            if (img.complete && img.naturalWidth > 0) markLoaded();

            // Prevent broken images from disrupting the layout
            img.addEventListener("error", () => fig.remove());

            grid.appendChild(fig);
        });

        mediaContainer.appendChild(grid);
    }

    let lightboxReturnFocus = null;

    function openLightbox(index) {
        if (!lightboxModal || !galleryItems[index]) return;
        const wasOpen = lightboxModal.classList.contains("active");
        currentLightboxIdx = index;
        lightboxImg.src = galleryItems[index].src;
        lightboxCaption.textContent = galleryItems[index].caption || "Cherished Moment";
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Keyboard users land on the close button and get back to where they were
        if (!wasOpen) {
            lightboxReturnFocus = document.activeElement;
            // The modal only becomes focusable once the browser has rendered its opened
            // state, which on the very first open lands a beat after the click handler.
            setTimeout(() => {
                if (lightboxClose && lightboxModal.classList.contains("active")) {
                    lightboxClose.focus({ preventScroll: true });
                }
            }, 60);
        }
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove("active");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
        if (lightboxReturnFocus && typeof lightboxReturnFocus.focus === "function") {
            lightboxReturnFocus.focus({ preventScroll: true });
        }
        lightboxReturnFocus = null;
    }

    function showLightboxNav(dir) {
        currentLightboxIdx = (currentLightboxIdx + dir + galleryItems.length) % galleryItems.length;
        openLightbox(currentLightboxIdx);
    }

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", () => showLightboxNav(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => showLightboxNav(1));

    window.addEventListener("keydown", (e) => {
        if (lightboxModal && lightboxModal.classList.contains("active")) {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showLightboxNav(-1);
            if (e.key === "ArrowRight") showLightboxNav(1);
        }
    });


    /* =====================================================
       11. INTERACTIVE RSVP SYSTEM
       ===================================================== */

    function initRSVP() {
        const rsvpForm = document.getElementById("rsvpForm");
        const rsvpSuccessMessage = document.getElementById("rsvpSuccessMessage");
        const rsvpSuccessTitle = document.getElementById("rsvpSuccessTitle");
        const rsvpSuccessDetail = document.getElementById("rsvpSuccessDetail");
        const rsvpChangeBtn = document.getElementById("rsvpChangeBtn");
        const guestCountGroup = document.getElementById("guestCountGroup");
        const radioCards = document.querySelectorAll(".radio-card");

        if (!rsvpForm) return;

        // Radio styling toggle
        radioCards.forEach(card => {
            const input = card.querySelector("input");
            input.addEventListener("change", () => {
                radioCards.forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                if (guestCountGroup) {
                    guestCountGroup.style.display = input.value === "declined" ? "none" : "flex";
                }
            });
        });

        // Load saved RSVP from localStorage
        const savedRSVP = localStorage.getItem("event_rsvp_nithin_lekhana");
        if (savedRSVP) {
            try {
                const parsed = JSON.parse(savedRSVP);
                showRSVPSuccess(parsed);
            } catch (e) {}
        }

        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
            const name = document.getElementById("guestName").value.trim();
            const count = document.getElementById("guestCount").value;
            const blessing = document.getElementById("guestBlessing").value.trim();

            const rsvpData = { attendance, name, count, blessing, timestamp: new Date().toISOString() };
            localStorage.setItem("event_rsvp_nithin_lekhana", JSON.stringify(rsvpData));

            // If a blessing was entered, add it to the blessings wall!
            if (blessing) {
                addBlessingToWall(name, blessing);
            }

            // A small gold sparkle; the success message and toast carry the actual confirmation
            const submitBtn = document.getElementById("rsvpSubmitBtn");
            const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;
            triggerConfetti(
                submitRect ? submitRect.left + submitRect.width / 2 : window.innerWidth / 2,
                submitRect ? submitRect.top + submitRect.height / 2 : window.innerHeight / 2,
                14
            );
            showRSVPSuccess(rsvpData);
            showToast("✓ RSVP confirmed with gratitude!");
        });

        if (rsvpChangeBtn) {
            rsvpChangeBtn.addEventListener("click", () => {
                rsvpSuccessMessage.hidden = true;
                rsvpForm.hidden = false;
            });
        }

        function showRSVPSuccess(res) {
            rsvpForm.hidden = true;
            rsvpSuccessMessage.hidden = false;

            if (res.attendance === "attending") {
                rsvpSuccessTitle.textContent = `Joyfully Confirmed, ${res.name}!`;
                rsvpSuccessDetail.textContent = `We are delighted to celebrate our wedding with you and your party of ${res.count} on 25 and 26 November 2026.`;
            } else {
                rsvpSuccessTitle.textContent = `Thank You For Your Love, ${res.name}!`;
                rsvpSuccessDetail.textContent = `We will miss your presence in person, but your heartfelt blessings mean everything to Nithin N S, Lekhana C and our families.`;
            }
        }
    }


    /* =====================================================
       12. GUEST BLESSINGS WALL
       ===================================================== */

    const blessingsGrid = document.getElementById("blessingsGrid");

    const defaultBlessings = [];

    function initBlessings() {
        if (!blessingsGrid) return;
        let stored = localStorage.getItem("event_blessings_nithin_lekhana");
        let list = defaultBlessings;
        if (stored) {
            try { list = JSON.parse(stored); } catch (e) {}
        }
        renderBlessings(list);
    }

    function renderBlessings(list) {
        if (!blessingsGrid) return;
        blessingsGrid.innerHTML = "";

        list.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "blessing-card";
            card.innerHTML = `
                <p class="blessing-quote">"${item.note}"</p>
                <div class="blessing-author-row">
                    <span class="blessing-author">${item.name}</span>
                    <span class="blessing-heart" data-index="${index}">❤️ <span>${item.hearts || 1}</span></span>
                </div>
            `;

            const heartBtn = card.querySelector(".blessing-heart");
            heartBtn.addEventListener("click", () => {
                item.hearts = (item.hearts || 1) + 1;
                heartBtn.querySelector("span").textContent = item.hearts;
                heartBtn.style.transform = "scale(1.15)";
                setTimeout(() => heartBtn.style.transform = "scale(1)", 200);
            });

            blessingsGrid.appendChild(card);
        });
    }

    function addBlessingToWall(name, note) {
        let stored = localStorage.getItem("event_blessings_nithin_lekhana");
        let list = defaultBlessings;
        if (stored) {
            try { list = JSON.parse(stored); } catch (e) {}
        }
        list.unshift({ name, note, hearts: 1 });
        localStorage.setItem("event_blessings_nithin_lekhana", JSON.stringify(list));
        renderBlessings(list);
    }


    /* =====================================================
       13. TOAST NOTIFICATION & UTILS
       ===================================================== */

    const toastNotification = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");
    let toastTimeout = null;

    function showToast(msg) {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = msg;
        toastNotification.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove("show");
        }, 3200);
    }

    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });
    }

    const quickNavDock = document.getElementById("quickNavDock");
    window.addEventListener("scroll", () => {
        if (!quickNavDock || !invitationScrollContainer) return;
        if (invitationScrollContainer.classList.contains("active") && window.scrollY > 400) {
            quickNavDock.classList.add("visible");
        } else {
            quickNavDock.classList.remove("visible");
        }
    }, { passive: true });


    /* =====================================================
       14. SCROLL REVEALS
       -----------------------------------------------------
       Sections ease in once, as they approach the viewport. Elements
       are only tagged here in JS, and hidden by CSS only while
       <html> has "motion-ready", so a failure leaves everything visible.
       ===================================================== */

    function initScrollReveal() {
        if (!("IntersectionObserver" in window) || !invitationScrollContainer) return;

        const targets = [];

        function add(selector, opts) {
            const o = opts || {};
            invitationScrollContainer.querySelectorAll(selector).forEach((el, i) => {
                if (el.classList.contains("mr") || el.classList.contains("mr-line")) return;
                if (o.skip && o.skip(el)) return;
                el.classList.add(o.line ? "mr-line" : "mr");
                if (o.fade) el.classList.add("mr-fade");
                if (o.small) el.classList.add("mr-small");
                if (o.pop) el.classList.add("mr-pop");
                const base = typeof o.base === "function" ? o.base(i) : (o.base || 0);
                el.dataset.rdBase = String(base);
                el.dataset.rdStep = String(o.step || 110);
                targets.push(el);
            });
        }

        // Section headings (the blessings section gets one calm fade as a whole instead)
        add(".section-header", { skip: el => !!el.closest(".blessings-section") });

        // The panoramic portrait and its caption
        add(".panorama-frame", { pop: true });
        add(".panorama-caption", { fade: true });

        // Couple: the two cards with a very small stagger, emblem between them
        add(".couple-card", { step: 120, pop: true });
        add(".couple-union-divider", { fade: true, step: 120 });

        // Reception, then muhurtham, then venue (document order = reading order)
        add(".detail-card", { small: true, step: 140, pop: true });
        add(".venue-showcase-card", { pop: true });

        // Timeline: the central line draws, then the event items arrive
        add(".itinerary-timeline", { line: true });
        add(".timeline-item", { base: 250, step: 140 });

        // Gallery: feature image first, then the supporting images
        add(".gallery-figure", { base: i => (i === 0 ? 0 : 140), step: 90 });

        // RSVP card and form arrive together; blessings and footer just fade
        add(".rsvp-card", { pop: true });
        add(".blessings-section .section-container", { fade: true });
        add(".footer-inner", { fade: true });

        if (!targets.length) return;

        const io = new IntersectionObserver((entries) => {
            const entering = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) =>
                    (a.boundingClientRect.top - b.boundingClientRect.top) ||
                    (a.boundingClientRect.left - b.boundingClientRect.left));

            // Items entering together cascade in reading order, capped so nothing lags
            entering.forEach((entry, k) => {
                const el = entry.target;
                const base = Number(el.dataset.rdBase) || 0;
                const step = Number(el.dataset.rdStep) || 110;
                el.style.setProperty("--rd", `${base + Math.min(k, 4) * step}ms`);
                el.classList.add("is-in");
                io.unobserve(el); // animate once; never re-trigger while scrolling
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

        targets.forEach(el => io.observe(el));
    }


    /* =====================================================
       15. PREMIUM FLOURISHES
       -----------------------------------------------------
       Extra polish layered on top of the core animation system.
       Rules for everything in this section:
       - Off entirely under prefers-reduced-motion.
       - Mouse-driven effects only run with a real mouse
         ((hover: hover) and (pointer: fine)); phones never pay for them.
       - Each effect is independent and fails silently, so the
         invitation is complete without any of them.
       ===================================================== */

    const finePointerQuery = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : null;

    function hasFinePointer() {
        return !!(finePointerQuery && finePointerQuery.matches);
    }

    /* ---------- 15a. Parallax depth ----------
       Ambient glows drift slower than the content; a few small
       ornaments float slightly faster. Uses the individual
       `translate` property so it never fights the transforms that
       entrance animations and hovers already use. */

    function initParallax() {
        const glows = [
            // Both drift upward (the same way the page scrolls), far slower than the content
            { el: document.querySelector(".glow-1"), range: -170 },
            { el: document.querySelector(".glow-2"), range: -240 }
        ].filter(g => g.el);
        const floaters = Array.from(document.querySelectorAll(
            ".hero-crest, .rsvp-symbol, .footer-crest"
        )).map(el => ({ el, applied: 0 }));

        let queued = false;
        let cleared = false;

        function update() {
            queued = false;

            if (prefersReducedMotion() || !invitationScrollContainer || !invitationScrollContainer.classList.contains("active")) {
                if (!cleared) {
                    glows.forEach(g => { g.el.style.translate = ""; });
                    floaters.forEach(f => { f.el.style.translate = ""; f.applied = 0; });
                    cleared = true;
                }
                return;
            }
            cleared = false;

            const y = window.scrollY;
            const vh = window.innerHeight;

            // Ambient light: a slow, bounded drift (never leaves the screen)
            glows.forEach(g => {
                g.el.style.translate = `0 ${(g.range * Math.tanh(y / 2600)).toFixed(1)}px`;
            });

            // Read every position first, then write: one layout pass per frame
            const centres = floaters.map(f => {
                const r = f.el.getBoundingClientRect();
                return r.top + r.height / 2 - f.applied; // remove our own offset
            });
            floaters.forEach((f, i) => {
                const c = centres[i];
                if (c < -240 || c > vh + 240) return; // off screen: leave as is
                const offset = Math.max(-34, Math.min(34, -(c - vh / 2) * 0.07));
                f.applied = offset;
                f.el.style.translate = `0 ${offset.toFixed(1)}px`;
            });
        }

        window.addEventListener("scroll", () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        }, { passive: true });

        onReduceMotionChange(() => requestAnimationFrame(update));
    }

    /* ---------- 15b. Split text ----------
       Headings are split into words and letters. CSS then unmasks the
       letters in a left-to-right wave. The full text stays available to
       screen readers through aria-label; the split pieces are hidden. */

    function splitIntoLetters(el) {
        if (!el || el.dataset.split) return;
        let index = 0;

        function walk(node) {
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(" "));
                            return;
                        }
                        const word = document.createElement("span");
                        word.className = "sw";
                        word.setAttribute("aria-hidden", "true");
                        Array.from(part).forEach(ch => {
                            const letter = document.createElement("span");
                            letter.className = "ch";
                            letter.style.setProperty("--ci", String(index++));
                            letter.textContent = ch;
                            word.appendChild(letter);
                        });
                        frag.appendChild(word);
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== "BR") {
                    walk(child);
                }
            });
        }

        walk(el);
        el.dataset.split = "1";
        el.classList.add("is-split");

        // Once the last letter lands, drop the clipping mask so glows and
        // italic overhangs are never cut off at rest.
        const last = index - 1;
        el.addEventListener("animationend", (e) => {
            if (e.target.classList && e.target.classList.contains("ch") &&
                Number(e.target.style.getPropertyValue("--ci")) === last) {
                el.classList.add("is-settled");
            }
        });
    }

    function initSplitText() {
        if (prefersReducedMotion()) return;

        document.querySelectorAll(".section-title").forEach(title => {
            const label = title.textContent.replace(/\s+/g, " ").trim();
            splitIntoLetters(title);
            title.setAttribute("aria-label", label);
        });

        // Hero names: the h1 keeps one readable label; each line splits visually
        const heroTitle = document.querySelector(".hero-main-title");
        const line1 = document.getElementById("eventTitleLine1");
        const line2 = document.getElementById("eventTitleLine2");
        if (heroTitle && line1 && line2) {
            heroTitle.setAttribute("aria-label", `${line1.textContent} & ${line2.textContent}`);
            splitIntoLetters(line1);
            splitIntoLetters(line2);
        }
    }

    /* ---------- 15c. Magnetic hover ----------
       Primary buttons and the RSVP choice cards lean a few pixels toward
       the cursor; their label leans a little further. On release they
       settle back with a small spring. Desktop mouse only. */

    function initMagnetic() {
        if (!hasFinePointer() || prefersReducedMotion()) return;

        const defs = [
            { sel: ".open-button", inner: "#openButtonText", radius: 90, pull: 0.26, max: 9 },
            { sel: ".continue-invitation-btn", inner: "span", radius: 90, pull: 0.26, max: 9 },
            { sel: ".location-button", inner: "span", radius: 70, pull: 0.24, max: 8 },
            { sel: ".rsvp-submit-btn", inner: "span", radius: 70, pull: 0.1, max: 5 },
            { sel: ".radio-card", target: ".radio-content", inner: ".radio-emoji", radius: 50, pull: 0.12, max: 6 }
        ];

        const magnets = [];
        defs.forEach(def => {
            document.querySelectorAll(def.sel).forEach(host => {
                const target = def.target ? host.querySelector(def.target) : host;
                const inner = def.inner ? target.querySelector(def.inner) : null;
                if (!target) return;
                target.classList.add("magnet");
                if (inner) inner.classList.add("magnet-inner");
                magnets.push({ host, target, inner, def, x: 0, y: 0, active: false });
            });
        });
        if (!magnets.length) return;

        let pointer = null;
        let queued = false;

        function settle(m) {
            if (!m.active && m.x === 0 && m.y === 0) return;
            m.active = false;
            m.x = 0;
            m.y = 0;
            m.target.classList.add("is-released"); // springy return
            m.target.style.translate = "";
            if (m.inner) m.inner.style.translate = "";
        }

        function update() {
            queued = false;
            if (!pointer) {
                magnets.forEach(settle);
                return;
            }
            magnets.forEach(m => {
                const r = m.host.getBoundingClientRect();
                if (!r.width || !r.height) { settle(m); return; }

                const cx = r.left + r.width / 2 - (m.def.target ? 0 : m.x);
                const cy = r.top + r.height / 2 - (m.def.target ? 0 : m.y);
                const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right);
                const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom);

                if (Math.hypot(dx, dy) > m.def.radius) {
                    settle(m);
                    return;
                }

                const clamp = (v) => Math.max(-m.def.max, Math.min(m.def.max, v));
                m.x = clamp((pointer.x - cx) * m.def.pull);
                m.y = clamp((pointer.y - cy) * m.def.pull);
                m.active = true;
                m.target.classList.remove("is-released");
                m.target.style.translate = `${m.x.toFixed(1)}px ${m.y.toFixed(1)}px`;
                if (m.inner) m.inner.style.translate = `${(m.x * 0.6).toFixed(1)}px ${(m.y * 0.6).toFixed(1)}px`;
            });
        }

        document.addEventListener("pointermove", (e) => {
            if (e.pointerType !== "mouse") return;
            pointer = { x: e.clientX, y: e.clientY };
            if (!queued) {
                queued = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });

        document.documentElement.addEventListener("mouseleave", () => {
            pointer = null;
            requestAnimationFrame(update);
        });
    }

    /* ---------- 15d. Spotlight on cards ----------
       A soft gold light follows the cursor across the detail and venue
       cards. The cursor position is handed to CSS as two variables. */

    function initSpotlight() {
        if (!hasFinePointer() || prefersReducedMotion()) return;

        document.querySelectorAll(".detail-card, .venue-showcase-card").forEach(card => {
            card.addEventListener("pointermove", (e) => {
                if (e.pointerType !== "mouse") return;
                const r = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
                card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
            }, { passive: true });
        });
    }

    /* ---------- 15e. Custom cursor ----------
       A small gold dot with a ring that trails it. Over the scratch card,
       the envelope and gallery photos the ring grows and names the action.
       Only switches on after the first real mouse movement, and never over
       form fields, so typing and selecting stay native. */

    function initCursor() {
        if (!hasFinePointer() || prefersReducedMotion()) return;

        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        const ring = document.createElement("div");
        ring.className = "cursor-ring";
        const label = document.createElement("span");
        label.className = "cursor-label";
        ring.appendChild(label);
        [dot, ring].forEach(el => {
            el.setAttribute("aria-hidden", "true");
            document.body.appendChild(el);
        });

        // Say what each interactive surface does
        if (photoRevealCard) photoRevealCard.dataset.cursor = "Scratch";
        if (envelopeWrapper) envelopeWrapper.dataset.cursor = "Open";

        let mx = 0, my = 0, rx = 0, ry = 0;
        let raf = 0;
        let started = false;

        function placeDot() {
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        }

        function loop() {
            raf = 0;
            rx += (mx - rx) * 0.2;
            ry += (my - ry) * 0.2;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
                raf = requestAnimationFrame(loop);
            }
        }

        document.addEventListener("pointermove", (e) => {
            if (e.pointerType !== "mouse") return;
            mx = e.clientX;
            my = e.clientY;
            if (!started) {
                started = true;
                rx = mx;
                ry = my;
                document.body.classList.add("has-custom-cursor");
            }
            document.body.classList.add("cursor-visible");
            placeDot();
            if (!raf) raf = requestAnimationFrame(loop);
        }, { passive: true });

        document.addEventListener("pointerover", (e) => {
            if (e.pointerType !== "mouse" || !e.target.closest) return;
            const t = e.target;

            const native = t.closest("input, textarea, select, option");
            document.body.classList.toggle("cursor-native", !!native);

            const named = t.closest("[data-cursor]");
            if (named) {
                label.textContent = named.dataset.cursor;
                ring.classList.add("is-labelled");
            } else {
                ring.classList.remove("is-labelled");
            }

            ring.classList.toggle("is-link", !named && !!t.closest("a, button, [role='button'], label, .radio-card"));
        });

        document.addEventListener("pointerdown", (e) => {
            if (e.pointerType === "mouse") ring.classList.add("is-down");
        });
        document.addEventListener("pointerup", () => ring.classList.remove("is-down"));
        document.addEventListener("pointercancel", () => ring.classList.remove("is-down"));

        document.documentElement.addEventListener("mouseleave", () => document.body.classList.remove("cursor-visible"));
        document.documentElement.addEventListener("mouseenter", () => {
            if (started) document.body.classList.add("cursor-visible");
        });
    }

    /* ---------- 15f. Ken Burns ----------
       Gallery photos drift very slowly (CSS). They only run while on
       screen, so off-screen photos cost nothing. */

    function initKenBurns() {
        if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
        const figures = document.querySelectorAll(".gallery-figure, .panorama-frame");
        if (!figures.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.target.classList.toggle("kb-on", entry.isIntersecting));
        }, { threshold: 0.05 });

        figures.forEach(fig => io.observe(fig));
    }

    /* ---------- 15g. Liquid hover (raw WebGL, no library) ----------
       Hovering a gallery photo sends a soft ripple out from the cursor.
       One shared canvas is moved onto the hovered figure, so only a single
       WebGL context ever exists. If WebGL is missing or the browser blocks
       reading the image (for example opened from file://), nothing happens
       and the normal CSS hover is used. */

    function initLiquidHover() {
        if (!hasFinePointer() || prefersReducedMotion()) return;
        const figures = Array.from(document.querySelectorAll(".gallery-figure"));
        if (!figures.length) return;

        const canvas = document.createElement("canvas");
        canvas.className = "gl-canvas";
        canvas.setAttribute("aria-hidden", "true");

        let gl = null;
        try {
            gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
        } catch (err) {
            gl = null;
        }
        if (!gl) return;

        const vertexSrc = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
        const fragmentSrc = [
            "#ifdef GL_FRAGMENT_PRECISION_HIGH",
            "precision highp float;",
            "#else",
            "precision mediump float;",
            "#endif",
            "uniform sampler2D uTex;",
            "uniform vec2 uRes;",
            "uniform vec4 uRect;",
            "uniform vec2 uMouse;",
            "uniform float uTime;",
            "uniform float uStrength;",
            "uniform float uTexAspect;",
            "uniform float uObjY;",
            "uniform float uDpr;",
            "void main(){",
            "  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;",
            "  vec2 d = px - uMouse;",
            "  float r = length(d);",
            "  float wave = sin(r * 0.055 - uTime * 4.2) * exp(-r * 0.011);",
            "  px += (d / max(r, 1.0)) * wave * 9.0 * uStrength;",
            "  px += vec2(sin(px.y * 0.035 + uTime * 1.6), cos(px.x * 0.03 + uTime * 1.3)) * 1.6 * uStrength;",
            "  vec2 q = (px - uRect.xy) / uRect.zw;",
            "  float a = uRect.z / uRect.w;",
            "  if (uTexAspect > a) { q.x = (q.x - 0.5) * (a / uTexAspect) + 0.5; }",
            "  else { float f = uTexAspect / a; q.y = q.y * f + (1.0 - f) * uObjY; }",
            "  gl_FragColor = texture2D(uTex, clamp(q, 0.0, 1.0));",
            "}"
        ].join("\n");

        function compile(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
        }

        const vs = compile(gl.VERTEX_SHADER, vertexSrc);
        const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const U = {};
        ["uTex", "uRes", "uRect", "uMouse", "uTime", "uStrength", "uTexAspect", "uObjY", "uDpr"].forEach(n => {
            U[n] = gl.getUniformLocation(program, n);
        });

        let disabled = false;
        canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); disabled = true; });

        // Textures are built once per photo, downscaled so a huge original never reaches the GPU
        const textures = new Map();
        function textureFor(img) {
            if (textures.has(img.currentSrc)) return textures.get(img.currentSrc);
            const longest = Math.max(img.naturalWidth, img.naturalHeight);
            const scale = Math.min(1, 1280 / longest);
            const w = Math.max(1, Math.round(img.naturalWidth * scale));
            const h = Math.max(1, Math.round(img.naturalHeight * scale));
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            c.getContext("2d").drawImage(img, 0, 0, w, h);

            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c); // throws if the image is tainted
            const rec = { tex, aspect: w / h };
            textures.set(img.currentSrc, rec);
            return rec;
        }

        let state = null;      // { fig, img, rec, rect, mouse, origin, target, strength }
        let raf = 0;
        let leaveTimer = 0;

        function finish() {
            clearTimeout(leaveTimer);
            cancelAnimationFrame(raf);
            raf = 0;
            if (!state) return;
            state.fig.classList.remove("gl-on");
            canvas.classList.remove("is-live");
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            state = null;
        }

        function draw(now) {
            gl.bindTexture(gl.TEXTURE_2D, state.rec.tex);
            gl.uniform1i(U.uTex, 0);
            gl.uniform2f(U.uRes, canvas.width, canvas.height);
            gl.uniform4f(U.uRect, state.rect[0], state.rect[1], state.rect[2], state.rect[3]);
            gl.uniform2f(U.uMouse, state.mouse[0], state.mouse[1]);
            gl.uniform1f(U.uTime, now / 1000);
            gl.uniform1f(U.uStrength, state.strength);
            gl.uniform1f(U.uTexAspect, state.rec.aspect);
            gl.uniform1f(U.uObjY, state.objY);
            gl.uniform1f(U.uDpr, state.dpr);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        function frame(now) {
            raf = 0;
            if (!state) return;
            state.strength += (state.target - state.strength) * 0.1;
            draw(now);
            if (!canvas.classList.contains("is-live") && state.target > 0) canvas.classList.add("is-live");
            raf = requestAnimationFrame(frame);
        }

        function enter(fig, e) {
            if (disabled || e.pointerType !== "mouse") return;
            const img = fig.querySelector(".gallery-img");
            if (!img || !img.complete || !img.naturalWidth) return;
            if (state) finish();

            let rec;
            try {
                rec = textureFor(img);
            } catch (err) {
                disabled = true; // tainted image or no GPU memory: keep the CSS hover
                return;
            }

            // Freeze the photo's own motion so the canvas matches it exactly
            fig.classList.add("gl-on");
            const figRect = fig.getBoundingClientRect();   // flushes styles
            const imgRect = img.getBoundingClientRect();
            const originX = figRect.left + fig.clientLeft;
            const originY = figRect.top + fig.clientTop;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.max(1, Math.round(fig.clientWidth * dpr));
            canvas.height = Math.max(1, Math.round(fig.clientHeight * dpr));
            gl.viewport(0, 0, canvas.width, canvas.height);

            const pos = (getComputedStyle(img).objectPosition || "50% 50%").split(" ");
            const objY = pos[1] && pos[1].endsWith("%") ? parseFloat(pos[1]) / 100 : 0.5;

            state = {
                fig, img, rec, dpr, objY,
                rect: [imgRect.left - originX, imgRect.top - originY, imgRect.width, imgRect.height],
                origin: [originX, originY],
                mouse: [e.clientX - originX, e.clientY - originY],
                target: 1,
                strength: 0
            };

            fig.appendChild(canvas);
            draw(performance.now());
            raf = requestAnimationFrame(frame);
        }

        function move(e) {
            if (!state || e.pointerType !== "mouse") return;
            state.mouse = [e.clientX - state.origin[0], e.clientY - state.origin[1]];
        }

        function leave() {
            if (!state) return;
            state.target = 0;
            canvas.classList.remove("is-live");
            clearTimeout(leaveTimer);
            leaveTimer = setTimeout(finish, 260);
        }

        figures.forEach(fig => {
            fig.addEventListener("pointerenter", (e) => enter(fig, e));
            fig.addEventListener("pointermove", move, { passive: true });
            fig.addEventListener("pointerleave", leave);
        });
    }


    /* ---------- 15h. Scroll effects ----------
       Simple, scroll-linked touches:
       - a thin gold progress line at the top of the screen
       - the hero drifts down and softly fades as you scroll past it
       - the wide banner photo slides slowly inside its frame (depth)
       - the bottom nav highlights the section you are in
       One passive scroll listener, batched into a single frame. */

    function initScrollEffects() {
        if (!invitationScrollContainer) return;

        const bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        const hero = document.querySelector(".hero-inner");
        const heroSection = document.getElementById("welcomeSection");
        const pano = document.querySelector(".panorama-img");
        const panoBox = pano ? pano.parentNode : null;
        let queued = false;

        function update() {
            queued = false;
            const active = invitationScrollContainer.classList.contains("active");
            const y = window.scrollY;
            const vh = window.innerHeight;
            const max = document.documentElement.scrollHeight - vh;

            bar.style.transform = `scaleX(${active && max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
            bar.classList.toggle("is-on", active && y > 8);

            if (!active) return;

            if (prefersReducedMotion()) {
                if (hero) { hero.style.translate = ""; hero.style.opacity = ""; }
                if (pano) pano.style.objectPosition = "";
                return;
            }

            // Hero: drifts down a little and fades as it leaves the screen
            if (hero && heroSection) {
                const h = heroSection.offsetHeight || vh;
                const p = Math.min(1, Math.max(0, y / (h * 0.85)));
                hero.style.translate = p ? `0 ${(p * 46).toFixed(1)}px` : "";
                hero.style.opacity = p ? (1 - p * 0.7).toFixed(3) : "";
            }

            // Banner photo: slides slowly inside its frame while the frame scrolls past
            if (pano && panoBox) {
                const r = panoBox.getBoundingClientRect();
                if (r.bottom > -60 && r.top < vh + 60) {
                    const p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
                    const c = Math.max(-1, Math.min(1, p));
                    pano.style.objectPosition = `center ${(68 + c * 30).toFixed(1)}%`;
                }
            }
        }

        window.addEventListener("scroll", () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(update);
        }, { passive: true });
        window.addEventListener("resize", () => requestAnimationFrame(update));
        onReduceMotionChange(() => requestAnimationFrame(update));
    }

    function initScrollSpy() {
        if (!("IntersectionObserver" in window)) return;
        const links = Array.from(document.querySelectorAll(".quick-nav-dock .nav-item"));
        const sections = new Map();
        links.forEach(a => {
            const id = a.getAttribute("href");
            const sec = id && id.charAt(0) === "#" ? document.querySelector(id) : null;
            if (sec) sections.set(sec, a);
        });
        if (!sections.size) return;

        // The section crossing the middle of the screen is "current"
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const current = sections.get(entry.target);
                links.forEach(l => {
                    const on = l === current;
                    l.classList.toggle("is-active", on);
                    if (on) l.setAttribute("aria-current", "true");
                    else l.removeAttribute("aria-current");
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        sections.forEach((a, sec) => io.observe(sec));
    }

    /* =====================================================
       16. BOOTSTRAP INVITATION
       ===================================================== */

    let hasBooted = false;

    function boot() {
        if (hasBooted) return; // never wire up listeners twice
        hasBooted = true;
        loadEventData();
        initSplitText();
        initScrollReveal();
        initAmbientCanvas();
        initConfettiCanvas();
        initAudio();
        initParallax();
        initMagnetic();
        initSpotlight();
        initCursor();
        initKenBurns();
        initLiquidHover();
        initScrollEffects();
        initScrollSpy();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }

})();
