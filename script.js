// ==========================================
// EVENT DATA
// ==========================================

function loadEventData() {
    const data = typeof eventData !== "undefined" ? eventData : {};
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value || "";
    };
    const setMany = (ids, value) => ids.forEach(id => setText(id, value));
    const opening = data.opening || {};
    const reveal = data.reveal || {};
    const welcome = data.welcome || {};
    const invitation = data.invitation || {};
    const details = data.details || {};
    const date = data.date || {};

    document.title = data.pageTitle || document.title;
    setText("pageTitle", data.pageTitle);
    setMany(["openingLine1", "letterLine1"], opening.line1);
    setMany(["openingEmphasis", "letterEmphasis"], opening.emphasis);
    setMany(["openingLine2", "letterLine2"], opening.line2);
    setText("openButtonText", opening.openButton);
    setText("openingHint", opening.hint);
    setText("revealEyebrow", reveal.eyebrow);
    setText("revealTitle", reveal.title);
    setText("revealDescription", reveal.description);
    setText("scratchPrompt", reveal.prompt);
    setText("scratchPromptDetail", reveal.promptDetail);
    setText("revealCompleteMessage", reveal.completeMessage);
    const revealImage = document.getElementById("revealImage");
    if (revealImage && data.revealImage) {
        revealImage.src = data.revealImage;
        revealImage.alt = reveal.imageAlt || "Event photograph";
    }
    setText("welcomeEyebrow", welcome.eyebrow);
    setText("welcomeDescription", welcome.description);
    setText("welcomeNamesSuffix", welcome.namesSuffix);
    setText("discoverButtonText", welcome.discoverButton);
    setText("welcomeScrollHint", welcome.scrollHint);
    const welcomeTitle = document.getElementById("welcomeTitle");
    if (welcomeTitle) welcomeTitle.innerHTML = (welcome.title || "").split("|").map(part => `<span>${part}</span>`).join("<br>");
    const names = Array.isArray(data.names) ? data.names.filter(Boolean) : [];
    setText("eventNames", names.join(" & "));
    setText("eventTitleLine1", (data.title || {}).line1);
    setText("eventTitleLine2", (data.title || {}).line2);
    setText("eventDateDay", date.day);
    setText("eventDateMonth", date.month);
    setText("eventDateYear", date.year);
    setText("invitationEyebrow", invitation.eyebrow);
    setText("invitationDescription", invitation.description);
    setText("eventLabel", invitation.eventLabel);
    setText("eventName", invitation.eventName);
    setText("familyLine", invitation.familyLine);
    setText("eventWeekday", date.weekday);
    setText("dayPreviewLabel", invitation.dayLabel);
    setMany(["eventTime", "eventDetailsTime"], data.time);
    setText("timePreviewLabel", invitation.timeLabel);
    setMany(["eventVenue", "eventDetailsVenue"], data.venue);
    setText("venuePreviewLabel", invitation.venueLabel);
    setText("detailsButtonText", invitation.detailsButton);
    setText("invitationScrollHint", invitation.scrollHint);
    setText("detailsEyebrow", details.eyebrow);
    setText("detailsIntro", details.intro);
    setText("dateDetailsLabel", details.dateLabel);
    setText("timeDetailsLabel", details.timeLabel);
    setText("venueDetailsLabel", details.venueLabel);
    setText("eventDateDisplay", date.display || [date.day, date.month, date.year].filter(Boolean).join(" "));
    setText("eventDetailsWeekday", date.weekday);
    setText("eventTimeNote", data.timeNote);
    setText("eventAddress", data.address);
    setText("locationButtonText", details.locationButton);
    setText("detailsFooterLeft", details.footerLeft);
    setText("detailsFooterRight", details.footerRight);
    const detailsTitle = document.getElementById("detailsTitle");
    if (detailsTitle) detailsTitle.innerHTML = (details.title || "").split("|").map(part => `<span>${part}</span>`).join("<br>");
    const locationButton = document.getElementById("locationButton");
    if (locationButton && !data.mapLink) locationButton.hidden = true;
    renderMedia(data);
}

