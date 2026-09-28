/* =========================================================
   CHAOS.EXE
   V4 CHAOS ENGINE
   ========================================================= */


/* =========================================================
   ELEMENT HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   MAIN ELEMENTS
   ========================================================= */

const chaosButton =
    $("chaosButton");

const clickCount =
    $("clickCount");

const chaosBar =
    $("chaosBar");

const chaosPercent =
    $("chaosPercent");

const message =
    $("message");

const eventRarity =
    $("eventRarity");

const eventCount =
    $("eventCount");

const canvas =
    $("particleCanvas");

const ctx =
    canvas.getContext("2d");

const stageName =
    $("stageName");

const stageDescription =
    $("stageDescription");

const stageProgressBar =
    $("stageProgressBar");

const stageNumber =
    $("stageNumber");

const nextStage =
    $("nextStage");

const achievementPopup =
    $("achievementPopup");

const achievementName =
    $("achievementName");

const achievementCount =
    $("achievementCount");

const soundButton =
    $("soundButton");

const resetButton =
    $("resetButton");

const archiveModal =
    $("archiveModal");

const achievementModal =
    $("achievementModal");

const terminalModal =
    $("terminalModal");

const miniGameModal =
    $("miniGameModal");

const archiveGrid =
    $("archiveGrid");

const achievementGrid =
    $("achievementGrid");

const archiveCount =
    $("archiveCount");

const achievementModalCount =
    $("achievementModalCount");

const terminalOutput =
    $("terminalOutput");

const terminalForm =
    $("terminalForm");

const terminalInput =
    $("terminalInput");

const miniGameButton =
    $("miniGameButton");

const miniGameText =
    $("miniGameText");

const miniGameResult =
    $("miniGameResult");

const eventToast =
    $("eventToast");

const toastRarity =
    $("toastRarity");

const toastName =
    $("toastName");

const failureOverlay =
    $("failureOverlay");

const secretOverlay =
    $("secretOverlay");

const secretText =
    $("secretText");

const coreStatus =
    $("coreStatus");

const buttonHint =
    $("buttonHint");

const codeRain =
    $("codeRain");

const cursorGlow =
    $("cursorGlow");

const sessionTime =
    $("sessionTime");


/* =========================================================
   STORAGE
   ========================================================= */

const SAVE_KEY =
    "chaosExeSaveV4";


/* =========================================================
   GAME STATE
   ========================================================= */

const state = {

    clicks: 0,

    discoveredEvents:
        new Set(),

    unlockedAchievements:
        new Set(),

    sound: true,

    totalSessions: 1,

    returningUser: false,

    failedOnce: false,

    finalSecret: false,

    lastClickAt: 0,

    clickTimes: [],

    centerHits: 0,

    keySequence: "",

    typedWord: "",

    idleTriggered: false

};


/* =========================================================
   RUNTIME VARIABLES
   ========================================================= */

let audioContext =
    null;

let particles =
    [];

let sessionStarted =
    Date.now();

let achievementTimer =
    null;

let toastTimer =
    null;

let idleTimer =
    null;

let miniTimer =
    null;

let miniStart =
    0;

let miniReady =
    false;


/* =========================================================
   PROGRESSION STAGES
   ========================================================= */

const stages = [

    {
        min: 0,
        max: 19,
        name: "SYSTEM STABLE",
        description: "Everything appears normal.",
        next: "SYSTEM UNSTABLE"
    },

    {
        min: 20,
        max: 39,
        name: "SYSTEM UNSTABLE",
        description: "Minor anomalies detected.",
        next: "CRITICAL"
    },

    {
        min: 40,
        max: 59,
        name: "CRITICAL",
        description: "Reality integrity is decreasing.",
        next: "DANGEROUS"
    },

    {
        min: 60,
        max: 79,
        name: "DANGEROUS",
        description: "The system is fighting back.",
        next: "CHAOTIC"
    },

    {
        min: 80,
        max: 99,
        name: "CHAOTIC",
        description: "Normal behaviour is no longer guaranteed.",
        next: "SYSTEM FAILURE"
    },

    {
        min: 100,
        max: Infinity,
        name: "SYSTEM FAILURE",
        description: "You broke the experiment. It kept running.",
        next: "MAXIMUM CHAOS"
    }

];


/* =========================================================
   EVENTS
   ========================================================= */

const events = [

    {
        id: "screen-shake",
        name: "SCREEN SHAKE",
        rarity: "COMMON",
        run: screenShake
    },

    {
        id: "system-glitch",
        name: "SYSTEM GLITCH",
        rarity: "COMMON",
        run: glitchScreen
    },

    {
        id: "system-message",
        name: "SYSTEM MESSAGE",
        rarity: "COMMON",
        run: systemMessage
    },

    {
        id: "emoji-rain",
        name: "EMOJI RAIN",
        rarity: "UNCOMMON",
        run: emojiRain
    },

    {
        id: "static-burst",
        name: "STATIC BURST",
        rarity: "UNCOMMON",
        run: staticBurst
    },

    {
        id: "reverse-message",
        name: "REVERSE MESSAGE",
        rarity: "UNCOMMON",
        run: reverseMessage
    },

    {
        id: "whiteout",
        name: "WHITEOUT",
        rarity: "UNCOMMON",
        run: whiteFlash
    },

    {
        id: "core-pulse",
        name: "CORE PULSE",
        rarity: "COMMON",
        run: buttonPulse
    },

    {
        id: "message-corruption",
        name: "MESSAGE CORRUPTION",
        rarity: "RARE",
        run: messageCorruption
    },

    {
        id: "system-warning",
        name: "SYSTEM WARNING",
        rarity: "RARE",
        run: systemWarning
    },

    {
        id: "button-escape",
        name: "BUTTON ESCAPE",
        rarity: "RARE",
        unlock: 60,
        run: buttonEscape
    },

    {
        id: "overload",
        name: "OVERLOAD",
        rarity: "EPIC",
        unlock: 100,
        run: overloadEvent
    },

    {
        id: "gravity-flip",
        name: "GRAVITY FLIP",
        rarity: "RARE",
        unlock: 20,
        run: gravityFlip
    },

    {
        id: "cursor-hunt",
        name: "CURSOR HUNT",
        rarity: "UNCOMMON",
        unlock: 15,
        run: cursorHunt
    },

    {
        id: "code-rain",
        name: "CODE RAIN",
        rarity: "RARE",
        unlock: 30,
        run: codeRainEvent
    },

    {
        id: "fake-update",
        name: "FAKE UPDATE",
        rarity: "UNCOMMON",
        unlock: 10,
        run: fakeUpdate
    },

    {
        id: "core-heartbeat",
        name: "CORE HEARTBEAT",
        rarity: "COMMON",
        unlock: 5,
        run: coreHeartbeat
    },

    {
        id: "reality-fragment",
        name: "REALITY FRAGMENT",
        rarity: "EPIC",
        unlock: 75,
        run: realityFragment
    },

    {
        id: "time-slip",
        name: "TIME SLIP",
        rarity: "RARE",
        unlock: 50,
        run: timeSlip
    },

    {
        id: "panic-mode",
        name: "BUTTON PANIC",
        rarity: "EPIC",
        unlock: 5,
        run: panicMode
    },

    {
        id: "system-apology",
        name: "SYSTEM APOLOGY",
        rarity: "UNCOMMON",
        unlock: 1,
        run: systemApology
    },

    {
        id: "phantom-click",
        name: "PHANTOM CLICK",
        rarity: "RARE",
        unlock: 25,
        run: phantomClick
    },

    {
        id: "terminal-breach",
        name: "TERMINAL BREACH",
        rarity: "LEGENDARY",
        unlock: 100,
        run: terminalBreach
    },

    {
        id: "unknown",
        name: "????",
        rarity: "LEGENDARY",
        unlock: 100,
        run: unknownEvent
    },

    {
        id: "idle-entity",
        name: "YOU FINALLY STOPPED",
        rarity: "SECRET",
        secret: true,
        run: idleEntity
    }

];


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

