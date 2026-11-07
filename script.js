// =====================================================
// ROYAL CELESTIAL INVITATION — INTERACTIVE ENGINE
// =====================================================

(function () {
    "use strict";

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

        const names = Array.isArray(data.names) ? data.names.filter(Boolean) : ["Naveen", "Ramya"];
        setText("eventNames", names.join(" & "));

        // Titles
        const title = data.title || {};
        setText("eventTitleLine1", title.line1 || "Grihith's");
        setText("eventTitleLine2", title.line2 || "Second Birthday");
        setText("familyLine", invitation.familyLine || "Together with our families");

        // Date Display
        setText("eventWeekday", date.weekday || "Sunday");
        setText("eventDateDay", date.day || "20");
        setText("eventDateMonth", date.month || "SEPTEMBER");
        setText("eventDateYear", date.year || "2026");
        setText("eventDateDisplay", date.display || `${date.day || "20"} ${date.month || "September"} ${date.year || "2026"}`);
        setText("eventDetailsWeekday", date.weekday || "Sunday");

        // Time & Venue
        setMany(["eventTime", "eventDetailsTime"], data.time || "11 AM");
        setText("eventTimeNote", data.timeNote || "Guests are welcome from 10:30 AM");
        setMany(["eventVenue", "eventDetailsVenue"], data.venue || "Savi Events Venue");
        setText("eventAddress", data.address || "Bangalore");

        // Details Section
        setText("detailsEyebrow", details.eyebrow || "THE CELEBRATION");
        setText("detailsIntro", details.intro || "Join us as we celebrate this beautiful occasion surrounded by the people who mean the most to us.");
        setText("dateDetailsLabel", details.dateLabel || "DATE & DAY");
        setText("timeDetailsLabel", details.timeLabel || "TIME");
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
       2. AMBIENT COSMIC PARTICLE CANVAS (Twinkling Stars & Bokeh)
       ===================================================== */

    const ambientCanvas = document.getElementById("ambientCanvas");
    let ambientCtx = null;
    let stars = [];
    let bokeh = [];
    let shootingStars = [];

    function initAmbientCanvas() {
        if (!ambientCanvas) return;
        ambientCtx = ambientCanvas.getContext("2d");

        function resize() {
            ambientCanvas.width = window.innerWidth;
            ambientCanvas.height = window.innerHeight;
            createStars();
            createBokeh();
        }

        function createStars() {
            stars = [];
            const count = Math.min(120, Math.floor((ambientCanvas.width * ambientCanvas.height) / 10000));
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * ambientCanvas.width,
                    y: Math.random() * ambientCanvas.height,
                    radius: Math.random() * 1.5 + 0.3,
                    alpha: Math.random() * 0.7 + 0.2,
                    speed: Math.random() * 0.02 + 0.005,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        function createBokeh() {
            bokeh = [];
            const count = Math.min(18, Math.floor(ambientCanvas.width / 80));
            for (let i = 0; i < count; i++) {
                bokeh.push({
                    x: Math.random() * ambientCanvas.width,
                    y: Math.random() * ambientCanvas.height,
                    radius: Math.random() * 60 + 20,
                    alpha: Math.random() * 0.08 + 0.02,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -Math.random() * 0.4 - 0.1
                });
            }
        }

        function maybeLaunchShootingStar() {
            if (Math.random() < 0.008 && shootingStars.length < 2) {
                shootingStars.push({
                    x: Math.random() * ambientCanvas.width * 0.8,
                    y: Math.random() * ambientCanvas.height * 0.4,
                    length: Math.random() * 80 + 40,
                    speed: Math.random() * 8 + 6,
                    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
                    opacity: 1
                });
            }
        }

        function drawAmbient() {
            ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

            // Draw Bokeh
            for (let b of bokeh) {
                b.x += b.vx;
                b.y += b.vy;
                if (b.y < -b.radius) b.y = ambientCanvas.height + b.radius;
                if (b.x < -b.radius) b.x = ambientCanvas.width + b.radius;
                if (b.x > ambientCanvas.width + b.radius) b.x = -b.radius;

                const grad = ambientCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
                grad.addColorStop(0, `rgba(232, 198, 124, ${b.alpha})`);
                grad.addColorStop(1, "rgba(232, 198, 124, 0)");
                ambientCtx.fillStyle = grad;
                ambientCtx.beginPath();
                ambientCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ambientCtx.fill();
            }

            // Draw Stars
            const time = performance.now() * 0.001;
            for (let s of stars) {
                const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(time * 2 + s.phase));
                ambientCtx.beginPath();
                ambientCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ambientCtx.fillStyle = `rgba(253, 243, 205, ${currentAlpha})`;
                ambientCtx.shadowBlur = s.radius > 1 ? 6 : 0;
                ambientCtx.shadowColor = "rgba(245, 215, 127, 0.8)";
                ambientCtx.fill();
            }
            ambientCtx.shadowBlur = 0;

            // Draw Shooting Stars
            maybeLaunchShootingStar();
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;
                ss.opacity -= 0.02;

                if (ss.opacity <= 0) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const tailX = ss.x - Math.cos(ss.angle) * ss.length;
                const tailY = ss.y - Math.sin(ss.angle) * ss.length;

                const grad = ambientCtx.createLinearGradient(ss.x, ss.y, tailX, tailY);
                grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
                grad.addColorStop(0.3, `rgba(245, 215, 127, ${ss.opacity * 0.8})`);
                grad.addColorStop(1, "rgba(245, 215, 127, 0)");

                ambientCtx.strokeStyle = grad;
                ambientCtx.lineWidth = 1.5;
                ambientCtx.beginPath();
                ambientCtx.moveTo(ss.x, ss.y);
                ambientCtx.lineTo(tailX, tailY);
                ambientCtx.stroke();
            }

            requestAnimationFrame(drawAmbient);
        }

        window.addEventListener("resize", resize);
        resize();
        requestAnimationFrame(drawAmbient);
    }


    /* =====================================================
       3. CONFETTI PARTICLES ENGINE (Celebration Moments)
       ===================================================== */

    const confettiCanvas = document.getElementById("confettiCanvas");
    let confettiCtx = null;
    let confettiParticles = [];
    let isConfettiActive = false;

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

    function triggerConfetti(originX, originY, count = 75) {
        if (!confettiCanvas || !confettiCtx) return;
        const colors = ["#fdf3cd", "#f5d77f", "#d4af37", "#b8860b", "#fff", "#f9e076", "#e8c67c"];
        const ox = originX !== undefined ? originX : confettiCanvas.width / 2;
        const oy = originY !== undefined ? originY : confettiCanvas.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 12 + 4;
            confettiParticles.push({
                x: ox,
                y: oy,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.008,
                shape: Math.random() > 0.4 ? "rect" : "star"
            });
        }

        if (!isConfettiActive) {
            isConfettiActive = true;
            renderConfetti();
        }
    }

    function renderConfetti() {
        if (!confettiParticles.length) {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            isConfettiActive = false;
            return;
        }

        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25; // Gravity
            p.rotation += p.vRot;
            p.alpha -= p.decay;

            if (p.alpha <= 0 || p.y > confettiCanvas.height + 50) {
                confettiParticles.splice(i, 1);
                continue;
            }

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.globalAlpha = p.alpha;
            confettiCtx.fillStyle = p.color;

            if (p.shape === "rect") {
                confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                // Mini Star
                confettiCtx.beginPath();
                for (let j = 0; j < 5; j++) {
                    confettiCtx.lineTo(Math.cos(((18 + j * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + j * 72) * Math.PI) / 180) * p.size);
                    confettiCtx.lineTo(Math.cos(((54 + j * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + j * 72) * Math.PI) / 180) * (p.size / 2));
                }
                confettiCtx.closePath();
                confettiCtx.fill();
            }

            confettiCtx.restore();
        }

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

    function startMusic() {
        if (!backgroundAudio || isMusicPlaying) return;
        backgroundAudio.play().then(() => {
            isMusicPlaying = true;
            if (musicToggle) musicToggle.classList.remove("paused");
            if (musicStatusText) musicStatusText.textContent = "Music Playing";
        }).catch(() => {
            // Autoplay blocked by browser policy; user interaction will trigger
        });
    }

    function toggleMusic() {
        if (!backgroundAudio) return;
        if (isMusicPlaying) {
            backgroundAudio.pause();
            isMusicPlaying = false;
            if (musicToggle) musicToggle.classList.add("paused");
            if (musicStatusText) musicStatusText.textContent = "Music Paused";
            showToast("Music paused");
        } else {
            backgroundAudio.play().then(() => {
                isMusicPlaying = true;
                if (musicToggle) musicToggle.classList.remove("paused");
                if (musicStatusText) musicStatusText.textContent = "Music Playing";
                showToast("Music playing");
            }).catch(() => {});
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

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        // Start background music
        startMusic();

        // Wax Seal burst & open animation
        const sealRect = waxSeal.getBoundingClientRect();
        triggerConfetti(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2, 40);

        if (openingScreen) openingScreen.classList.add("opening");
        if (openInvitationBtn) openInvitationBtn.style.opacity = "0";

        // Transition from Envelope Screen to Scratch Reveal Section
        setTimeout(() => {
            if (openingScreen) openingScreen.classList.add("hidden");
            if (revealSection) {
                revealSection.classList.add("active");
                revealSection.removeAttribute("aria-hidden");
                setTimeout(setupScratchCanvas, 150);
            }
        }, 1800);
    }

    if (openInvitationBtn) openInvitationBtn.addEventListener("click", openEnvelope);
    if (envelopeWrapper) envelopeWrapper.addEventListener("click", openEnvelope);
    if (waxSeal) waxSeal.addEventListener("click", (e) => { e.stopPropagation(); openEnvelope(); });


    /* =====================================================
       6. SCRATCH-OFF REVEAL EXPERIENCE
       ===================================================== */

    const scratchCanvas = document.getElementById("scratchCanvas");
    const revealCover = document.getElementById("revealCover");
    const scratchContent = document.getElementById("scratchContent");
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

    function setupScratchCanvas() {
        if (!scratchCanvas || !revealCover) return;
        const rect = revealCover.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasW = rect.width;
        canvasH = rect.height;

        scratchCanvas.width = Math.floor(canvasW * dpr);
        scratchCanvas.height = Math.floor(canvasH * dpr);
        scratchCanvas.style.width = `${canvasW}px`;
        scratchCanvas.style.height = `${canvasH}px`;

        scratchCtx = scratchCanvas.getContext("2d");
        scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawGoldFoilSurface();

        if (progressBar) progressBar.style.width = "0%";
        if (progressPercentage) progressPercentage.textContent = "0%";
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
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Radiant Golden Shimmer Halo
        const glow = ctx.createRadialGradient(canvasW * 0.5, canvasH * 0.45, 10, canvasW * 0.5, canvasH * 0.45, canvasW * 0.65);
        glow.addColorStop(0, "rgba(245, 215, 127, 0.35)");
        glow.addColorStop(0.5, "rgba(212, 175, 55, 0.12)");
        glow.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvasW, canvasH);

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

    function getCoords(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
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

    function createSparkleParticle(x, y) {
        const now = performance.now();
        if (now - lastParticleTime < 60 || !scratchParticles) return;
        lastParticleTime = now;

        const p = document.createElement("span");
        p.className = "scratch-particle";
        const size = Math.random() * 6 + 3;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty("--px", `${(Math.random() - 0.5) * 60}px`);
        p.style.setProperty("--py", `${(Math.random() - 0.5) * 60}px`);

        scratchParticles.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }

    function computeScratchPercent() {
        if (!scratchCtx || isRevealDone) return;
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
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressPercentage) progressPercentage.textContent = `${percent}%`;

        if (percent >= FINISH_PERCENT) {
            completeReveal();
        }
    }

    function startScratch(e) {
        if (isRevealDone) return;
        isScratching = true;
        if (scratchContent) scratchContent.style.opacity = "0";
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
        computeScratchPercent();
    }

    function completeReveal() {
        if (isRevealDone) return;
        isRevealDone = true;

        if (progressBar) progressBar.style.width = "100%";
        if (progressPercentage) progressPercentage.textContent = "100%";
        if (scratchContent) scratchContent.style.opacity = "0";

        // Confetti burst on completion!
        const cardRect = revealCover.getBoundingClientRect();
        triggerConfetti(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, 60);

        // Fade out scratch cover
        scratchCanvas.style.transition = "opacity 0.8s ease-out";
        scratchCanvas.style.opacity = "0";

        setTimeout(() => {
            if (revealCover) {
                revealCover.style.opacity = "0";
                revealCover.style.pointerEvents = "none";
            }
            if (revealComplete) {
                revealComplete.classList.add("visible");
            }
        }, 500);
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
        window.addEventListener("resize", () => {
            if (!isRevealDone && revealSection.classList.contains("active")) {
                setupScratchCanvas();
            }
        });
    }

    // Continue to Full Invitation
    function enterFullInvitation() {
        if (revealSection) {
            revealSection.classList.remove("active");
            revealSection.setAttribute("aria-hidden", "true");
        }

        if (invitationScrollContainer) {
            invitationScrollContainer.classList.add("active");
            setTimeout(() => {
                invitationScrollContainer.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }

        // Celebrate landing on full invitation
        triggerConfetti(window.innerWidth / 2, 200, 50);
    }

    if (continueToInvitationBtn) {
        continueToInvitationBtn.addEventListener("click", enterFullInvitation);
    }

    const skipEnvelopeBtn = document.getElementById("skipEnvelopeBtn");
    if (skipEnvelopeBtn) {
        skipEnvelopeBtn.addEventListener("click", () => {
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
            if (detailsSection) detailsSection.scrollIntoView({ behavior: "smooth" });
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
        let targetDate = new Date("2026-09-20T11:00:00");
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
            const title = encodeURIComponent((data.title && `${data.title.line1} ${data.title.line2}`) || "Grihith's Second Birthday Celebration");
            const details = encodeURIComponent((data.details && data.details.intro) || "Join us to celebrate this beautiful occasion!");
            const location = encodeURIComponent(`${data.venue || "Savi Events Venue"}, ${data.address || "Bangalore"}`);
            // Dates format: YYYYMMDDTHHmmssZ
            const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260920T053000Z/20260920T093000Z&details=${details}&location=${location}`;
            window.open(gcalUrl, "_blank", "noopener,noreferrer");
            showToast("Opening Google Calendar...");
        });
    }

    if (downloadIcalBtn) {
        downloadIcalBtn.addEventListener("click", () => {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Grihith Birthday//Invitation//EN",
                "CALSCALE:GREGORIAN",
                "METHOD:PUBLISH",
                "BEGIN:VEVENT",
                "UID:grihith-second-birthday-2026@invitation",
                "DTSTAMP:20260920T053000Z",
                "DTSTART:20260920T053000Z",
                "DTEND:20260920T093000Z",
                `SUMMARY:${(data.title && `${data.title.line1} ${data.title.line2}`) || "Grihith's Second Birthday"}`,
                `DESCRIPTION:${(data.details && data.details.intro) || "Join us for Grihith's Second Birthday Celebration!"}`,
                `LOCATION:${data.venue || "Savi Events Venue"}, ${data.address || "Bangalore"}`,
                "STATUS:CONFIRMED",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Grihith-Birthday-Invitation.ics";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showToast("Calendar invite downloaded!");
        });
    }

    if (copyAddressButton) {
        copyAddressButton.addEventListener("click", () => {
            const address = `${data.venue || "Savi Events Venue"}, ${data.address || "Bangalore"}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(() => {
                    showToast("✓ Venue address copied to clipboard!");
                }).catch(() => {
                    fallbackCopy(address);
                });
            } else {
                fallbackCopy(address);
            }
        });
    }

    function fallbackCopy(text) {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        showToast("✓ Venue address copied to clipboard!");
    }


    /* =====================================================
       9. ITINERARY TIMELINE RENDERING
       ===================================================== */

    function renderItinerary() {
        const timeline = document.getElementById("itineraryTimeline");
        if (!timeline) return;

        const defaultItinerary = [
            { time: "10:30 AM", title: "Welcoming & Refreshments", desc: "Arrival of cherished guests and welcome drinks" },
            { time: "11:00 AM", title: "Celebration & Cake Cutting", desc: "Milestone celebration for Grihith's 2nd birthday" },
            { time: "12:30 PM", title: "Grand Royal Feast", desc: "Delicious lunch with friends and family" },
            { time: "02:00 PM", title: "Photographs & Sweet Memories", desc: "Capturing smiles, blessings, and joyful moments" }
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

            // Prevent broken images from disrupting the layout
            const img = fig.querySelector("img");
            img.addEventListener("error", () => fig.remove());

            grid.appendChild(fig);
        });

        mediaContainer.appendChild(grid);
    }

    function openLightbox(index) {
        if (!lightboxModal || !galleryItems[index]) return;
        currentLightboxIdx = index;
        lightboxImg.src = galleryItems[index].src;
        lightboxCaption.textContent = galleryItems[index].caption || "Cherished Moment";
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove("active");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
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
        const savedRSVP = localStorage.getItem("event_rsvp_grihith");
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
            localStorage.setItem("event_rsvp_grihith", JSON.stringify(rsvpData));

            // If a blessing was entered, add it to the blessings wall!
            if (blessing) {
                addBlessingToWall(name, blessing);
            }

            // Confetti celebration!
            triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
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
                rsvpSuccessDetail.textContent = `We are delighted to celebrate with you and your party of ${res.count} on 20 September 2026.`;
            } else {
                rsvpSuccessTitle.textContent = `Thank You For Your Love, ${res.name}!`;
                rsvpSuccessDetail.textContent = `We will truly miss you in person, but your warm wishes mean the world to Grihith and our family.`;
            }
        }
    }


    /* =====================================================
       12. GUEST BLESSINGS WALL
       ===================================================== */

    const blessingsGrid = document.getElementById("blessingsGrid");

    const defaultBlessings = [
        { name: "Aarav & Priya", note: "Wishing sweetest little Grihith the happiest 2nd birthday! May your days be filled with pure laughter and joy!", hearts: 12 },
        { name: "Sunita & Family", note: "Dearest Naveen & Ramya, congratulations on this beautiful milestone! Sending endless blessings to little Grihith.", hearts: 19 },
        { name: "Karthik & Deepa", note: "Happy 2nd Birthday to the star of the family! Can't wait to celebrate and see you grow up so bright!", hearts: 15 }
    ];

    function initBlessings() {
        if (!blessingsGrid) return;
        let stored = localStorage.getItem("event_blessings_grihith");
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
                heartBtn.style.transform = "scale(1.4)";
                setTimeout(() => heartBtn.style.transform = "scale(1)", 200);
            });

            blessingsGrid.appendChild(card);
        });
    }

    function addBlessingToWall(name, note) {
        let stored = localStorage.getItem("event_blessings_grihith");
        let list = defaultBlessings;
        if (stored) {
            try { list = JSON.parse(stored); } catch (e) {}
        }
        list.unshift({ name, note, hearts: 1 });
        localStorage.setItem("event_blessings_grihith", JSON.stringify(list));
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
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =====================================================
       14. BOOTSTRAP INVITATION
       ===================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        loadEventData();
        initAmbientCanvas();
        initConfettiCanvas();
        initAudio();
    });

    // In case DOM is already loaded
    if (document.readyState === "interactive" || document.readyState === "complete") {
        loadEventData();
        initAmbientCanvas();
        initConfettiCanvas();
        initAudio();
    }

})();