function renderMedia(data) {
    const mediaRoot = document.getElementById("eventMedia");
    if (!mediaRoot) return;
    const shuffle = items => [...items].sort(() => Math.random() - 0.5);
    const makeItem = item => typeof item === "string" ? { src: item } : (item || {});
    const gallery = Array.isArray(data.gallery) ? shuffle(data.gallery).map(makeItem).filter(item => item.src) : [];
    const videos = Array.isArray(data.videos) ? data.videos.map(makeItem).filter(item => item.src) : [];
    if (!gallery.length && !videos.length) { mediaRoot.hidden = true; return; }
    mediaRoot.hidden = false;
    if (gallery.length) {
        const gallerySection = document.createElement("section");
        gallerySection.className = "media-gallery";
        gallery.forEach(item => {
            const figure = document.createElement("figure");
            const image = new Image(); image.src = item.src; image.alt = item.caption || "Event memory";
            image.addEventListener("error", () => figure.remove());
            figure.appendChild(image);
            if (item.caption) { const caption = document.createElement("figcaption"); caption.textContent = item.caption; figure.appendChild(caption); }
            gallerySection.appendChild(figure);
        });
        mediaRoot.appendChild(gallerySection);
    }
    if (videos.length) {
        const videoSection = document.createElement("section"); videoSection.className = "media-videos";
        videos.forEach(item => { const video = document.createElement("video"); video.src = item.src; video.controls = true; video.preload = "metadata"; videoSection.appendChild(video); });
        mediaRoot.appendChild(videoSection);
    }
}


// Load event information
loadEventData();
const openButton =
    document.getElementById("openInvitation");

const openingScreen =
    document.getElementById("openingScreen");

const nextSection =
    document.getElementById("revealSection");

const welcomeSection =
    document.getElementById("welcomeSection");

const discoverButton =
    document.getElementById("discoverButton");

const mainInvitation =
    document.getElementById("mainInvitation");

const detailsButton =
    document.getElementById("detailsButton");

const eventDetailsSection =
    document.getElementById("eventDetailsSection");

const locationButton =
    document.getElementById("locationButton");

const envelopeWrapper =
    document.getElementById("envelopeWrapper");

const photoReveal =
    document.getElementById("photoReveal");

const revealCover =
    document.getElementById("revealCover");

const scratchCanvas =
    document.getElementById("scratchCanvas");

const scratchContent =
    document.getElementById("scratchContent");

const scratchParticles =
    document.getElementById("scratchParticles");

const progressBar =
    document.getElementById("progressBar");

const revealComplete =
    document.getElementById("revealComplete");


/* ========================================
   ENVELOPE
======================================== */

let invitationOpened = false;

function openInvitation() {

    if (invitationOpened) {
        return;
    }

    invitationOpened = true;
    enablePageScroll();

    openingScreen.classList.add("opening");

    openButton.style.opacity = "0";

    setTimeout(() => {

        openingScreen.style.opacity = "0";

        nextSection.classList.add("active");

        /*
            Initialize scratch canvas only after
            the reveal section becomes visible.
        */

        setTimeout(() => {

            setupScratchCanvas();

        }, 100);

    }, 2200);
}


if (openButton) openButton.addEventListener("click", openInvitation);
if (envelopeWrapper) envelopeWrapper.addEventListener("click", openInvitation);


/* ========================================
   SCRATCH CARD
======================================== */

let scratchContext = null;

let canvasWidth = 0;
let canvasHeight = 0;

let isScratching = false;

let revealFinished = false;

let lastScratchX = null;
let lastScratchY = null;

let lastParticleTime = 0;

let lastProgressCheck = 0;

let currentRevealPercent = 0;


/*
    Percentage of surface that must
    be scratched before completion.
*/

const FINISH_PERCENT = 68;


/* ========================================
   SETUP CANVAS
======================================== */

