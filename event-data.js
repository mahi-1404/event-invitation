/* Edit this file (and replace files in assets/) to reuse the invitation. */
const eventData = {
    pageTitle: "You're Invited",
    opening: { line1: "YOU ARE", emphasis: "Invited", line2: "TO SOMETHING SPECIAL", openButton: "TAP TO OPEN", hint: "A little moment awaits you" },
    reveal: { eyebrow: "A LITTLE SURPRISE", title: "Something beautiful awaits", description: "Scratch the surface to reveal the special moment.", imageAlt: "Special memory", prompt: "SCRATCH HERE", promptDetail: "TO REVEAL", completeMessage: "A beautiful moment" },
    welcome: { eyebrow: "A SPECIAL DAY AWAITS", title: "With love,|we invite you", description: "Come celebrate a beautiful moment with us and be part of memories that will last forever.", namesSuffix: "together with our families", discoverButton: "DISCOVER THE INVITATION", scrollHint: "SCROLL TO EXPLORE" },
    title: { line1: "Grihith's", line2: "Second Birthday" },
    date: { day: "20", month: "SEPTEMBER", year: "2026", display: "20 September 2026", weekday: "Sunday" },
    time: "11 AM",
    timeNote: "Guests are welcome from 10:30 AM",
    venue: "Savi Events Venue",
    address: "Bangalore",
    mapLink: "https://maps.app.goo.gl/uhZoGcxJWmJQCNd98",
    names: ["Naveen", "Ramya"],
    invitation: { eyebrow: "SAVE THE DATE", description: "A beautiful day, a beautiful beginning, and the people we love most gathered together to celebrate.", eventLabel: "A SPECIAL CELEBRATION", eventName: "Grihith's Second Birthday", familyLine: "Together with our families", dayLabel: "The Day", timeLabel: "The Time", venueLabel: "The Place", detailsButton: "VIEW EVENT DETAILS", scrollHint: "KEEP SCROLLING" },
    details: { eyebrow: "THE CELEBRATION", title: "A Day To|Remember", intro: "Join us as we celebrate this beautiful occasion surrounded by the people who mean the most to us.", dateLabel: "DATE", timeLabel: "TIME", venueLabel: "VENUE", locationButton: "VIEW LOCATION", footerLeft: "WITH LOVE", footerRight: "SEE YOU THERE" },
    // This image is only used by the scratch-card reveal; it is never randomized.
    revealImage: "assets/photos/reveal.jpg",
    // Strings or { src, caption } objects are both supported.
    gallery: [
        "assets/photos/photo1.jpg",
        "assets/photos/photo3.jpg",
        "assets/photos/photo4.jpg",
        "assets/photos/photo5.jpg",
        "assets/photos/photo6.jpg",
        "assets/photos/photo7.jpg"
    ],
    // Schedule / Itinerary
    itinerary: [
        { time: "10:30 AM", title: "Welcome & Refreshments", desc: "Arrival of cherished guests and welcome drinks" },
        { time: "11:00 AM", title: "Cake Cutting & Celebration", desc: "Celebrating Grihith's milestone 2nd birthday" },
        { time: "12:30 PM", title: "Royal Feast & Lunch", desc: "A grand celebration buffet with family & friends" },
        { time: "02:00 PM", title: "Photos & Sweet Memories", desc: "Capturing smiles and heartfelt moments together" }
    ],
    // Target event date/time for the live countdown (ISO format or date string)
    countdownTarget: "2026-09-20T11:00:00",
    videos: [],
    music: { enabled: true, source: "assets/music/background.mp3" }
};