const achievements = [

    {
        id: "first",
        name: "FIRST CONTACT",
        description: "Press the button once.",
        condition: () =>
            state.clicks >= 1
    },

    {
        id: "ten",
        name: "BUTTON ADDICT",
        description: "Reach 10 clicks.",
        condition: () =>
            state.clicks >= 10
    },

    {
        id: "twentyfive",
        name: "NO SELF CONTROL",
        description: "Reach 25 clicks.",
        condition: () =>
            state.clicks >= 25
    },

    {
        id: "fifty",
        name: "HALF WAY TO HELL",
        description: "Reach 50 clicks.",
        condition: () =>
            state.clicks >= 50
    },

    {
        id: "hundred",
        name: "SYSTEM BREAKER",
        description: "Reach 100 clicks.",
        condition: () =>
            state.clicks >= 100
    },

    {
        id: "events5",
        name: "ANOMALY HUNTER",
        description: "Discover 5 different events.",
        condition: () =>
            state.discoveredEvents.size >= 5
    },

    {
        id: "events10",
        name: "CHAOS RESEARCHER",
        description: "Discover 10 different events.",
        condition: () =>
            state.discoveredEvents.size >= 10
    },

    {
        id: "allEvents",
        name: "THEY SHOULD NOT ALL EXIST",
        description: "Discover all 24 main events.",
        condition: () =>
            getMainEvents()
                .every(event =>
                    state.discoveredEvents.has(event.id)
                )
    },

    {
        id: "rapid",
        name: "PANIC BUTTON",
        description: "Trigger BUTTON PANIC.",
        condition: () =>
            state.discoveredEvents.has("panic-mode")
    },

    {
        id: "precision",
        name: "SURGICAL PRECISION",
        description: "Hit the exact center of the button.",
        condition: () =>
            state.centerHits > 0
    },

    {
        id: "keyboard",
        name: "KEYBOARD GHOST",
        description: "Find the hidden keyboard access.",
        condition: () =>
            state.discoveredEvents.has("keyboard-secret")
    },

    {
        id: "konami",
        name: "OLD SCHOOL",
        description: "Enter the secret sequence.",
        condition: () =>
            state.discoveredEvents.has("konami-secret")
    }

];


/* =========================================================
   NORMAL MESSAGES
   ========================================================= */

const normalMessages = [

    "Don't you dare.",

    "You pressed it.",

    "The system noticed.",

    "Interesting choice.",

    "Something changed.",

    "That was unnecessary.",

    "CHAOS INCREASING.",

    "System instability detected.",

    "You are making this worse.",

    "There is no going back.",

    "The button remembers.",

    "This was a terrible idea.",

    "Why are you still pressing it?",

    "Reality.exe is becoming unstable.",

    "I was specifically told not to let you do that."

];


/* =========================================================
   SAVE GAME
   ========================================================= */

function save() {

    const data = {

        clicks:
            state.clicks,

        events:
            [...state.discoveredEvents],

        achievements:
            [...state.unlockedAchievements],

        sound:
            state.sound,

        totalSessions:
            state.totalSessions,

        failedOnce:
            state.failedOnce,

        finalSecret:
            state.finalSecret,

        centerHits:
            state.centerHits

    };


    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   LOAD GAME
   ========================================================= */

function loadSave() {

    const raw =
        localStorage.getItem(SAVE_KEY);


    if (!raw) {

        return;

    }


    try {

        const data =
            JSON.parse(raw);


        state.clicks =
            Number(data.clicks) || 0;


        state.discoveredEvents =
            new Set(
                Array.isArray(data.events)
                    ? data.events
                    : []
            );


        state.unlockedAchievements =
            new Set(
                Array.isArray(data.achievements)
                    ? data.achievements
                    : []
            );


        state.sound =
            data.sound !== false;


        state.totalSessions =
            (Number(data.totalSessions) || 1) + 1;


        state.returningUser =
            true;


        state.failedOnce =
            Boolean(data.failedOnce);


        state.finalSecret =
            Boolean(data.finalSecret);


        state.centerHits =
            Number(data.centerHits) || 0;

    }

    catch (error) {

        console.error(
            "CHAOS save corrupted:",
            error
        );

        localStorage.removeItem(
            SAVE_KEY
        );

    }

}


/* =========================================================
   AUDIO ENGINE
   ========================================================= */

function initAudio() {

    if (!state.sound) {

        return null;

    }


    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            return null;

        }


        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    return audioContext;

}