function setupScratchCanvas() {

    if (!scratchCanvas) {
        return;
    }

    const rect =
        revealCover.getBoundingClientRect();

    if (
        rect.width === 0 ||
        rect.height === 0
    ) {
        return;
    }


    const devicePixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvasWidth = rect.width;

    canvasHeight = rect.height;


    scratchCanvas.width =
        Math.floor(
            canvasWidth *
            devicePixelRatio
        );


    scratchCanvas.height =
        Math.floor(
            canvasHeight *
            devicePixelRatio
        );


    scratchCanvas.style.width =
        `${canvasWidth}px`;


    scratchCanvas.style.height =
        `${canvasHeight}px`;


    scratchContext =
        scratchCanvas.getContext("2d");


    scratchContext.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    drawScratchSurface();


    currentRevealPercent = 0;

    if (progressBar) progressBar.style.width = "0%";

    revealFinished = false;

    isScratching = false;

    lastScratchX = null;

    lastScratchY = null;
}


/* ========================================
   DRAW SCRATCH SURFACE
======================================== */

function drawScratchSurface() {

    const ctx = scratchContext;

    if (!ctx) {
        return;
    }


    /*
        Main cinematic purple surface.
    */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            canvasWidth,
            canvasHeight
        );


    gradient.addColorStop(
        0,
        "#171025"
    );


    gradient.addColorStop(
        0.45,
        "#2b1738"
    );


    gradient.addColorStop(
        1,
        "#100c1c"
    );


    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /*
        Soft golden glow.
    */

    const glow =
        ctx.createRadialGradient(
            canvasWidth * 0.5,
            canvasHeight * 0.4,
            10,
            canvasWidth * 0.5,
            canvasHeight * 0.4,
            canvasWidth * 0.7
        );


    glow.addColorStop(
        0,
        "rgba(214, 174, 92, 0.20)"
    );


    glow.addColorStop(
        0.5,
        "rgba(214, 174, 92, 0.06)"
    );


    glow.addColorStop(
        1,
        "rgba(214, 174, 92, 0)"
    );


    ctx.fillStyle = glow;


    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /*
        Tiny decorative stars.
    */

    for (let i = 0; i < 80; i++) {

        const x =
            Math.random() *
            canvasWidth;

        const y =
            Math.random() *
            canvasHeight;

        const radius =
            Math.random() *
            1.2 +
            0.2;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            `rgba(255, 225, 160, ${
                Math.random() * 0.35 + 0.15
            })`;


        ctx.fill();
    }


    /*
        Subtle diagonal texture.
    */

    ctx.save();

    ctx.globalAlpha = 0.06;

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 1;


    for (
        let x = -canvasHeight;
        x < canvasWidth + canvasHeight;
        x += 18
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x + canvasHeight,
            canvasHeight
        );

        ctx.stroke();
    }


    ctx.restore();


    /*
        Elegant border.
    */

    ctx.save();

    ctx.strokeStyle =
        "rgba(232, 198, 124, 0.22)";

    ctx.lineWidth = 1;


    ctx.strokeRect(
        8,
        8,
        canvasWidth - 16,
        canvasHeight - 16
    );


    ctx.restore();
}


/* ========================================
   POINTER POSITION
======================================== */

function getPointerPosition(event) {

    const rect =
        scratchCanvas.getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };
}


/* ========================================
   START SCRATCH
======================================== */

function startScratch(event) {

    if (revealFinished) {
        return;
    }


    isScratching = true;


    scratchCanvas.setPointerCapture(
        event.pointerId
    );


    const point =
        getPointerPosition(event);


    lastScratchX = point.x;

    lastScratchY = point.y;


    /*
        Hide scratch instructions.
    */

    if (scratchContent) {

        scratchContent.style.opacity =
            "0";
    }


    scratchAt(
        point.x,
        point.y
    );


    event.preventDefault();
}


/* ========================================
   MOVE SCRATCH
======================================== */

function moveScratch(event) {

    if (
        !isScratching ||
        revealFinished
    ) {
        return;
    }


    const point =
        getPointerPosition(event);


    if (
        lastScratchX !== null &&
        lastScratchY !== null
    ) {

        scratchLine(
            lastScratchX,
            lastScratchY,
            point.x,
            point.y
        );

    } else {

        scratchAt(
            point.x,
            point.y
        );
    }


    lastScratchX = point.x;

    lastScratchY = point.y;


    createScratchParticle(
        point.x,
        point.y
    );


    updateRevealProgress();


    event.preventDefault();
}


/* ========================================
   END SCRATCH
======================================== */

function endScratch(event) {

    if (!isScratching) {
        return;
    }


    isScratching = false;

    lastScratchX = null;

    lastScratchY = null;


    updateRevealProgress(true);


    if (
        event &&
        event.pointerId !== undefined
    ) {

        try {

            scratchCanvas.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            // Pointer already released.

        }
    }
}


/* ========================================
   SCRATCH LINE
======================================== */

function scratchLine(
    startX,
    startY,
    endX,
    endY
) {

    const distance =
        Math.hypot(
            endX - startX,
            endY - startY
        );


    const stepSize = 8;


    const steps =
        Math.max(
            1,
            Math.ceil(
                distance / stepSize
            )
        );


    for (
        let i = 0;
        i <= steps;
        i++
    ) {

        const progress =
            i / steps;


        const x =
            startX +
            (endX - startX) *
            progress;


        const y =
            startY +
            (endY - startY) *
            progress;


        scratchAt(
            x,
            y
        );
    }
}


/* ========================================
   SCRATCH AT POSITION
======================================== */

function scratchAt(x, y) {

    const ctx = scratchContext;


    if (!ctx) {
        return;
    }


    const brushRadius = 27;


    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            2,
            x,
            y,
            brushRadius
        );


    gradient.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );


    gradient.addColorStop(
        0.65,
        "rgba(0,0,0,0.95)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.save();


    ctx.globalCompositeOperation =
        "destination-out";


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        brushRadius,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();
}


/* ========================================
   CALCULATE REVEAL %
======================================== */

function updateRevealProgress(
    force = false
) {

    const now =
        performance.now();


    if (
        !force &&
        now - lastProgressCheck < 150
    ) {
        return;
    }


    lastProgressCheck = now;


    const ctx =
        scratchContext;


    if (!ctx) {
        return;
    }


    const sampleStep = 12;


    const imageData =
        ctx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );


    const data =
        imageData.data;


    const scale =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    let totalSamples = 0;

    let transparentSamples = 0;


    for (
        let y = 0;
        y < scratchCanvas.height;
        y += sampleStep * scale
    ) {

        for (
            let x = 0;
            x < scratchCanvas.width;
            x += sampleStep * scale
        ) {

            const index =
                (
                    Math.floor(y) *
                    scratchCanvas.width +
                    Math.floor(x)
                ) * 4;


            const alpha =
                data[index + 3];


            totalSamples++;


            if (alpha < 100) {

                transparentSamples++;

            }
        }
    }


    if (totalSamples === 0) {
        return;
    }


    currentRevealPercent =
        (
            transparentSamples /
            totalSamples
        ) * 100;


    currentRevealPercent =
        Math.min(
            100,
            Math.max(
                0,
                currentRevealPercent
            )
        );


    if (progressBar) progressBar.style.width = `${currentRevealPercent}%`;


    if (
        currentRevealPercent >=
        FINISH_PERCENT
    ) {

        finishReveal();
    }
}


/* ========================================
   SCRATCH PARTICLES
======================================== */

function createScratchParticle(
    x,
    y
) {

    const now =
        performance.now();


    if (
        now - lastParticleTime < 80
    ) {
        return;
    }


    lastParticleTime = now;


    if (!scratchParticles) {
        return;
    }


    const particle =
        document.createElement("span");


    particle.className =
        "scratch-particle";


    const size =
        Math.random() * 5 + 2;


    particle.style.width =
        `${size}px`;


    particle.style.height =
        `${size}px`;


    particle.style.left =
        `${x}px`;


    particle.style.top =
        `${y}px`;


    particle.style.setProperty(
        "--particle-x",
        `${(Math.random() - 0.5) * 50}px`
    );


    particle.style.setProperty(
        "--particle-y",
        `${(Math.random() - 0.5) * 50}px`
    );


    scratchParticles.appendChild(
        particle
    );


    setTimeout(() => {

        particle.remove();

    }, 900);
}