function tone(
    frequency,
    duration = 0.08,
    type = "sine",
    volume = 0.035
) {

    const audio =
        initAudio();


    if (!audio) {

        return;

    }


    const oscillator =
        audio.createOscillator();


    const gain =
        audio.createGain();


    oscillator.type =
        type;


    oscillator.frequency.setValueAtTime(
        frequency,
        audio.currentTime
    );


    gain.gain.setValueAtTime(
        volume,
        audio.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );


    oscillator.start();


    oscillator.stop(
        audio.currentTime + duration
    );

}


function playClick() {

    tone(
        140 + Math.min(state.clicks, 80) * 3,
        0.06,
        "square",
        0.025
    );

}


function playAchievement() {

    tone(
        520,
        0.08,
        "sine",
        0.035
    );


    setTimeout(() => {

        tone(
            780,
            0.12,
            "sine",
            0.04
        );

    }, 70);

}


function playGlitch() {

    tone(
        80,
        0.08,
        "sawtooth",
        0.025
    );


    setTimeout(() => {

        tone(
            45,
            0.12,
            "square",
            0.018
        );

    }, 50);

}


function playSecret() {

    tone(
        260,
        0.1,
        "triangle",
        0.035
    );


    setTimeout(() => {

        tone(
            390,
            0.1,
            "triangle",
            0.04
        );

    }, 100);


    setTimeout(() => {

        tone(
            780,
            0.2,
            "triangle",
            0.04
        );

    }, 200);

}


/* =========================================================
   CANVAS
   ========================================================= */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(
            window.innerWidth * dpr
        );


    canvas.height =
        Math.floor(
            window.innerHeight * dpr
        );


    canvas.style.width =
        `${window.innerWidth}px`;


    canvas.style.height =
        `${window.innerHeight}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles(
    x,
    y,
    amount = 55
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            Math.random() * 8 + 2;


        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                Math.random() * 3 + 1,

            life:
                1

        });

    }

}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    particles.forEach(
        (particle, index) => {

            particle.x +=
                particle.vx;


            particle.y +=
                particle.vy;


            particle.vy +=
                0.08;


            particle.life -=
                0.025;


            ctx.beginPath();


            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    100,
                    190,
                    255,
                    ${Math.max(
                        particle.life,
                        0
                    )}
                )`;


            ctx.shadowBlur =
                12;


            ctx.shadowColor =
                "#238cff";


            ctx.fill();


            ctx.shadowBlur =
                0;


            if (
                particle.life <= 0
            ) {

                particles.splice(
                    index,
                    1
                );

            }

        }
    );


    requestAnimationFrame(
        animateParticles
    );

}


/* =========================================================
   STAGES
   ========================================================= */

function getStage() {

    return [

        ...stages

    ]
        .reverse()
        .find(
            stage =>
                state.clicks >=
                stage.min
        ) || stages[0];

}