/* ========================================
   COMPLETE REVEAL
======================================== */

function finishReveal() {

    if (revealFinished) {
        return;
    }


    revealFinished = true;

    isScratching = false;

    currentRevealPercent = 100;


    /*
        Complete progress bar.
    */

    if (progressBar) progressBar.style.width = "100%";


    /*
        Hide scratch instructions.
    */

    if (scratchContent) {

        scratchContent.style.opacity =
            "0";
    }


    /*
        Fade out remaining scratch surface.
    */

    scratchCanvas.style.transition =
        "opacity 0.9s ease";


    scratchCanvas.style.opacity =
        "0";


    /*
        Disable cover.
    */

    setTimeout(() => {

        revealCover.style.opacity =
            "0";

        revealCover.style.pointerEvents =
            "none";

    }, 700);


    /*
        Show completion message.
    */

    setTimeout(() => {

        if (revealComplete) revealComplete.classList.add("visible");

    }, 500);


    /*
        Cinematic image zoom.
    */

    const image =
        document.querySelector(
            ".reveal-image"
        );


    if (image) {

        image.style.transform =
            "scale(1.08)";
    }


    /* ====================================
       TRANSITION TO WELCOME
    ==================================== */

    if (welcomeSection) {

        setTimeout(() => {

            /*
                Fade the scratch section away.
            */

            nextSection.classList.remove(
                "active"
            );


            /*
                Show the welcome screen.
            */

            welcomeSection.classList.add(
                "active"
            );


            /*
                Scroll position is reset so
                the welcome section starts cleanly.
            */

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, 2200);
    }
}


/* ========================================
   POINTER EVENTS
======================================== */

if (scratchCanvas) {
    scratchCanvas.addEventListener("pointerdown", startScratch);
    scratchCanvas.addEventListener("pointermove", moveScratch);
    scratchCanvas.addEventListener("pointerup", endScratch);
    scratchCanvas.addEventListener("pointercancel", endScratch);
}


/* ========================================
   RESIZE
======================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            !revealFinished &&
            nextSection.classList.contains(
                "active"
            )
        ) {

            setupScratchCanvas();
        }
    }
);


/* ========================================
   DISCOVER INVITATION
======================================== */

if (discoverButton) {
    discoverButton.addEventListener("click", () => {

        // Hide welcome section
        welcomeSection.classList.remove("active");

        document.querySelector(".invitation").classList.add("scroll-mode")

        // Show main invitation
        mainInvitation.classList.add("active");

        // Scroll to main invitation
        setTimeout(() => {
            mainInvitation.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    });
}


/* ========================================
   EVENT DETAILS BUTTON
======================================== */

if (detailsButton) {
    detailsButton.addEventListener("click", () => {

        mainInvitation.classList.remove("active");

        eventDetailsSection.classList.add("active");

        setTimeout(() => {
            eventDetailsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    });
}

if (locationButton) {
    locationButton.addEventListener("click", () => {
        if (eventData.mapLink) window.open(eventData.mapLink, "_blank", "noopener");
    });
}

let backgroundMusic;
if (eventData.music && eventData.music.enabled && eventData.music.source) {
    backgroundMusic = new Audio(eventData.music.source);
    backgroundMusic.loop = true;
    const startMusic = () => backgroundMusic.play().catch(() => {});
    if (openButton) openButton.addEventListener("click", startMusic, { once: true });
    if (envelopeWrapper) envelopeWrapper.addEventListener("click", startMusic, { once: true });
}

/* ========================================
   INITIAL CHECK
======================================== */

if (
    nextSection.classList.contains(
        "active"
    )
) {

    setupScratchCanvas();
}

/* =========================================
   GLOBAL SCROLL ENABLE
========================================= */

function enablePageScroll() {
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
}