function updateStage() {

    const current =
        getStage();


    const index =
        stages.indexOf(
            current
        );


    stageName.textContent =
        current.name;


    stageDescription.textContent =
        current.description;


    stageNumber.textContent =
        `STAGE ${index + 1} / ${stages.length}`;


    nextStage.textContent =
        `NEXT: ${current.next}`;


    if (
        state.clicks >= 100
    ) {

        stageProgressBar.style.width =
            "100%";


        document.body.classList.add(
            "overload"
        );

    }

    else {

        const start =
            current.min;


        const end =
            current.max + 1;


        const progress =
            (
                (state.clicks - start) /
                (end - start)
            ) * 100;


        stageProgressBar.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            )}%`;

    }

}


/* =========================================================
   UI UPDATE
   ========================================================= */

function updateUI() {

    const chaos =
        Math.min(
            state.clicks * 5,
            100
        );


    clickCount.textContent =
        state.clicks;


    chaosBar.style.width =
        `${chaos}%`;


    chaosPercent.textContent =
        `${chaos}%`;


    eventCount.textContent =
        `${getMainDiscoveredCount()}/24`;


    achievementCount.textContent =
        `${state.unlockedAchievements.size}/12`;


    updateStage();


    renderArchive();


    renderAchievements();


    updateButtonHint();

}


/* =========================================================
   BUTTON HINT
   ========================================================= */

function updateButtonHint() {

    if (
        state.clicks === 0
    ) {

        buttonHint.textContent =
            "DO IT.";

    }

    else if (
        state.clicks < 20
    ) {

        buttonHint.textContent =
            "AGAIN?";

    }

    else if (
        state.clicks < 60
    ) {

        buttonHint.textContent =
            "YOU KNOW BETTER.";

    }

    else {

        buttonHint.textContent =
            "NO ESCAPE.";

    }

}


/* =========================================================
   MESSAGES
   ========================================================= */

function showMessage(
    text,
    rarity = "COMMON"
) {

    message.style.opacity =
        "0";


    setTimeout(() => {

        message.textContent =
            text;


        message.style.opacity =
            "1";

    }, 80);


    eventRarity.textContent =
        rarity;

}


/* =========================================================
   EVENT HELPERS
   ========================================================= */

function getEvent(id) {

    return events.find(
        event =>
            event.id === id
    );

}


function getMainEvents() {

    return events.filter(
        event =>
            !event.secret
    );

}


function getMainDiscoveredCount() {

    return getMainEvents()
        .filter(
            event =>
                state.discoveredEvents.has(
                    event.id
                )
        )
        .length;

}


/* =========================================================
   REGISTER EVENT
   ========================================================= */

function registerEvent(
    id,
    customName = null,
    customRarity = null
) {

    if (
        state.discoveredEvents.has(id)
    ) {

        return;

    }


    state.discoveredEvents.add(
        id
    );


    const event =
        getEvent(id);


    showEventToast(

        customName ||
        event?.name ||
        id,

        customRarity ||
        event?.rarity ||
        "SECRET"

    );


    checkAchievements();

    save();

    updateUI();

}


/* =========================================================
   EVENT TOAST
   ========================================================= */

function showEventToast(
    name,
    rarity
) {

    toastName.textContent =
        name;


    toastRarity.textContent =
        rarity;


    eventToast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            eventToast.classList.remove(
                "show"
            );

        }, 2200);

}


/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

function unlockAchievement(
    achievement
) {

    if (
        state.unlockedAchievements.has(
            achievement.id
        )
    ) {

        return;

    }


    state.unlockedAchievements.add(
        achievement.id
    );


    achievementName.textContent =
        achievement.name;


    achievementPopup.classList.add(
        "show"
    );


    playAchievement();


    clearTimeout(
        achievementTimer
    );


    achievementTimer =
        setTimeout(() => {

            achievementPopup.classList.remove(
                "show"
            );

        }, 3600);


    save();

    updateUI();

}


function checkAchievements() {

    achievements.forEach(
        achievement => {

            if (
                achievement.condition()
            ) {

                unlockAchievement(
                    achievement
                );

            }

        }
    );

}


/* =========================================================
   EVENT 1
   SCREEN SHAKE
   ========================================================= */

function screenShake() {

    registerEvent(
        "screen-shake"
    );


    document.body.classList.remove(
        "shake"
    );


    void document.body.offsetWidth;


    document.body.classList.add(
        "shake"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "shake"
        );

    }, 360);

}


/* =========================================================
   EVENT 2
   SYSTEM GLITCH
   ========================================================= */

function glitchScreen() {

    registerEvent(
        "system-glitch"
    );


    document.body.classList.add(
        "glitch"
    );


    showMessage(
        "REALITY.EXE HAS STOPPED RESPONDING",
        "COMMON"
    );


    playGlitch();


    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );

    }, 420);

}


/* =========================================================
   EVENT 3
   SYSTEM MESSAGE
   ========================================================= */

function systemMessage() {

    registerEvent(
        "system-message"
    );


    const lines = [

        "WHY DID YOU WAKE ME UP?",

        "USER BEHAVIOUR: CONCERNING.",

        "PROCESSING CHAOS...",

        "YOU HAVE BEEN OBSERVED.",

        "STOP PRESSING THE BUTTON.",

        "I SAID STOP.",

        "..."

    ];


    showMessage(

        lines[
            Math.floor(
                Math.random() *
                lines.length
            )
        ],

        "COMMON"

    );

}


/* =========================================================
   EVENT 4
   EMOJI RAIN
   ========================================================= */

function emojiRain() {

    registerEvent(
        "emoji-rain"
    );


    const emojis = [

        "⚡",
        "💀",
        "🔥",
        "👀",
        "🌀",
        "💥",
        "🤖"

    ];


    for (
        let i = 0;
        i < 26;
        i++
    ) {

        const emoji =
            document.createElement(
                "div"
            );


        emoji.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        emoji.style.position =
            "fixed";


        emoji.style.left =
            `${Math.random() * 100}%`;


        emoji.style.top =
            "-50px";


        emoji.style.fontSize =
            `${Math.random() * 25 + 20}px`;


        emoji.style.zIndex =
            "30";


        emoji.style.pointerEvents =
            "none";


        document.body.appendChild(
            emoji
        );


        const duration =
            Math.random() * 2 + 2;


        emoji.animate(

            [

                {
                    transform:
                        "translateY(0) rotate(0deg)"
                },

                {
                    transform:
                        `translateY(
                            ${window.innerHeight + 100}px
                        )
                        rotate(720deg)`
                }

            ],

            {

                duration:
                    duration * 1000,

                easing:
                    "ease-in"

            }

        );


        setTimeout(() => {

            emoji.remove();

        }, duration * 1000);

    }

}


/* =========================================================
   EVENT 5
   STATIC BURST
   ========================================================= */

function staticBurst() {

    registerEvent(
        "static-burst"
    );


    showMessage(
        "SIGNAL CORRUPTION DETECTED",
        "UNCOMMON"
    );


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        setTimeout(
            glitchScreen,
            i * 120
        );

    }

}


/* =========================================================
   EVENT 6
   REVERSE MESSAGE
   ========================================================= */

function reverseMessage() {

    registerEvent(
        "reverse-message"
    );


    const text =
        "YOU SHOULD NOT HAVE PRESSED THAT";


    showMessage(
        text
            .split("")
            .reverse()
            .join(""),
        "UNCOMMON"
    );

}


/* =========================================================
   EVENT 7
   WHITEOUT
   ========================================================= */

function whiteFlash() {

    registerEvent(
        "whiteout"
    );


    const flash =
        document.createElement(
            "div"
        );


    flash.style.cssText = `

        position: fixed;

        inset: 0;

        background: white;

        z-index: 99;

        pointer-events: none;

    `;


    document.body.appendChild(
        flash
    );


    flash.animate(

        [

            {
                opacity: 0
            },

            {
                opacity: 0.85
            },

            {
                opacity: 0
            }

        ],

        {
            duration: 420
        }

    );


    setTimeout(() => {

        flash.remove();

    }, 420);

}


/* =========================================================
   EVENT 8
   CORE PULSE
   ========================================================= */

function buttonPulse() {

    registerEvent(
        "core-pulse"
    );


    chaosButton.animate(

        [

            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.25)"
            },

            {
                transform:
                    "scale(0.92)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],

        {

            duration:
                600,

            easing:
                "ease-out"

        }

    );


    showMessage(
        "CORE ENERGY SPIKE DETECTED",
        "COMMON"
    );

}


/* =========================================================
   EVENT 9
   MESSAGE CORRUPTION
   ========================================================= */

function messageCorruption() {

    registerEvent(
        "message-corruption"
    );


    const chars =
        "!@#$%^&*01ZX?";


    let corrupted =
        "";


    for (
        let i = 0;
        i < 30;
        i++
    ) {

        corrupted +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }


    showMessage(
        corrupted,
        "RARE"
    );

}


/* =========================================================
   EVENT 10
   SYSTEM WARNING
   ========================================================= */

function systemWarning() {

    registerEvent(
        "system-warning"
    );


    showMessage(
        "⚠ USER ACTIVITY EXCEEDS SAFE LIMITS ⚠",
        "RARE"
    );


    screenShake();

}


/* =========================================================
   EVENT 11
   BUTTON ESCAPE
   ========================================================= */

function buttonEscape() {

    registerEvent(
        "button-escape"
    );


    showMessage(
        "THE BUTTON IS RUNNING AWAY.",
        "RARE"
    );


    const x =
        (
            Math.random() - 0.5
        ) *
        Math.min(
            420,
            window.innerWidth * 0.65
        );


    const y =
        (
            Math.random() - 0.5
        ) *
        Math.min(
            280,
            window.innerHeight * 0.35
        );


    chaosButton.style.transform =
        `translate(${x}px, ${y}px)`;


    setTimeout(() => {

        chaosButton.style.transform =
            "";

    }, 900);

}


/* =========================================================
   EVENT 12
   OVERLOAD
   ========================================================= */

function overloadEvent() {

    registerEvent(
        "overload"
    );


    showMessage(
        "⚠ SYSTEM OVERLOAD ⚠",
        "EPIC"
    );


    screenShake();


    glitchScreen();


    createParticles(

        window.innerWidth / 2,

        window.innerHeight / 2,

        120

    );


    if (
        !state.failedOnce
    ) {

        state.failedOnce =
            true;


        failureOverlay.classList.add(
            "show"
        );


        setTimeout(() => {

            failureOverlay.classList.remove(
                "show"
            );

        }, 3600);

    }

}


/* =========================================================
   EVENT 13
   GRAVITY FLIP
   ========================================================= */

function gravityFlip() {

    registerEvent(
        "gravity-flip"
    );


    showMessage(
        "GRAVITY HAS BEEN REASSIGNED.",
        "RARE"
    );


    document.body.animate(

        [

            {
                transform:
                    "rotate(0deg)"
            },

            {
                transform:
                    "rotate(1deg)"
            },

            {
                transform:
                    "rotate(-1deg)"
            },

            {
                transform:
                    "rotate(0deg)"
            }

        ],

        {

            duration:
                800

        }

    );

}


/* =========================================================
   EVENT 14
   CURSOR HUNT
   ========================================================= */

function cursorHunt() {

    registerEvent(
        "cursor-hunt"
    );


    showMessage(
        "THE CURSOR IS BEING TRACKED.",
        "UNCOMMON"
    );


    cursorGlow.animate(

        [

            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(2.5)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            }

        ],

        {

            duration:
                900

        }

    );

}


/* =========================================================
   EVENT 15
   CODE RAIN
   ========================================================= */

function codeRainEvent() {

    registerEvent(
        "code-rain"
    );


    showMessage(
        "THE SOURCE CODE IS LEAKING.",
        "RARE"
    );


    codeRain.classList.add(
        "active"
    );


    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const column =
            document.createElement(
                "div"
            );


        column.className =
            "codeColumn";


        column.style.left =
            `${Math.random() * 100}%`;


        column.style.animationDuration =
            `${Math.random() * 3 + 2}s`;


        const chars =
            "01<>[]{}#$%";


        let text =
            "";


        for (
            let j = 0;
            j < 30;
            j++
        ) {

            text +=
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ];

        }


        column.textContent =
            text;


        codeRain.appendChild(
            column
        );


        setTimeout(() => {

            column.remove();

        }, 5200);

    }


    setTimeout(() => {

        codeRain.classList.remove(
            "active"
        );

    }, 5200);

}


/* =========================================================
   EVENT 16
   FAKE UPDATE
   ========================================================= */

function fakeUpdate() {

    registerEvent(
        "fake-update"
    );


    showMessage(
        "INSTALLING USER PATCH... 7%",
        "UNCOMMON"
    );


    let progress =
        7;


    const timer =
        setInterval(() => {

            progress +=
                Math.floor(
                    Math.random() * 25
                );


            if (
                progress >= 100
            ) {

                clearInterval(
                    timer
                );


                showMessage(
                    "UPDATE FAILED. USER IS THE BUG.",
                    "UNCOMMON"
                );

            }

            else {

                showMessage(
                    `INSTALLING USER PATCH... ${progress}%`,
                    "UNCOMMON"
                );

            }

        }, 180);

}


/* =========================================================
   EVENT 17
   CORE HEARTBEAT
   ========================================================= */

function coreHeartbeat() {

    registerEvent(
        "core-heartbeat"
    );


    showMessage(
        "CORE HEARTBEAT DETECTED.",
        "COMMON"
    );


    tone(
        75,
        0.18,
        "sine",
        0.04
    );


    setTimeout(() => {

        tone(
            75,
            0.18,
            "sine",
            0.04
        );

    }, 260);

}


/* =========================================================
   EVENT 18
   REALITY FRAGMENT
   ========================================================= */

function realityFragment() {

    registerEvent(
        "reality-fragment"
    );


    showMessage(
        "REALITY FRAGMENT #7 HAS ESCAPED.",
        "EPIC"
    );


    document.body.classList.add(
        "glitch"
    );


    createParticles(

        Math.random() *
            window.innerWidth,

        Math.random() *
            window.innerHeight,

        90

    );


    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );

    }, 650);

}


/* =========================================================
   EVENT 19
   TIME SLIP
   ========================================================= */

function timeSlip() {

    registerEvent(
        "time-slip"
    );


    showMessage(
        "THAT CLICK HAPPENED TWICE.",
        "RARE"
    );


    clickCount.animate(

        [

            {
                transform:
                    "translateX(0)"
            },

            {
                transform:
                    "translateX(8px)"
            },

            {
                transform:
                    "translateX(0)"
            }

        ],

        {

            duration:
                300

        }

    );

}


/* =========================================================
   EVENT 20
   BUTTON PANIC
   ========================================================= */

function panicMode() {

    registerEvent(
        "panic-mode"
    );


    showMessage(
        "BUTTON PANIC. BUTTON PANIC. BUTTON PANIC.",
        "EPIC"
    );


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        setTimeout(() => {

            chaosButton.style.transform =

                `translate(
                    ${(Math.random() - 0.5) * 180}px,
                    ${(Math.random() - 0.5) * 120}px
                )`;

        }, i * 90);

    }


    setTimeout(() => {

        chaosButton.style.transform =
            "";

    }, 600);


    screenShake();

}


/* =========================================================
   EVENT 21
   SYSTEM APOLOGY
   ========================================================= */

function systemApology() {

    registerEvent(
        "system-apology"
    );


    showMessage(
        "I'M SORRY. PLEASE CONTINUE.",
        "UNCOMMON"
    );

}


/* =========================================================
   EVENT 22
   PHANTOM CLICK
   ========================================================= */

function phantomClick() {

    registerEvent(
        "phantom-click"
    );


    showMessage(
        "A CLICK WAS DETECTED THAT YOU DID NOT MAKE.",
        "RARE"
    );


    createParticles(

        Math.random() *
            window.innerWidth,

        Math.random() *
            window.innerHeight,

        35

    );

}


/* =========================================================
   EVENT 23
   TERMINAL BREACH
   ========================================================= */

function terminalBreach() {

    registerEvent(
        "terminal-breach"
    );


    showMessage(
        "TERMINAL SECURITY: ABSOLUTELY NOT.",
        "LEGENDARY"
    );


    terminalPrint(
        "[BREACH] CORE ACCESS GRANTED."
    );


    playSecret();

}


/* =========================================================
   EVENT 24
   UNKNOWN
   ========================================================= */

function unknownEvent() {

    registerEvent(
        "unknown"
    );


    showMessage(
        "????",
        "LEGENDARY"
    );


    showSecret(
        "????"
    );


    if (
        !state.finalSecret &&
        state.clicks >= 111
    ) {

        setTimeout(
            finalSecret,
            1600
        );

    }

}


/* =========================================================
   SECRET EVENT
   IDLE
   ========================================================= */

function idleEntity() {

    if (
        state.idleTriggered
    ) {

        return;

    }


    state.idleTriggered =
        true;


    registerEvent(
        "idle-entity",
        "YOU FINALLY STOPPED",
        "SECRET"
    );


    showMessage(
        "YOU FINALLY STOPPED.",
        "SECRET"
    );


    secretOverlay.classList.add(
        "show"
    );


    secretText.textContent =
        "WE WERE WAITING.";


    playSecret();


    setTimeout(() => {

        secretOverlay.classList.remove(
            "show"
        );

    }, 1800);

}


/* =========================================================
   FINAL SECRET
   ========================================================= */

function finalSecret() {

    if (
        state.finalSecret
    ) {

        return;

    }


    state.finalSecret =
        true;


    registerEvent(
        "final-secret",
        "THE LAST THING",
        "SECRET"
    );


    save();


    secretOverlay.classList.add(
        "show"
    );


    secretText.textContent =
        "YOU FOUND THE END.";


    playSecret();


    setTimeout(() => {

        secretText.textContent =
            "THERE IS NO END.";

    }, 900);


    setTimeout(() => {

        secretOverlay.classList.remove(
            "show"
        );

    }, 2400);

}


/* =========================================================
   EVENT SELECTION
   ========================================================= */

function availableEvents() {

    return getMainEvents().filter(
        event => {

            return (
                state.clicks >=
                (event.unlock || 0)
            );

        }
    );

}


function chooseEvent() {

    const pool =
        availableEvents();


    if (
        !pool.length
    ) {

        return;

    }


    const weights = {

        COMMON: 7,

        UNCOMMON: 4,

        RARE: 2.5,

        EPIC: 1.2,

        LEGENDARY: 0.45

    };


    const weighted =
        [];


    pool.forEach(
        event => {

            const weight =
                weights[event.rarity] ||
                1;


            for (
                let i = 0;
                i < Math.max(
                    1,
                    Math.round(
                        weight * 10
                    )
                );
                i++
            ) {

                weighted.push(
                    event
                );

            }

        }
    );


    const selected =
        weighted[
            Math.floor(
                Math.random() *
                weighted.length
            )
        ];


    selected.run();

}


/* =========================================================
   CHAOS ENGINE
   ========================================================= */

function chaosEngine() {

    /* 13TH CLICK SECRET */

    if (
        state.clicks === 13
    ) {

        showSecret(
            "13 IS WATCHING"
        );


        registerEvent(
            "thirteen-secret",
            "13 IS WATCHING",
            "SECRET"
        );


        return;

    }


    /* 100+ CLICK SECRET */

    if (
        state.clicks >= 100 &&
        Math.random() < 0.16
    ) {

        unknownEvent();

        return;

    }


    chooseEvent();

}


/* =========================================================
   RAPID CLICK DETECTOR
   ========================================================= */

function detectRapidClick() {

    const now =
        performance.now();


    state.clickTimes.push(
        now
    );


    state.clickTimes =
        state.clickTimes.filter(
            time =>
                now - time < 1200
        );


    if (
        state.clickTimes.length >= 5
    ) {

        panicMode();


        state.clickTimes =
            [];

    }

}


/* =========================================================
   PRECISION CLICK
   ========================================================= */

function detectPrecision(
    event
) {

    const rect =
        chaosButton.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    const centerX =
        rect.width / 2;


    const centerY =
        rect.height / 2;


    const distance =
        Math.hypot(
            x - centerX,
            y - centerY
        );


    if (
        distance <=
        Math.min(
            rect.width,
            rect.height
        ) * 0.06
    ) {

        state.centerHits++;


        registerEvent(
            "precision-secret",
            "PRECISION DETECTED",
            "SECRET"
        );


        showMessage(
            "PRECISION DETECTED. THAT WAS SUSPICIOUS.",
            "SECRET"
        );


        checkAchievements();

    }

}


/* =========================================================
   SECRET OVERLAY
   ========================================================= */

function showSecret(
    text
) {

    secretOverlay.classList.add(
        "show"
    );


    secretText.textContent =
        text;


    playSecret();


    setTimeout(() => {

        secretOverlay.classList.remove(
            "show"
        );

    }, 1200);

}


/* =========================================================
   IDLE SYSTEM
   ========================================================= */

function resetIdleTimer() {

    clearTimeout(
        idleTimer
    );


    idleTimer =
        setTimeout(() => {

            if (
                state.clicks > 0
            ) {

                idleEntity();

            }

        }, 15000);

}


/* =========================================================
   MAIN CLICK HANDLER
   ========================================================= */

function handleClick(
    event
) {

    initAudio();


    state.clicks++;


    state.lastClickAt =
        performance.now();


    resetIdleTimer();


    detectRapidClick();


    detectPrecision(
        event
    );


    playClick();


    showMessage(

        normalMessages[
            Math.floor(
                Math.random() *
                normalMessages.length
            )
        ],

        "COMMON"

    );


    const rect =
        chaosButton.getBoundingClientRect();


    createParticles(

        rect.left +
            rect.width / 2,

        rect.top +
            rect.height / 2

    );


    chaosEngine();


    updateUI();


    checkAchievements();


    save();

}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(
    modal
) {

    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (
        modal === terminalModal
    ) {

        setTimeout(() => {

            terminalInput.focus();

        }, 50);

    }

}


function closeModal(
    modal
) {

    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   ARCHIVE RENDER
   ========================================================= */

function renderArchive() {

    const mainEvents =
        getMainEvents();


    archiveGrid.innerHTML =
        mainEvents.map(
            (event, index) => {

                const unlocked =
                    state.discoveredEvents.has(
                        event.id
                    );


                return `

                    <div
                        class="archiveItem
                        ${unlocked ? "unlocked" : "locked"}"
                    >

                        <strong>

                            ${
                                unlocked
                                    ? event.name
                                    : `ANOMALY
                                       ${String(index + 1)
                                           .padStart(2, "0")}
                                       • ?????`
                            }

                        </strong>


                        <p>

                            ${
                                unlocked
                                    ? `${event.rarity} EVENT`
                                    : "DATA CORRUPTED"
                            }

                        </p>

                    </div>

                `;

            }
        )
        .join("");


    archiveCount.textContent =
        getMainDiscoveredCount();

}


/* =========================================================
   ACHIEVEMENT RENDER
   ========================================================= */

function renderAchievements() {

    achievementGrid.innerHTML =
        achievements.map(
            achievement => {

                const unlocked =
                    state.unlockedAchievements.has(
                        achievement.id
                    );


                return `

                    <div
                        class="achievementItem
                        ${unlocked ? "unlocked" : "locked"}"
                    >

                        <strong>

                            ${
                                unlocked
                                    ? "🏆 " +
                                      achievement.name
                                    : "🔒 CLASSIFIED"
                            }

                        </strong>


                        <p>

                            ${
                                unlocked
                                    ? achievement.description
                                    : "Complete the hidden requirement."
                            }

                        </p>

                    </div>

                `;

            }
        )
        .join("");


    achievementModalCount.textContent =
        state.unlockedAchievements.size;

}


/* =========================================================
   TERMINAL
   ========================================================= */

function terminalPrint(
    text
) {

    const line =
        document.createElement(
            "div"
        );


    line.className =
        "terminalLine";


    line.textContent =
        text;


    terminalOutput.appendChild(
        line
    );


    terminalOutput.scrollTop =
        terminalOutput.scrollHeight;

}


/* =========================================================
   TERMINAL COMMANDS
   ========================================================= */

function terminalCommand(
    raw
) {

    const command =
        raw.trim().toLowerCase();


    if (!command) {

        return;

    }


    terminalPrint(
        `> ${raw}`
    );


    if (
        command === "help"
    ) {

        terminalPrint(
            "commands: help, status, scan, events, achievements, clear, ping, launch, chaos, ????"
        );

    }


    else if (
        command === "status"
    ) {

        terminalPrint(
            `CORE: ${
                state.clicks >= 100
                    ? "FAILED/ACTIVE"
                    : "ONLINE"
            }`
        );


        terminalPrint(
            `CLICKS: ${state.clicks}`
        );


        terminalPrint(
            `CHAOS: ${
                Math.min(
                    state.clicks * 5,
                    100
                )
            }%`
        );


        terminalPrint(
            `EVENTS: ${
                getMainDiscoveredCount()
            }/24`
        );

    }


    else if (
        command === "scan"
    ) {

        terminalPrint(
            "Scanning reality..."
        );


        setTimeout(() => {

            terminalPrint(
                "Reality: 63% intact."
            );

        }, 350);


        setTimeout(() => {

            terminalPrint(
                "User: still pressing button."
            );

        }, 700);

    }


    else if (
        command === "events"
    ) {

        terminalPrint(

            [
                ...state.discoveredEvents

            ].join(", ") ||

            "No anomalies recovered."

        );

    }


    else if (
        command === "achievements"
    ) {

        terminalPrint(
            `${state.unlockedAchievements.size}/12 achievements unlocked.`
        );

    }


    else if (
        command === "clear"
    ) {

        terminalOutput.innerHTML =
            "";

    }


    else if (
        command === "ping"
    ) {

        terminalPrint(
            "PONG. WHY?"
        );


        tone(
            660,
            0.08,
            "square",
            0.025
        );

    }


    else if (
        command === "launch"
    ) {

        terminalPrint(
            "Launching emergency protocol..."
        );


        setTimeout(
            openMiniGame,
            450
        );

    }


    else if (
        command === "chaos"
    ) {

        registerEvent(
            "keyboard-secret",
            "ACCESS GRANTED",
            "SECRET"
        );


        showSecret(
            "ACCESS GRANTED"
        );

    }


    else if (
        command === "????"
    ) {

        registerEvent(
            "terminal-question",
            "TERMINAL QUESTION",
            "SECRET"
        );


        showSecret(
            "YOU ASKED THE WRONG QUESTION"
        );

    }


    else {

        terminalPrint(
            "UNKNOWN COMMAND. THE TERMINAL JUDGES YOU."
        );

    }

}


/* =========================================================
   REACTION MINI GAME
   ========================================================= */

function openMiniGame() {

    openModal(
        miniGameModal
    );


    miniGameResult.textContent =
        "";


    miniGameText.textContent =
        "Wait for the core to turn green, then click it.";


    miniGameButton.classList.remove(
        "ready"
    );


    miniGameButton.textContent =
        "WAIT...";


    miniReady =
        false;


    clearTimeout(
        miniTimer
    );


    const delay =
        Math.random() *
        2400 +
        900;


    miniTimer =
        setTimeout(() => {

            miniReady =
                true;


            miniStart =
                performance.now();


            miniGameButton.classList.add(
                "ready"
            );


            miniGameButton.textContent =
                "CLICK!";

        }, delay);

}


/* =========================================================
   MINI GAME CLICK
   ========================================================= */

function miniGameClick() {

    if (
        !miniReady
    ) {

        miniGameResult.textContent =
            "TOO EARLY. CHAOS REJECTS YOUR REFLEXES.";


        tone(
            90,
            0.1,
            "square",
            0.03
        );


        clearTimeout(
            miniTimer
        );


        miniReady =
            false;


        miniGameButton.classList.remove(
            "ready"
        );


        miniGameButton.textContent =
            "WAIT...";


        setTimeout(
            openMiniGame,
            800
        );


        return;

    }


    const reaction =
        Math.round(
            performance.now() -
            miniStart
        );


    miniGameResult.textContent =

        `${reaction} ms. ` +

        (
            reaction < 250

                ? "DISGUSTINGLY FAST."

                : reaction < 450

                    ? "ACCEPTABLE."

                    : "THE BUTTON IS DISAPPOINTED."
        );


    miniReady =
        false;


    miniGameButton.classList.remove(
        "ready"
    );


    miniGameButton.textContent =
        "DONE";


    registerEvent(
        "reaction-test",
        "REACTION TEST",
        "SECRET"
    );

}


/* =========================================================
   KEYBOARD SECRETS
   ========================================================= */

function handleKeyboard(
    event
) {

    const key =
        event.key.toLowerCase();


    /* =====================================================
       KONAMI CODE
    ===================================================== */

    const konamiKeys = [

        "arrowup",

        "arrowup",

        "arrowdown",

        "arrowdown",

        "arrowleft",

        "arrowright",

        "arrowleft",

        "arrowright",

        "b",

        "a"

    ];


    if (
        konamiKeys.includes(key)
    ) {

        state.keySequence +=
            key + ",";


        if (
            state.keySequence.length >
            100
        ) {

            state.keySequence =
                state.keySequence.slice(
                    -100
                );

        }


        const sequence =
            konamiKeys.join(",") +
            ",";


        if (
            state.keySequence.includes(
                sequence
            )
        ) {

            registerEvent(
                "konami-secret",
                "OLD SCHOOL",
                "SECRET"
            );


            showSecret(
                "KONAMI ACCESS GRANTED"
            );


            state.keySequence =
                "";

        }

    }


    /* =====================================================
       TYPE CHAOS
    ===================================================== */

    if (
        /^[a-z]$/.test(key)
    ) {

        state.typedWord +=
            key;


        state.typedWord =
            state.typedWord.slice(
                -5
            );


        if (
            state.typedWord ===
            "chaos"
        ) {

            registerEvent(
                "keyboard-secret",
                "ACCESS GRANTED",
                "SECRET"
            );


            showSecret(
                "ACCESS GRANTED"
            );


            state.typedWord =
                "";

        }

    }


    /* =====================================================
       ESCAPE
    ===================================================== */

    if (
        event.key ===
        "Escape"
    ) {

        closeModal(
            archiveModal
        );


        closeModal(
            achievementModal
        );


        closeModal(
            terminalModal
        );


        closeModal(
            miniGameModal
        );

    }

}


/* =========================================================
   CURSOR
   ========================================================= */

function setupCursor() {

    window.addEventListener(
        "pointermove",
        event => {

            cursorGlow.style.left =
                `${event.clientX}px`;


            cursorGlow.style.top =
                `${event.clientY}px`;

        }
    );

}


/* =========================================================
   SESSION TIMER
   ========================================================= */

function updateSessionClock() {

    const seconds =
        Math.floor(
            (
                Date.now() -
                sessionStarted
            ) / 1000
        );


    const minutes =
        String(
            Math.floor(
                seconds / 60
            )
        ).padStart(
            2,
            "0"
        );


    const secs =
        String(
            seconds % 60
        ).padStart(
            2,
            "0"
        );


    sessionTime.textContent =
        `${minutes}:${secs}`;

}


/* =========================================================
   SOUND TOGGLE
   ========================================================= */

function toggleSound() {

    state.sound =
        !state.sound;


    soundButton.textContent =
        state.sound
            ? "🔊 SOUND ON"
            : "🔇 SOUND OFF";


    if (
        state.sound
    ) {

        initAudio();

    }


    save();

}


/* =========================================================
   RESET
   ========================================================= */

function resetExperiment() {

    const confirmed =
        confirm(
            "Erase ALL CHAOS.EXE progress?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        SAVE_KEY
    );


    location.reload();

}


/* =========================================================
   MODAL BUTTONS
   ========================================================= */

function setupModalButtons() {

    $("archiveButton")
        .addEventListener(
            "click",
            () =>
                openModal(
                    archiveModal
                )
        );


    $("achievementButton")
        .addEventListener(
            "click",
            () =>
                openModal(
                    achievementModal
                )
        );


    $("terminalButton")
        .addEventListener(
            "click",
            () =>
                openModal(
                    terminalModal
                )
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset.close;


                        if (
                            target ===
                            "archive"
                        ) {

                            closeModal(
                                archiveModal
                            );

                        }


                        if (
                            target ===
                            "achievement"
                        ) {

                            closeModal(
                                achievementModal
                            );

                        }


                        if (
                            target ===
                            "terminal"
                        ) {

                            closeModal(
                                terminalModal
                            );

                        }


                        if (
                            target ===
                            "mini"
                        ) {

                            closeModal(
                                miniGameModal
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   BOOT
   ========================================================= */

function boot() {

    loadSave();


    if (
        state.returningUser
    ) {

        showMessage(
            "WELCOME BACK. THE BUTTON REMEMBERS YOU.",
            "SECRET"
        );

    }


    if (
        state.clicks >= 100
    ) {

        document.body.classList.add(
            "overload"
        );

    }


    chaosButton.addEventListener(
        "click",
        handleClick
    );


    resetButton.addEventListener(
        "click",
        resetExperiment
    );


    soundButton.addEventListener(
        "click",
        toggleSound
    );


    terminalForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            terminalCommand(
                terminalInput.value
            );


            terminalInput.value =
                "";

        }
    );


    miniGameButton.addEventListener(
        "click",
        miniGameClick
    );


    window.addEventListener(
        "keydown",
        handleKeyboard
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    setupCursor();


    setupModalButtons();


    resetIdleTimer();


    resizeCanvas();


    animateParticles();


    updateUI();


    updateSessionClock();


    setInterval(
        updateSessionClock,
        1000
    );


    if (
        state.clicks === 0
    ) {

        buttonHint.textContent =
            "DO IT.";

    }


    else {

        updateButtonHint();

    }


    setInterval(() => {

        if (
            Date.now() -
            state.lastClickAt >
            15000 &&
            state.clicks > 0
        ) {

            idleEntity();

        }

    }, 5000);

}


/* =========================================================
   START CHAOS.EXE
   ========================================================= */

boot();