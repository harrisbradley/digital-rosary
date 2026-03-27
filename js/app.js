// ========== CONFIGURATION ==========
// ⚙️ This section sets up constants and configuration values

// 🚩 Feature flags - turn features on/off easily
// Think of these like light switches for different parts of the app
const FEATURES = {
  SHOW_ROSARY_PROGRESS: false // Set to false to hide the Rosary Progress section
  // Change to true to show the visual rosary progress indicator
};

// 📜 Prayer scrolling configuration
// If a prayer exceeds this many lines, scrolling will be enabled
// Set to a high number (e.g., 999) to disable scrolling
const PRAYER_SCROLL_THRESHOLD_LINES = 8;

// 🖼️ Base path for rosary step images
// This tells JavaScript where to find the prayer illustration images
const ASSET_BASE = "./images/rosary/";

// 🗺️ Maps each prayer step to its corresponding image filename
// This is like a dictionary: "prayer name" → "image file name"
const STEP_IMAGES = {
  "The Sign of the Cross": "sign_of_the_cross.png",
  "Apostles\' Creed": "Creed2.png",
  "Our Father (Intro)": "our_father.png",
  "Hail Mary (Faith)": "Hail_Mary.png",
  "Hail Mary (Hope)": "Hail_Mary.png",
  "Hail Mary (Charity)": "Hail_Mary.png",
  "Glory Be": "glory_be.png",
  "Announce the Mystery": "announce-mystery.jpg",
  "Our Father": "our_father.png",
  "Hail Mary": "Hail_Mary.png",
  "Fatima Prayer": "Fatima.png",
  "Hail Holy Queen": "hail_holy_queen.png",
  "Concluding Prayer": "conclusion.png",
  "The Sign of the Cross (Final)": "sign_of_the_cross.png"
};

// 🖼️ Maps mystery names to their corresponding image filenames
// Organized by mystery set - currently only Joyful Mysteries have images
// Temporarily mapping Joyful images to Luminous for testing purposes
// Other mystery sets will fall back to default images until images are added
const MYSTERY_IMAGES = {
  Joyful: {
    'The Annunciation': 'Annunciation.png',
    'The Visitation': 'Visitation.png',
    'The Nativity': 'Nativity.png',
    'The Presentation': 'Presentation.png',
    'The Finding in the Temple': 'Finding.png'
  },
  Sorrowful: {
    'The Agony in the Garden': 'Agony.png',
    'The Scourging at the Pillar': 'Scourging.png',
    'The Crowning with Thorns': 'Crowning.png',
    'The Carrying of the Cross': 'Carrying.png',
    'The Crucifixion': 'Crucifixion.png'
  }, 
  Glorious: {
    'The Resurrection': 'Resurrection.png',
    'The Ascension': 'Ascension.png',
    'The Descent of the Holy Spirit': 'Descent.png',
    'The Assumption': 'Assumption.png',
    'The Coronation of Mary': 'Coronation.png'
  }, 
  Luminous: {
    'The Baptism of the Lord': 'Baptism.png',
    'The Wedding at Cana': 'Wedding.png',
    'The Proclamation of the Kingdom': 'Proclamation.png',
    'The Transfiguration': 'Transfiguration.png',
    'The Institution of the Eucharist': 'Eucharist.png'
  }
};

// 🔄 Cache-busting: prevents browser from using old cached images during development
// When testing locally, adds ?t=timestamp to image URLs to force fresh load
const CACHE_BUST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? ('?t=' + Date.now()) : '';

// 📅 Helper for local-day comparisons (resets at local midnight)
const localDateStr = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// 📅 Helper function: Get today's date in local YYYY-MM-DD format
// Returns a string like "2024-01-15"
const todayStr = () => localDateStr(new Date());
// 🌍 Default timezone fallback
const defaultTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
// 🧭 Normalize timezone values and fall back safely
function normalizeTimeZone(timeZone) {
  if (timeZone) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
      return timeZone;
    } catch {
      // Fall through to default
    }
  }
  const fallback = defaultTimeZone();
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: fallback }).format(new Date());
    return fallback;
  } catch {
    return 'UTC';
  }
}
// 🗓️ Format a date as YYYY-MM-DD in a specific timezone
function dateStrInTimeZone(date, timeZone) {
  const tz = normalizeTimeZone(timeZone);
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const values = {};
    parts.forEach(part => {
      if (part.type !== 'literal') values[part.type] = part.value;
    });
    if (values.year && values.month && values.day) {
      return `${values.year}-${values.month}-${values.day}`;
    }
  } catch {
    // Fall back to local
  }
  return localDateStr(date);
}

// 📅 Convert date-like values to local YYYY-MM-DD safely
function toLocalDateStr(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return localDateStr(date);
}

// 📝 Resolve prayer-log entry date consistently
// Prefer explicit entry.date; fall back to createdAt in local time
function getPrayerEntryDate(entry) {
  if (!entry) return null;
  if (typeof entry.date === 'string' && entry.date) return entry.date;
  if (entry.createdAt?.toDate) return toLocalDateStr(entry.createdAt.toDate());
  return toLocalDateStr(entry.createdAt);
}

// 🔢 Count consecutive logged days ending on referenceDate
function calculateStreakFromDates(dateStrings, referenceDate) {
  const uniqueDates = new Set((dateStrings || []).filter(Boolean));
  let streak = 0;
  let cursor = referenceDate;

  while (cursor && uniqueDates.has(cursor)) {
    streak += 1;
    const [year, month, day] = cursor.split('-').map(Number);
    const previousDay = new Date(year, month - 1, day);
    previousDay.setDate(previousDay.getDate() - 1);
    cursor = localDateStr(previousDay);
  }

  return streak;
}

// 💾 LocalStorage keys for persistence
// localStorage is browser storage that saves data between visits
// These are the "keys" (like variable names) we use to store/retrieve data
const LS_KEYS = { 
  TOTAL: 'rosary_total_v1',      // Total count of rosaries prayed
  LAST_DATE: 'rosary_last_date_v1', // Date of last rosary
  STREAK: 'rosary_streak_v1',    // Current streak count
  LOG: 'rosary_log_v1',          // Prayer log entries (local fallback)
  DARK_MODE: 'dark_mode_v1',      // Dark mode preference
  HIDE_NEW_TO_ROSARY: 'hide_new_to_rosary_v1', // Hide "New to the Rosary?" section
  ONE_CLICK_HAIL_MARYS: 'one_click_hail_marys_v1', // 1-click Hail Marys toggle preference
  IRG_STEP: 'irg_step_v1',       // Current IRG step index (0-based)
  IRG_STEP_DATE: 'irg_step_date_v1', // Date when IRG progress was last saved (YYYY-MM-DD, user timezone)
  IRG_STEP_SAVED_AT: 'irg_step_saved_at_v1', // Timestamp when IRG progress was saved
  TIMEZONE: 'user_timezone_v1'   // User timezone preference (IANA name)
};

// ========== DATA: THE FOUR MYSTERIES OF THE ROSARY ==========
// 📿 This defines all four mystery sets and when they're typically prayed
// Each mystery has specific days of the week it's typically prayed
// JavaScript day numbers: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
// - Joyful: Monday & Saturday (days 1 & 6)
// - Sorrowful: Tuesday & Friday (days 2 & 5) 
// - Glorious: Sunday & Wednesday (days 0 & 3)
// - Luminous: Thursday (day 4)
const MYSTERIES = {
  Joyful: { 
    days: [1, 6],  // Which days of the week (Monday=1, Saturday=6)
    items: ['The Annunciation', 'The Visitation', 'The Nativity', 'The Presentation', 'The Finding in the Temple'] 
    // The 5 individual mysteries within this set
  },
  Sorrowful: { 
    days: [2, 5], 
    items: ['The Agony in the Garden', 'The Scourging at the Pillar', 'The Crowning with Thorns', 'The Carrying of the Cross', 'The Crucifixion'] 
  },
  Glorious: { 
    days: [0, 3], 
    items: ['The Resurrection', 'The Ascension', 'The Descent of the Holy Spirit', 'The Assumption', 'The Coronation of Mary'] 
  },
  Luminous: { 
    days: [4], 
    items: ['The Baptism of the Lord', 'The Wedding at Cana', 'The Proclamation of the Kingdom', 'The Transfiguration', 'The Institution of the Eucharist'] 
  }
};

// 🗓️ Calculate which mystery set is for today
// new Date().getDay() returns 0-6 (Sunday-Saturday)
const weekday = new Date().getDay();
// Find the mystery set that includes today's weekday
// The ?? 'Joyful' means "if nothing found, default to Joyful"
let TODAY_SET = Object.entries(MYSTERIES).find(([_, cfg]) => cfg.days.includes(weekday))?.[0] ?? 'Joyful';

// 🧪 Allow URL parameter to override mystery set for testing
// Example: ?mystery=Joyful or ?mystery=Sorrowful
const urlParams = new URLSearchParams(window.location.search);
const overrideMystery = urlParams.get('mystery');
if (overrideMystery && MYSTERIES[overrideMystery]) {
  TODAY_SET = overrideMystery;
}

// ========== PRAYER TEXTS ==========
// 📖 Prayer texts are loaded from prayers.js
// The PRAYERS object is defined in prayers.js and loaded before this file

// 🔢 Build the steps for each decade of the rosary
// A decade = one set of 10 Hail Marys with surrounding prayers
// Each decade consists of: Announce → Our Father → 10 Hail Marys → Glory Be → Fatima Prayer
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];
// Get today's mystery items (the 5 individual mysteries for today's set)
const TODAY_MYSTERIES = MYSTERIES[TODAY_SET]?.items ?? [];

// 🏗️ Function to create all the steps for one decade
// decadeIndex: which decade (0-4, since there are 5 decades)
function createDecadeSteps(decadeIndex) {
  // Convert number to word: 0 → "first", 1 → "second", etc.
  const ordinal = ORDINALS[decadeIndex] ?? `${decadeIndex + 1}th`;
  // Get the mystery name for this decade (e.g., "The Annunciation")
  const mysteryName = TODAY_MYSTERIES[decadeIndex];
  // Create the announcement step
  const announceTitle = `Announce the ${ordinal} mystery`;
  const announceText = `📿 Announce the <strong>${ordinal} ${TODAY_SET}</strong> mystery${mysteryName ? `: <strong>${mysteryName}</strong>` : ''}.`;
  
  // Return an array of step objects for this decade
  return [
    { title: announceTitle, text: () => announceText, decadeIndex: decadeIndex },  // Announce step
    { title: 'Our Father', text: () => PRAYERS.ourFather, decadeIndex: decadeIndex },  // Our Father
    // Generate 10 Hail Mary steps (one for each bead in a decade)
    // Array.from creates an array, and ... spreads it into the parent array
    ...Array.from({ length: 10 }, (_, i) => ({
      title: `Hail Mary ${i + 1}/10`,  // Shows "Hail Mary 1/10", "Hail Mary 2/10", etc.
      text: () => PRAYERS.hailMary,    // The actual prayer text
      isHailMary: true,                 // Flag to identify Hail Mary steps
      hailMaryNumber: i + 1,            // Which Hail Mary (1-10)
      decadeIndex: decadeIndex          // Which decade this belongs to
    })),
    { title: 'Glory Be', text: () => PRAYERS.gloryBe },
    { title: 'Fatima Prayer', text: () => PRAYERS.fatima }
  ];
}

// 📿 Complete rosary guide (intro + 5 decades + final prayers)
// This is THE MAIN ARRAY that defines every step of the rosary
// stepIndex points to an item in this array (0 = first step, 1 = second step, etc.)
const GUIDE = [
  // 🙏 Introduction prayers (before the decades)
  { title: 'The Sign of the Cross', text: () => PRAYERS.signOfCross },
  { title: 'Apostles\' Creed', text: () => PRAYERS.apostlesCreed },
  { title: 'Our Father (Intro)', text: () => PRAYERS.ourFather },
  { title: 'Hail Mary (Faith)', text: () => PRAYERS.hailMary, isThreeBeadHailMary: true, threeBeadNumber: 1 },
  { title: 'Hail Mary (Hope)', text: () => PRAYERS.hailMary, isThreeBeadHailMary: true, threeBeadNumber: 2 },
  { title: 'Hail Mary (Charity)', text: () => PRAYERS.hailMary, isThreeBeadHailMary: true, threeBeadNumber: 3 },
  { title: 'Glory Be', text: () => PRAYERS.gloryBe },
  // 📿 The 5 decades (each decade has ~14 steps: announce + Our Father + 10 Hail Marys + Glory Be + Fatima)
  // ...createDecadeSteps(0) spreads all the steps from decade 0 into this array
  ...createDecadeSteps(0),  // First Decade
  ...createDecadeSteps(1),  // Second Decade
  ...createDecadeSteps(2),  // Third Decade
  ...createDecadeSteps(3),  // Fourth Decade
  ...createDecadeSteps(4),  // Fifth Decade
  // 🙏 Final Prayers (after all decades)
  { title: 'Hail Holy Queen', text: () => PRAYERS.hailHolyQueen },
  { title: 'Concluding Prayer', text: () => PRAYERS.concludingPrayer },
  { title: 'The Sign of the Cross (Final)', text: () => PRAYERS.signOfCross }
];

// ========== UTILITY FUNCTIONS ==========
// 🛠️ Hail Mary Decade Helper functions that do specific tasks

// 🔵 Generate bead visualization for Hail Mary steps
// Creates visual beads showing progress through the 10 Hail Marys in a decade
// Shows 10 beads: previous beads are blue (filled), current bead is red, future beads are empty
function generateBeads(currentNumber) {
  const beads = [];  // Start with empty array
  // Loop through 1 to 10 (the 10 Hail Marys in a decade)
  for (let i = 1; i <= 10; i++) {
    let classes = 'bead';  // Base CSS class
    if (i < currentNumber) {
      // Previous beads: filled blue (already prayed)
      classes += ' bead-filled';
    } else if (i === currentNumber) {
      // Current bead: red (the one you're on now)
      classes += ' bead-current';
    }
    // Future beads (i > currentNumber): remain empty (just 'bead' class)
    // Create HTML span element for this bead
    beads.push(`<span class="${classes}"></span>`);
  }
  // Join all beads together and wrap in container
  return `<span class="beads-container">${beads.join('')}</span>`;
}

// 🔴 Generate 3-bead visualization for Faith, Hope, Charity Hail Marys
// Creates 3 beads: previous beads are filled, current bead is red, future beads are empty
function generateThreeBeads(currentNumber) {
  const beads = [];  // Start with empty array
  // Loop through 1 to 3 (Faith, Hope, Charity)
  for (let i = 1; i <= 3; i++) {
    let classes = 'bead';  // Base CSS class
    if (i < currentNumber) {
      // Previous beads: filled blue (already prayed)
      classes += ' bead-filled';
    } else if (i === currentNumber) {
      // Current bead: red (the one you're on now)
      classes += ' bead-current';
    }
    // Future beads (i > currentNumber): remain empty (just 'bead' class)
    beads.push(`<span class="${classes}"></span>`);
  }
  // Join all beads together and wrap in container
  return `<span class="beads-container three-beads-container">${beads.join('')}</span>`;
}

// 📿 Get meditation text for a specific Hail Mary in a decade
// Returns the meditation text or empty string if not found
// decadeIndex: which decade (0-4)
// hailMaryNumber: which Hail Mary in that decade (1-10)
function getMeditation(decadeIndex, hailMaryNumber) {
  // Check if MEDITATIONS object exists (loaded from meditations.js)
  if (typeof MEDITATIONS === 'undefined' || !MEDITATIONS) {
    return '';
  }
  
  // Get the current mystery set and mystery name for this decade
  const mysterySet = TODAY_SET;
  const mysteryName = TODAY_MYSTERIES[decadeIndex];
  
  // Validate inputs
  if (!mysterySet || !mysteryName || !hailMaryNumber || hailMaryNumber < 1 || hailMaryNumber > 10) {
    return '';
  }
  
  // Check if meditation exists for this mystery set and mystery name
  if (!MEDITATIONS[mysterySet] || !MEDITATIONS[mysterySet][mysteryName]) {
    return '';
  }
  
  // Get the meditation array for this mystery (should have 10 items)
  const meditations = MEDITATIONS[mysterySet][mysteryName];
  
  // Array index is 0-9, hailMaryNumber is 1-10, so subtract 1
  const index = hailMaryNumber - 1;
  
  // Return the meditation text, or empty string if index is out of range or empty
  if (index >= 0 && index < meditations.length && meditations[index]) {
    return meditations[index].trim();
  }
  
  return '';
}

// 📿 Find the end of the current decade (Glory Be step)
// Returns the index of the "Glory Be" step for the decade containing stepIndex
// If not in a decade or not found, returns -1
function findDecadeEnd(stepIndex) {
  const currentStep = GUIDE[stepIndex];
  if (!currentStep || !currentStep.isHailMary || currentStep.decadeIndex === undefined) {
    return -1; // Not on a Hail Mary step in a decade
  }
  
  const decadeIndex = currentStep.decadeIndex;
  
  // Find the first non-Hail Mary step after the current Hail Mary
  // This will be the Glory Be step (structure: Announce → Our Father → 10 Hail Marys → Glory Be → Fatima)
  for (let i = stepIndex + 1; i < GUIDE.length; i++) {
    const step = GUIDE[i];
    
    // If we find a step that's not a Hail Mary, it's the Glory Be (or we've moved past the decade)
    if (!step.isHailMary) {
      // Check if we're still in the same decade by looking at previous steps
      // If the previous step was a Hail Mary with the same decadeIndex, we're still in the decade
      if (i > 0 && GUIDE[i - 1].isHailMary && GUIDE[i - 1].decadeIndex === decadeIndex) {
        return i; // This is the Glory Be step
      }
      // If we've moved to a different decade (next decade's Announce step), stop
      if (step.title && step.title.startsWith('Announce the')) {
        break;
      }
    }
    
    // If we encounter a Hail Mary from a different decade, stop searching
    if (step.isHailMary && step.decadeIndex !== undefined && step.decadeIndex !== decadeIndex) {
      break;
    }
  }
  
  return -1;
}

// 🚀 Preload images for upcoming steps to improve performance
// Preloads the next N images so they're ready when user navigates
function preloadNextImages(currentIndex, count = 3) {
  for (let i = 1; i <= count; i++) {
    const nextIndex = currentIndex + i;
    if (nextIndex < GUIDE.length) {
      const nextStep = GUIDE[nextIndex];
      const nextImageSrc = imageForTitle(nextStep);
      
      // Skip if it's an SVG data URL (already generated, no need to preload)
      if (nextImageSrc && !nextImageSrc.startsWith('data:')) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = nextImageSrc;
        // Add to head only if not already added
        if (!document.querySelector(`link[href="${nextImageSrc}"]`)) {
          document.head.appendChild(link);
        }
      }
    }
  }
}

// 🖼️ Find the appropriate image for a prayer step
// This function looks up which image file to show for each prayer step
// Falls back to generating an SVG placeholder if no image found
function imageForTitle(step) {
  const title = typeof step === 'string' ? step : step.title;
  
  // Check if this is a decade step (Announce, Our Father, or Hail Mary within a decade)
  if (step && typeof step === 'object' && step.decadeIndex !== undefined) {
    // Get the mystery name for this decade
    const mysteryName = TODAY_MYSTERIES[step.decadeIndex];
    // Check if we have images for this mystery set
    const mysteryImageMap = MYSTERY_IMAGES[TODAY_SET];
    if (mysteryImageMap && mysteryName && mysteryImageMap[mysteryName]) {
      // Use the mystery-specific image
      return ASSET_BASE + mysteryImageMap[mysteryName] + CACHE_BUST;
    }
    // If no mystery image exists, fall through to default behavior below
  }
  
  // First, check if we have an exact match in STEP_IMAGES
  if (STEP_IMAGES[title]) return ASSET_BASE + STEP_IMAGES[title] + CACHE_BUST;
  
  // If title starts with "Announce the", use the generic "Announce the Mystery" image
  if (title && title.startsWith('Announce the')) {
    const baseKey = 'Announce the Mystery';
    if (STEP_IMAGES[baseKey]) return ASSET_BASE + STEP_IMAGES[baseKey] + CACHE_BUST;
  }
  
  // If title starts with "Hail Mary", try to match specific Hail Mary images
  if (title.startsWith('Hail Mary')) {
    // Try to extract the number (e.g., "Hail Mary 3/10" → 3)
    const m = title.match(/^Hail Mary (\d+)/);
    if (m && STEP_IMAGES['Hail Mary ' + m[1]]) return ASSET_BASE + STEP_IMAGES['Hail Mary ' + m[1]] + CACHE_BUST;
    // Fall back to generic Hail Mary image
    if (STEP_IMAGES['Hail Mary']) return ASSET_BASE + STEP_IMAGES['Hail Mary'] + CACHE_BUST;
  }
  
  // 🎨 If no image found, generate a fallback SVG (scalable vector graphic)
  // This creates a simple gradient background with the prayer title text
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#e9f0ff"/><stop offset="1" stop-color="#f7efe3"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" fill="#274c77">${title}</text></svg>`);
}

// ========== DOM ELEMENT REFERENCES ==========
// 🎯 Get all the HTML elements we need to update dynamically
// document.getElementById() finds an element by its id attribute
// We store references to these elements so we can update them later
const todayMysteryEl = document.getElementById('todayMysteryName');  // Shows today's mystery name
const mysteryBadgeEl = document.getElementById('mysteryBadge');     // Badge showing mystery type
const accordionEl = document.getElementById('mysteryAccordion');   // Where mysteries list goes
const totalEl = document.getElementById('totalRosaries');            // Total count display
const streakEl = document.getElementById('streakDays');              // Streak count display
const progressEl = document.getElementById('progressBar');           // Progress bar element
const stepTitleEl = document.getElementById('stepTitle');            // Current step title
const prayerTextEl = document.getElementById('prayerText');          // Prayer text display
const stepImageEl = document.getElementById('stepImage');            // Prayer illustration image
const rosaryProgressCardEl = document.getElementById('rosaryProgressCard');  // Visual rosary card
const rosaryVisualizerEl = document.getElementById('rosaryVisualizer');      // Visual rosary SVG
const jumpBtnEl = document.getElementById('jumpBtn');               // Jump to decades button
const restartBtnEl = document.getElementById('restartBtn');          // Restart button
const nextBtnEl = document.getElementById('nextBtn');                // Next button
const darkModeToggleEl = document.getElementById('darkModeToggle'); // Dark mode toggle button
const oneClickHailMarysToggleEl = document.getElementById('oneClickHailMarysToggle'); // 1-click Hail Marys toggle
const htmlRootEl = document.documentElement;                        // HTML root element

// 📍 Current position in the prayer guide (which step are we on?)
// This number points to an index in the GUIDE array (0 = first step)
// We use "let" instead of "const" because this value changes as user navigates
let stepIndex = 0;

// ========== UTILITY FUNCTIONS ==========

// 📅 Convert day numbers to abbreviated day names
// JavaScript uses 0-6 for days, but we want to show "Mon, Sat" etc.
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Takes array like [1, 6] and converts to "Mon, Sat"
const getDaysString = (days) => days.map(d => DAY_NAMES[d]).join(', ');

// ========== RENDERING FUNCTIONS ==========
// 🎨 Functions that update what's displayed on the page

// 📖 Dynamically build the mysteries accordion (the expandable list in the sidebar)
// This creates HTML elements to show all four mystery sets with their individual mysteries
// "Accordion" means only one section can be open at a time
function renderMysteryAccordion() {
  // Clear any existing content first
  accordionEl.innerHTML = '';
  
  // Loop through each mystery set (Joyful, Sorrowful, Glorious, Luminous)
  for (const [name, cfg] of Object.entries(MYSTERIES)) {
    // Create a <details> element (this is the expandable container)
    const details = document.createElement('details');
    // If this is today's mystery set, start it expanded
    if (name === TODAY_SET) details.open = true;

    // Create the summary (the clickable header)
    const summary = document.createElement('summary');
    const left = document.createElement('span');
    // Show the mystery name with days in parentheses
    // If it's today's set, add a special "today-tag" class
    const mysteryName = name === TODAY_SET ? `<span class="today-tag">${name}</span>` : name;
    const daysString = `(${getDaysString(cfg.days)})`;  // e.g., "(Mon, Sat)"
    left.innerHTML = `${mysteryName} ${daysString}`;
    
    // Create a chevron icon (the little arrow) using SVG
    const chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chev.setAttribute('viewBox', '0 0 24 24'); 
    chev.classList.add('chev'); 
    chev.setAttribute('width', '18'); 
    chev.setAttribute('height', '18');
    chev.innerHTML = '<path d="M8 5l8 7-8 7" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    summary.appendChild(left); 
    summary.appendChild(chev);
    details.appendChild(summary);

    // Create a list of the 5 individual mysteries in this set
    const ul = document.createElement('ul');
    cfg.items.forEach(item => { 
      const li = document.createElement('li'); 
      li.textContent = item; 
      ul.appendChild(li); 
    });
    details.appendChild(ul);

    // Add this mystery set to the accordion
    accordionEl.appendChild(details);
  }

  // 🎯 Make it behave like a true accordion: only one open at a time
  // When you open one, close all the others
  accordionEl.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        // Close all other details elements
        accordionEl.querySelectorAll('details').forEach(other => { 
          if (other !== d) other.open = false; 
        });
      }
    });
  });
}

// 📚 Dynamically build the Prayer Section
// This creates the expandable details elements for each prayer
function renderCommonPrayers() {
  const commonPrayersEl = document.getElementById('common-prayers');
  if (!commonPrayersEl) return;
  
  // Clear existing content (but keep the h2 heading)
  const existingH2 = commonPrayersEl.querySelector('h2');
  commonPrayersEl.innerHTML = '';
  if (existingH2) {
    commonPrayersEl.appendChild(existingH2);
  } else {
    const h2 = document.createElement('h2');
    h2.textContent = 'Prayer Section';
    commonPrayersEl.appendChild(h2);
  }
  
  // Map prayer keys to display names and emojis
  const PRAYER_DISPLAY = [
    { key: 'signOfCross', emoji: '🕊️', name: 'The Sign of the Cross' },
    { key: 'apostlesCreed', emoji: '✝️', name: 'The Apostles\' Creed' },
    { key: 'ourFather', emoji: '🙏', name: 'The Our Father' },
    { key: 'hailMary', emoji: '🌹', name: 'The Hail Mary' },
    { key: 'gloryBe', emoji: '✨', name: 'The Glory Be (Doxology)' },
    { key: 'fatima', emoji: '💖', name: 'The Fatima Prayer ("Oh my Jesus")' },
    { key: 'hailHolyQueen', emoji: '🕯️', name: 'The Hail, Holy Queen (Salve Regina)' },
    { key: 'concludingPrayer', emoji: '🌸', name: 'The Concluding Prayer' }
  ];
  
  // Create details elements for each prayer
  PRAYER_DISPLAY.forEach((prayer, index) => {
    const details = document.createElement('details');
    // First prayer (Sign of the Cross) starts open
    if (index === 0) details.open = true;
    details.style.marginTop = index === 0 ? '8px' : '8px';
    
    const summary = document.createElement('summary');
    summary.className = 'step';
    summary.textContent = `${prayer.emoji} ${prayer.name}`;
    details.appendChild(summary);
    
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = PRAYERS[prayer.key];
    details.appendChild(p);
    
    commonPrayersEl.appendChild(details);
  });
}

// 🎨 Update the main prayer interface with the current step's content
// This is called every time the user moves to a new step
// Shows the image, title, prayer text, and updates buttons
function renderStep() {
  // Get the current step from the GUIDE array
  const step = GUIDE[stepIndex];
  
  // Handle 3-bead Hail Mary steps (Faith, Hope, Charity)
  if (step.isThreeBeadHailMary && step.threeBeadNumber) {
    const virtues = ['Faith', 'Hope', 'Charity'];
    const currentVirtue = virtues[step.threeBeadNumber - 1];
    const beads = generateThreeBeads(step.threeBeadNumber);
    
    // Build the title with styled virtues
    let titleHTML = 'Hail Mary (';
    virtues.forEach((virtue, index) => {
      const isCurrent = index === step.threeBeadNumber - 1;
      const isCompleted = index < step.threeBeadNumber - 1;
      
      if (isCurrent) {
        // Current virtue: red and bold
        titleHTML += `<span class="virtue-current">${virtue}</span>`;
      } else if (isCompleted) {
        // Completed virtue: bold but not red
        titleHTML += `<span class="virtue-completed">${virtue}</span>`;
      } else {
        // Future virtue: normal
        titleHTML += `<span class="virtue-future">${virtue}</span>`;
      }
      
      if (index < virtues.length - 1) {
        titleHTML += ', ';
      }
    });
    titleHTML += ')';
    
    stepTitleEl.innerHTML = `<div style="margin-bottom: 8px;">${beads}</div>${titleHTML}`;
  }
  // For regular Hail Mary steps in decades, show visual beads only when toggle is OFF
  else if (step.isHailMary && step.hailMaryNumber) {
    const isOneClickHailMarysEnabled = getLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, false);
    if (isOneClickHailMarysEnabled) {
      // Toggle is ON - show simple "Hail Mary" without beads
      stepTitleEl.textContent = 'Hail Mary';
    } else {
      // Toggle is OFF - show beads visualization (shows progress through the 10 Hail Marys)
      stepTitleEl.innerHTML = `Hail Mary ${generateBeads(step.hailMaryNumber)}`;
    }
  } else {
    // For other steps, just show the title text
    stepTitleEl.textContent = step.title;
  }
  
  // Update the prayer text (step.text() is a function that returns the prayer)
  // For Hail Mary steps, also display the meditation above the prayer
  const prayerText = step.text();
  if (step.isHailMary && step.decadeIndex !== undefined && step.hailMaryNumber) {
    // Get meditation for this Hail Mary
    const meditation = getMeditation(step.decadeIndex, step.hailMaryNumber);
    // If meditation exists, display it above the prayer text
    if (meditation) {
      prayerTextEl.innerHTML = `<div class="meditation">${meditation}</div>${prayerText}`;
    } else {
      prayerTextEl.innerHTML = prayerText;
    }
  } else {
    prayerTextEl.innerHTML = prayerText;
  }
  
  // Reset scroll position immediately after content update
  // This prevents browser from preserving scroll position when innerHTML changes
  prayerTextEl.scrollTop = 0;
  
  // Check if prayer text exceeds threshold and enable scrolling if needed
  if (PRAYER_SCROLL_THRESHOLD_LINES < 999) {
    // Remove scrollable class first to get accurate measurements
    prayerTextEl.classList.remove('scrollable');
    
    // Reset scroll position again after removing class to ensure it's at top
    prayerTextEl.scrollTop = 0;
    
    // Force a reflow to ensure measurements are accurate
    prayerTextEl.offsetHeight;
    
    // Get the computed line-height (in pixels)
    const computedStyle = window.getComputedStyle(prayerTextEl);
    const lineHeight = parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.6;
    
    // Calculate the threshold height based on number of lines
    const thresholdHeight = lineHeight * PRAYER_SCROLL_THRESHOLD_LINES;
    
    // If the content height exceeds the threshold, enable scrolling
    if (prayerTextEl.scrollHeight > thresholdHeight) {
      prayerTextEl.classList.add('scrollable');
      // Set max-height directly based on calculated threshold
      prayerTextEl.style.maxHeight = thresholdHeight + 'px';
      // Reset scroll position immediately after adding scrollable class
      // This prevents browser from preserving scroll position when class is re-added
      prayerTextEl.scrollTop = 0;
    } else {
      // Reset max-height if scrolling is not needed
      prayerTextEl.style.maxHeight = '';
    }
  } else {
    // Threshold is disabled (set to 999 or higher), remove scrollable class
    prayerTextEl.classList.remove('scrollable');
    prayerTextEl.style.maxHeight = '';
  }
  
  // Reset scroll position to top AFTER all content and styling updates are complete
  // Use requestAnimationFrame as a safety measure to ensure scroll resets after browser rendering
  requestAnimationFrame(() => {
    if (prayerTextEl) {
      prayerTextEl.scrollTop = 0;
    }
  });
  
  // Find and set the image for this step
  const src = imageForTitle(step);
  stepImageEl.alt = step.title + ' illustration';
  
  // Optimize image loading: use eager loading for current image, add fetchpriority
  stepImageEl.loading = 'eager';
  stepImageEl.fetchPriority = 'high';
  
  // Show loading state while image loads
  stepImageEl.classList.add('loading');
  
  // Set image source
  stepImageEl.src = src;
  
  // Remove loading state when image loads
  stepImageEl.onload = () => {
    stepImageEl.classList.remove('loading');
  };
  
  // Preload next 2-3 images for smoother navigation
  preloadNextImages(stepIndex, 3);
  
  // If image fails to load, show a fallback SVG placeholder
  stepImageEl.onerror = () => { 
    stepImageEl.onerror = null;
    stepImageEl.classList.remove('loading');
    stepImageEl.src = imageForTitle(''); 
  };
  
  // Count how many "Announce the" steps we've passed (each decade starts with one)
  // This tells us which decade we're in
  const announceSteps = GUIDE.filter((s, idx) => idx <= stepIndex && s.title.startsWith('Announce the'));
  const currentDecade = announceSteps.length;
  const nextDecadeIdx = GUIDE.findIndex((s, idx) => idx > stepIndex && s.title.startsWith('Announce the'));

  // 🎯 Update the "Jump" button based on where we are
  // Hide jump button if we're in the 5th decade or later (no more decades to jump to)
  if (currentDecade >= 5) {
    jumpBtnEl.style.display = 'none';
  } else {
    jumpBtnEl.style.display = '';
    if (stepIndex >= 5) {
      // If we're past the intro, change button text
      jumpBtnEl.textContent = 'Next Decade';
      jumpBtnEl.disabled = nextDecadeIdx === -1;
    } else {
      // If we're still in intro, show "Jump to Decades"
      jumpBtnEl.textContent = 'Jump to Decades';
      jumpBtnEl.disabled = false;
    }
  }
  
  // On the final step, change Next button to "Log Today's Rosary"
  // Next button always keeps primary class (blue background, gold text)
  const isFinalStep = stepIndex === GUIDE.length - 1;
  const isOneClickHailMarysEnabled = getLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, false);
  const isOnHailMary = step.isHailMary && step.hailMaryNumber;
  const isFirstHailMary = isOnHailMary && step.hailMaryNumber === 1;
  
  // Ensure Next button is always visible (unless it's the final step which shows "Log Today's Rosary")
  if (nextBtnEl) {
    nextBtnEl.style.display = '';
  }
  
  // Update Next button text based on toggle state and current step
  if (isFinalStep) {
    nextBtnEl.textContent = 'Log Today\'s Rosary';
  } else {
    // Always show "Next ▶" - the toggle controls behavior, not the button text
    nextBtnEl.textContent = 'Next ▶';
  }
  // Ensure primary class is always present (makes button blue/gold)
  nextBtnEl.classList.add('primary');
  
  // Update rosary visualization (if feature is enabled)
  if (FEATURES.SHOW_ROSARY_PROGRESS && window.RosaryVisualizer && rosaryVisualizerEl) {
    window.RosaryVisualizer.render(stepIndex, GUIDE.length, rosaryVisualizerEl);
  }
}

// 🚀 Initialize the UI on page load
// "Hydrate" means "fill with data" - this sets up everything when the page first loads
async function hydrateUI() {
  // Set today's mystery name in the hero section
  todayMysteryEl.textContent = TODAY_SET;
  // Set the mystery badge (e.g., "Joyful Mysteries")
  mysteryBadgeEl.textContent = TODAY_SET + ' Mysteries';
  // Build and display the mysteries accordion
  renderMysteryAccordion();
  // Build and display the prayer section
  renderCommonPrayers();
  
  // Restore IRG progress before showing the step
  const savedStep = await loadIRGProgress();
  stepIndex = savedStep;
  
  // Show the current step of the rosary (restored or default)
  renderStep();
  // Update the stats (streak, total, progress bar)
  syncStats();
  // Initialize "New to the Rosary?" section visibility
  initNewToRosarySection();

  // Show/hide Rosary Progress section based on feature flag
  if (rosaryProgressCardEl) {
    rosaryProgressCardEl.style.display = FEATURES.SHOW_ROSARY_PROGRESS ? 'block' : 'none';
  }

  // Initialize rosary visualization (if feature is enabled)
  if (FEATURES.SHOW_ROSARY_PROGRESS && window.RosaryVisualizer && rosaryVisualizerEl) {
    window.RosaryVisualizer.render(stepIndex, GUIDE.length, rosaryVisualizerEl);
  }
}

// ========== EVENT HANDLERS ==========
// 🎮 These functions respond to user actions (clicks, keyboard presses, etc.)
// addEventListener() means "when this happens, do that"

// ➡️ Navigation: Move forward through the rosary steps
// Next button: Go to next step, or log rosary if on final step
nextBtnEl.addEventListener('click', () => {
  // Add visual feedback animation (button briefly changes when clicked)
  nextBtnEl.classList.add('clicked');
  setTimeout(() => {
    nextBtnEl.classList.remove('clicked');
  }, 300);  // Remove the class after 300 milliseconds

  // Check if we're on the very last step
  const isFinalStep = stepIndex === GUIDE.length - 1;
  if (isFinalStep) {
    // If on final step, log the rosary and show celebration
    logRosary(true);
  } else {
    // Check if 1-click Hail Marys is enabled and we're on the first Hail Mary
    const currentStep = GUIDE[stepIndex];
    const isOneClickHailMarysEnabled = getLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, false);
    const isFirstHailMary = currentStep.isHailMary && currentStep.hailMaryNumber === 1;
    
    if (isOneClickHailMarysEnabled && isFirstHailMary) {
      // Skip to the end of the decade (Glory Be step)
      const decadeEndIndex = findDecadeEnd(stepIndex);
      if (decadeEndIndex !== -1) {
        stepIndex = decadeEndIndex;
      } else {
        // Fallback: move to next step if we can't find decade end
        stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
      }
    } else {
      // Otherwise, move to the next step
      // Math.min ensures we never go past the last step
      stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
    }
    saveIRGProgress(); // Save progress
    renderStep();  // Update the display
  }
});

// 🖼️ Image click: Same functionality as Next button
// Clicking the prayer illustration advances to the next step
stepImageEl.addEventListener('click', () => {
  // Add visual feedback animation (image briefly changes opacity when clicked)
  stepImageEl.style.opacity = '0.7';
  setTimeout(() => {
    stepImageEl.style.opacity = '';
  }, 200);  // Remove the opacity change after 200 milliseconds

  // Also trigger the Next button's visual feedback to show they're equivalent
  nextBtnEl.classList.add('clicked');
  setTimeout(() => {
    nextBtnEl.classList.remove('clicked');
  }, 300);  // Remove the class after 300 milliseconds (same as button click)

  // Check if we're on the very last step
  const isFinalStep = stepIndex === GUIDE.length - 1;
  if (isFinalStep) {
    // If on final step, log the rosary and show celebration
    logRosary(true);
  } else {
    // Check if 1-click Hail Marys is enabled and we're on the first Hail Mary
    const currentStep = GUIDE[stepIndex];
    const isOneClickHailMarysEnabled = getLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, false);
    const isFirstHailMary = currentStep.isHailMary && currentStep.hailMaryNumber === 1;
    
    if (isOneClickHailMarysEnabled && isFirstHailMary) {
      // Skip to the end of the decade (Glory Be step)
      const decadeEndIndex = findDecadeEnd(stepIndex);
      if (decadeEndIndex !== -1) {
        stepIndex = decadeEndIndex;
      } else {
        // Fallback: move to next step if we can't find decade end
        stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
      }
    } else {
      // Otherwise, move to the next step
      // Math.min ensures we never go past the last step
      stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
    }
    saveIRGProgress(); // Save progress
    renderStep();  // Update the display
  }
});

// ⬅️ Previous button: Go back to previous step
document.getElementById('prevBtn').addEventListener('click', () => { 
  // Math.max ensures we never go below 0 (first step)
  stepIndex = Math.max(0, stepIndex - 1); 
  saveIRGProgress(); // Save progress
  renderStep(); 
});

// ⏩ Jump button: Skip directly to the first decade (or next decade if already in decades)
jumpBtnEl.addEventListener('click', () => {
  // If we're past step 5 (in the decades), jump to NEXT decade
  // Otherwise, jump to FIRST decade
  const targetIdx = stepIndex >= 5
    ? GUIDE.findIndex((s, idx) => idx > stepIndex && s.title.startsWith('Announce the'))
    : GUIDE.findIndex(s => s.title.startsWith('Announce the'));
  // If we found a target, jump there
  if (targetIdx !== -1) {
    stepIndex = targetIdx;
    saveIRGProgress(); // Save progress
    renderStep();
  }
});


// 🔄 Restart button: Return to the first step of the guide
restartBtnEl.addEventListener('click', () => {
  stepIndex = 0;  // Go back to beginning
  saveIRGProgress(); // Save progress
  renderStep();
});

// 🚀 Begin button: Start from the beginning and scroll to the guide
// Wait for DOM to be ready before attaching event listener
function initBeginButton() {
  const beginBtn = document.getElementById('beginBtn');
  if (!beginBtn) {
    console.error('Begin button not found');
    return;
  }
  
  // Handle both click and touch events for mobile compatibility
  const handleBeginClick = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    stepIndex = 0; 
    saveIRGProgress(); // Save progress
    renderStep(); 
    
    // Scroll to guide section
    // Use multiple methods to ensure it works on all devices
    setTimeout(function() {
      const guideElement = document.getElementById('interactiveRosaryGuide');
      
      if (!guideElement) {
        console.warn('Interactive Rosary Guide element not found');
        return;
      }
      
      const isMobile = window.innerWidth <= 768;
      const navOffset = isMobile ? 70 : 90;
      
      // Method 1: scrollIntoView (most reliable on mobile)
      guideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Method 2: Adjust for nav offset after scrollIntoView
      setTimeout(function() {
        const rect = guideElement.getBoundingClientRect();
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const elementTop = rect.top + currentScroll;
        const targetPos = elementTop - navOffset;
        
        // If we need to adjust further, do it
        if (rect.top < navOffset) {
          window.scrollTo({
            top: Math.max(0, targetPos),
            behavior: 'smooth'
          });
        }
      }, 200);
    }, 100);
  };
  
  // Attach both click and touchstart events for maximum compatibility
  beginBtn.addEventListener('click', handleBeginClick);
  beginBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    handleBeginClick(e);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBeginButton);
} else {
  // DOM is already ready
  initBeginButton();
}

// ⌨️ Keyboard navigation: Left/Right arrows to move through steps
// This lets users navigate with keyboard instead of clicking buttons
window.addEventListener('keydown', e => { 
  if (e.key === 'ArrowRight') { 
    // Right arrow = next step
    stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1); 
    saveIRGProgress(); // Save progress
    renderStep(); 
  } 
  if (e.key === 'ArrowLeft') { 
    // Left arrow = previous step
    stepIndex = Math.max(0, stepIndex - 1); 
    saveIRGProgress(); // Save progress
    renderStep(); 
  } 
});

// ========== LOCALSTORAGE & STATS ==========
// 💾 localStorage is browser storage that persists between page visits
// It's like a tiny database that lives in your browser

// 📖 Helper function to read from localStorage or Firestore
// k = key (the name), f = fallback (default value if nothing found)
async function getLSAsync(k, f) {
  const user = authService ? authService.getCurrentUser() : null;
  
  if (user && window.firestoreService) {
    // User is authenticated - try Firestore first, then cache, then fallback
    try {
      const userId = user.uid;
      
      // Map localStorage keys to Firestore paths
      if (k === LS_KEYS.TOTAL || k === LS_KEYS.STREAK || k === LS_KEYS.LAST_DATE) {
        const stats = await firestoreService.getUserStats(userId);
        if (stats.success) {
          if (k === LS_KEYS.TOTAL) return stats.data.total ?? f;
          if (k === LS_KEYS.STREAK) return stats.data.streak ?? f;
          if (k === LS_KEYS.LAST_DATE) return stats.data.lastDate ?? f;
        }
      } else if (k === LS_KEYS.DARK_MODE || k === LS_KEYS.ONE_CLICK_HAIL_MARYS) {
        const settings = await firestoreService.getUserSettings(userId);
        if (settings.success) {
          if (k === LS_KEYS.DARK_MODE) return settings.data.darkMode ?? f;
          if (k === LS_KEYS.ONE_CLICK_HAIL_MARYS) return settings.data.oneClickHailMarys ?? f;
        }
      }
    } catch (error) {
      console.warn('Error reading from Firestore, falling back to localStorage:', error);
    }
  }
  
  // Fallback to localStorage
  try { 
    const v = localStorage.getItem(k);
    return v === null ? f : JSON.parse(v);
  } catch { 
    return f;
  } 
}

// Synchronous version for backwards compatibility (uses cache)
function getLS(k, f) {
  const user = authService ? authService.getCurrentUser() : null;
  
  if (user && window.firestoreService) {
    // Try to get from cache first
    const userId = user.uid;
    const cacheKey = `user_${k}_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached !== null) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    // Prefer the canonical local key next (setLS writes this immediately)
    // This avoids stale Firestore cache values right after local updates.
    const directLocal = localStorage.getItem(k);
    if (directLocal !== null) {
      try {
        return JSON.parse(directLocal);
      } catch {}
    }
    
    // Map to Firestore cache keys
    if (k === LS_KEYS.TOTAL || k === LS_KEYS.STREAK || k === LS_KEYS.LAST_DATE) {
      const statsCache = localStorage.getItem(`user_stats_${userId}`);
      if (statsCache) {
        try {
          const stats = JSON.parse(statsCache);
          if (k === LS_KEYS.TOTAL) return stats.total ?? f;
          if (k === LS_KEYS.STREAK) return stats.streak ?? f;
          if (k === LS_KEYS.LAST_DATE) return stats.lastDate ?? f;
        } catch {}
      }
    } else if (k === LS_KEYS.DARK_MODE || k === LS_KEYS.ONE_CLICK_HAIL_MARYS) {
      const settingsCache = localStorage.getItem(`user_settings_${userId}`);
      if (settingsCache) {
        try {
          const settings = JSON.parse(settingsCache);
          if (k === LS_KEYS.DARK_MODE) return settings.darkMode ?? f;
          if (k === LS_KEYS.ONE_CLICK_HAIL_MARYS) return settings.oneClickHailMarys ?? f;
        } catch {}
      }
    }
  }
  
  // Fallback to localStorage
  try { 
    const v = localStorage.getItem(k);
    return v === null ? f : JSON.parse(v);
  } catch { 
    return f;
  } 
}

// Keep per-user cache mirrors aligned with local writes.
function syncAuthCachesForKey(userId, k, v) {
  if (!userId) return;

  // Granular cache key
  try {
    localStorage.setItem(`user_${k}_${userId}`, JSON.stringify(v));
  } catch {
    // Ignore cache write errors
  }

  // Stats aggregate cache
  if (k === LS_KEYS.TOTAL || k === LS_KEYS.STREAK || k === LS_KEYS.LAST_DATE) {
    try {
      const statsCacheKey = `user_stats_${userId}`;
      const existing = localStorage.getItem(statsCacheKey);
      const stats = existing ? JSON.parse(existing) : {};
      if (k === LS_KEYS.TOTAL) stats.total = v;
      if (k === LS_KEYS.STREAK) stats.streak = v;
      if (k === LS_KEYS.LAST_DATE) stats.lastDate = v;
      localStorage.setItem(statsCacheKey, JSON.stringify(stats));
    } catch {
      // Ignore cache write errors
    }
  }

  // Settings aggregate cache
  if (k === LS_KEYS.DARK_MODE || k === LS_KEYS.ONE_CLICK_HAIL_MARYS || k === LS_KEYS.TIMEZONE) {
    try {
      const settingsCacheKey = `user_settings_${userId}`;
      const existing = localStorage.getItem(settingsCacheKey);
      const settings = existing ? JSON.parse(existing) : {};
      if (k === LS_KEYS.DARK_MODE) settings.darkMode = v;
      if (k === LS_KEYS.ONE_CLICK_HAIL_MARYS) settings.oneClickHailMarys = v;
      if (k === LS_KEYS.TIMEZONE) settings.timezone = v;
      localStorage.setItem(settingsCacheKey, JSON.stringify(settings));
    } catch {
      // Ignore cache write errors
    }
  }
}

// 💾 Helper function to write to localStorage and Firestore
// k = key (the name), v = value (the data to save)
async function setLSAsync(k, v) {
  const user = authService ? authService.getCurrentUser() : null;
  
  if (user && window.firestoreService) {
    // User is authenticated - save to Firestore
    try {
      const userId = user.uid;
      
      if (k === LS_KEYS.TOTAL || k === LS_KEYS.STREAK || k === LS_KEYS.LAST_DATE) {
        // Write only the changed stats field to avoid race-condition overwrites
        // when multiple setLS calls happen close together (e.g. total/streak/lastDate).
        const statsPatch = {};
        if (k === LS_KEYS.TOTAL) statsPatch.total = v;
        if (k === LS_KEYS.STREAK) statsPatch.streak = v;
        if (k === LS_KEYS.LAST_DATE) statsPatch.lastDate = v;
        await firestoreService.updateUserStats(userId, statsPatch);
      } else if (k === LS_KEYS.DARK_MODE || k === LS_KEYS.ONE_CLICK_HAIL_MARYS) {
        const settings = await firestoreService.getUserSettings(userId);
        const currentSettings = settings.success ? settings.data : {};
        const updatedSettings = {
          ...currentSettings,
          darkMode: k === LS_KEYS.DARK_MODE ? v : currentSettings.darkMode,
          oneClickHailMarys: k === LS_KEYS.ONE_CLICK_HAIL_MARYS ? v : currentSettings.oneClickHailMarys
        };
        await firestoreService.updateUserSettings(userId, updatedSettings);
      }
    } catch (error) {
      console.warn('Error writing to Firestore, saving to localStorage only:', error);
    }
  }
  
  // Always save to localStorage as cache/fallback
  try { 
    localStorage.setItem(k, JSON.stringify(v));
  } catch { 
    // If error, silently fail (localStorage might be disabled)
  } 

  if (user) {
    syncAuthCachesForKey(user.uid, k, v);
  }
}

// ========== IRG PROGRESS TRACKING ==========
// 📿 Track user progress through the Interactive Rosary Guide (IRG)
// Supports localStorage (always) and Firebase sync (when authenticated)

// 🕰️ Resolve user's timezone for midnight checks
function getCachedTimeZone() {
  const cached = getLS(LS_KEYS.TIMEZONE, null);
  if (cached) return cached;
  
  const user = window.authService ? window.authService.getCurrentUser() : null;
  if (user) {
    try {
      const settingsCache = localStorage.getItem(`user_settings_${user.uid}`);
      if (settingsCache) {
        const settings = JSON.parse(settingsCache);
        if (settings && settings.timezone) return settings.timezone;
      }
    } catch {
      // Ignore cache parsing errors
    }
  }
  
  return null;
}

async function resolveUserTimeZone() {
  const cached = getCachedTimeZone();
  if (cached) return normalizeTimeZone(cached);
  
  const user = window.authService ? window.authService.getCurrentUser() : null;
  const settingsService = window.firestoreService || null;
  if (user && settingsService) {
    try {
      const settings = await settingsService.getUserSettings(user.uid);
      if (settings.success && settings.data && settings.data.timezone) {
        setLS(LS_KEYS.TIMEZONE, settings.data.timezone);
        return normalizeTimeZone(settings.data.timezone);
      }
    } catch {
      // Ignore settings fetch errors
    }
  }
  
  return normalizeTimeZone(null);
}

function getEffectiveTimeZone() {
  return normalizeTimeZone(getCachedTimeZone());
}

// 🔍 Parse a stored timestamp into a Date (supports Firestore Timestamp)
function parseSavedAt(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value && typeof value.toDate === 'function') {
    const parsed = value.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

// 🔍 Convert a legacy UTC date string (YYYY-MM-DD) to a timezone date string
function legacyUTCDateToTimeZone(dateStr, timeZone) {
  if (typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [year, month, day] = parts;
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(utcDate.getTime())) return null;
  return dateStrInTimeZone(utcDate, timeZone);
}

// 🔍 Resolve last saved date to a timezone day string for midnight checks
function resolveIRGDateInTimeZone(dateStr, savedAt, timeZone) {
  const savedAtDate = parseSavedAt(savedAt);
  if (savedAtDate) return dateStrInTimeZone(savedAtDate, timeZone);
  if (!dateStr) return null;
  return legacyUTCDateToTimeZone(dateStr, timeZone) || dateStr;
}

// 🔍 Check if midnight has passed since last save (user timezone)
// Returns true if the timezone day is different from today's day
function hasMidnightPassed(lastDateStr, savedAt, timeZone) {
  const lastDate = resolveIRGDateInTimeZone(lastDateStr, savedAt, timeZone);
  if (!lastDate) return true; // No date means treat as new day
  const today = dateStrInTimeZone(new Date(), timeZone);
  return lastDate !== today;
}

// Normalize IRG progress data from Firestore.
// Supports both nested and legacy root fields.
function normalizeIRGProgress(userData) {
  if (!userData) return null;
  if (userData.irgProgress && typeof userData.irgProgress === 'object') {
    return userData.irgProgress;
  }
  if (typeof userData.irgStep === 'number') {
    return {
      irgStep: userData.irgStep,
      irgStepDate: userData.irgStepDate,
      irgStepSavedAt: userData.irgStepSavedAt
    };
  }
  return null;
}

// 🔄 Sync IRG progress to Firebase/Firestore (if available and user is authenticated)
// Gracefully falls back to localStorage-only if Firebase is unavailable
async function syncIRGProgressToFirebase(stepIndex, dateStr, savedAt = null) {
  try {
    // Check if Firebase services are available
    // Look for common Firebase service patterns
    const firestoreService = window.firestoreService || 
                            (window.firebase && window.firebase.firestore) ||
                            null;
    
    // Check if user is authenticated
    // Look for common auth service patterns
    const authService = window.authService || 
                       (window.firebase && window.firebase.auth) ||
                       null;
    
    if (!firestoreService || !authService) {
      // Firebase not available, skip sync (will use localStorage only)
      return;
    }
    
    // Check authentication state
    let currentUser = null;
    if (authService.currentUser) {
      currentUser = authService.currentUser;
    } else if (authService.getCurrentUser) {
      currentUser = await authService.getCurrentUser();
    } else if (typeof authService === 'function') {
      // If authService is a function, it might be a getter
      currentUser = authService();
    }
    
    if (!currentUser || !currentUser.uid) {
      // User not authenticated, skip sync
      return;
    }
    
    // Save to Firestore
    const savedAtValue = savedAt || new Date().toISOString();
    const irgProgress = {
      irgStep: stepIndex,
      irgStepDate: dateStr,
      irgStepSavedAt: savedAtValue,
      updatedAt: savedAtValue
    };
    
    if (firestoreService.updateUserData) {
      await firestoreService.updateUserData(currentUser.uid, { irgProgress });
    } else if (firestoreService.collection) {
      // Direct Firestore access pattern
      await firestoreService.collection('users')
        .doc(currentUser.uid)
        .set({ irgProgress }, { merge: true });
    }
  } catch (error) {
    // Silently fail - localStorage will be used as fallback
    console.debug('Firebase sync failed, using localStorage only:', error);
  }
}

// 💾 Save IRG progress (localStorage + optional Firebase sync)
// Always saves to localStorage, also syncs to Firebase if user is authenticated
function saveIRGProgress() {
  const timeZone = getEffectiveTimeZone();
  const dateStr = dateStrInTimeZone(new Date(), timeZone);
  const savedAt = new Date().toISOString();
  
  // Always save to localStorage (works offline)
  setLS(LS_KEYS.IRG_STEP, stepIndex);
  setLS(LS_KEYS.IRG_STEP_DATE, dateStr);
  setLS(LS_KEYS.IRG_STEP_SAVED_AT, savedAt);
  
  // Try to sync to Firebase (non-blocking, graceful fallback)
  syncIRGProgressToFirebase(stepIndex, dateStr, savedAt).catch(() => {
    // Silently handle errors - localStorage is already saved
  });
}

// 📖 Load IRG progress (Firebase first if available, then localStorage)
// Returns the step index to restore, or 0 if no progress or new day
async function loadIRGProgress() {
  const timeZone = await resolveUserTimeZone();
  let remoteStatus = 'unavailable';
  let authenticatedUser = null;
  try {
    // First, try to load from Firebase if available and user is authenticated
    const firestoreService = window.firestoreService || 
                            (window.firebase && window.firebase.firestore) ||
                            null;
    const authService = window.authService || 
                       (window.firebase && window.firebase.auth) ||
                       null;
    
    if (firestoreService && authService) {
      // Check authentication state
      let currentUser = null;
      if (authService.currentUser) {
        currentUser = authService.currentUser;
      } else if (authService.getCurrentUser) {
        currentUser = await authService.getCurrentUser();
      } else if (typeof authService === 'function') {
        currentUser = authService();
      }
      
      if (currentUser && currentUser.uid) {
        authenticatedUser = currentUser;
        // Try to load from Firestore
        try {
          let userData = null;
          if (firestoreService.getUserData) {
            const result = await firestoreService.getUserData(currentUser.uid);
            if (result && result.success) {
              userData = result.data || null;
            } else {
              remoteStatus = 'error';
            }
          } else if (firestoreService.collection) {
            const doc = await firestoreService.collection('users')
              .doc(currentUser.uid)
              .get();
            if (doc.exists) {
              userData = doc.data();
            }
          }
          
          if (remoteStatus !== 'error') {
            remoteStatus = 'missing';
            const irgProgress = normalizeIRGProgress(userData);
            if (irgProgress) {
              const { irgStep, irgStepDate } = irgProgress;
              const irgStepSavedAt = irgProgress.irgStepSavedAt || irgProgress.savedAt || irgProgress.updatedAt || null;
              
              // Validate step index
              if (typeof irgStep === 'number' && irgStep >= 0 && irgStep < GUIDE.length) {
                // Check if midnight has passed
                if (!hasMidnightPassed(irgStepDate, irgStepSavedAt, timeZone)) {
                  // Valid progress from today - cache locally and return it
                  setLS(LS_KEYS.IRG_STEP, irgStep);
                  setLS(LS_KEYS.IRG_STEP_DATE, irgStepDate);
                  if (irgStepSavedAt) {
                    setLS(LS_KEYS.IRG_STEP_SAVED_AT, irgStepSavedAt);
                  } else {
                    setLS(LS_KEYS.IRG_STEP_SAVED_AT, null);
                  }
                  remoteStatus = 'fresh';
                  return irgStep;
                }
                // New day - will fall through to localStorage
                remoteStatus = 'stale';
              }
            }
          }
        } catch (error) {
          // Firebase load failed, fall back to localStorage
          remoteStatus = 'error';
          console.debug('Firebase load failed, using localStorage:', error);
        }
      }
    }
  } catch (error) {
    // Firebase not available or error, fall back to localStorage
    console.debug('Firebase not available, using localStorage:', error);
  }
  
  // Fallback to localStorage
  const savedStep = getLS(LS_KEYS.IRG_STEP, 0);
  const savedDate = getLS(LS_KEYS.IRG_STEP_DATE, null);
  const savedAt = getLS(LS_KEYS.IRG_STEP_SAVED_AT, null);
  
  // Check if midnight has passed
  if (hasMidnightPassed(savedDate, savedAt, timeZone)) {
    return 0; // New day, reset to beginning
  }
  
  // Validate step index
  if (typeof savedStep === 'number' && savedStep >= 0 && savedStep < GUIDE.length) {
    if (authenticatedUser && (remoteStatus === 'missing' || remoteStatus === 'stale')) {
      syncIRGProgressToFirebase(savedStep, savedDate, savedAt).catch(() => {
        // Ignore sync errors - localStorage remains the fallback
      });
    }
    return savedStep;
  }
  
  // Invalid or no saved progress
  return 0;
}

// Synchronous version for backwards compatibility (saves to localStorage, Firestore sync happens async)
function setLS(k, v) {
  // Save to localStorage immediately
  try { 
    localStorage.setItem(k, JSON.stringify(v));
  } catch { 
    // If error, silently fail
  }

  const user = authService ? authService.getCurrentUser() : null;
  if (user) {
    syncAuthCachesForKey(user.uid, k, v);
  }
  
  // Sync to Firestore asynchronously if authenticated
  if (authService && window.firestoreService) {
    setLSAsync(k, v).catch(err => console.warn('Async Firestore sync failed:', err));
  }
}
// 📊 Update the displayed stats (streak, total count, progress bar)
// This reads from localStorage and updates what's shown on screen
function syncStats() { 
  const total = getLS(LS_KEYS.TOTAL, 0);      // Get total count (default 0)
  const streak = getLS(LS_KEYS.STREAK, 0);     // Get streak (default 0)
  totalEl.textContent = total;                 // Update total display
  streakEl.textContent = streak;               // Update streak display
  // Progress bar: fills up every 50 rosaries (2% per rosary, max 100%)
  progressEl.style.width = Math.min(100, (total % 50) * 2) + '%'; 
}

// Ensure total prayer count strictly matches prayer log entry count.
// This self-heals historical drift if stats updates previously failed.
async function reconcileTotalWithPrayerLog(userId, knownStatsTotal = null) {
  if (!userId || !window.firestoreService) return;

  try {
    const prayerLog = await firestoreService.getPrayerLog(userId);
    if (!prayerLog.success || !Array.isArray(prayerLog.data)) return;

    const strictTotal = prayerLog.data.length;
    const localTotal = getLS(LS_KEYS.TOTAL, 0);
    if (localTotal !== strictTotal) {
      setLS(LS_KEYS.TOTAL, strictTotal);
      syncStats();
    }

    const statsTotal = Number.isFinite(knownStatsTotal) ? knownStatsTotal : getLS(LS_KEYS.TOTAL, 0);
    if (statsTotal !== strictTotal) {
      const result = await firestoreService.updateUserStats(userId, { total: strictTotal });
      if (!result.success) {
        console.warn('Failed to reconcile strict total with prayer log:', result.error);
      }
    }
  } catch (error) {
    console.warn('Failed to reconcile strict total from prayer log:', error);
  }
}

// 🎉 Celebration animation and message
// This shows a nice popup when you complete the rosary!
function celebrate() {
  // Create a dark overlay that covers the whole screen
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
  // z-index:10000 means it appears on top of everything

  // Create the celebration message box
  const message = document.createElement('div');
  message.style.cssText = 'background:white;padding:40px 60px;border-radius:20px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:500px;animation:scaleIn 0.4s ease;';
  message.innerHTML = '<div style="font-size:64px;margin-bottom:20px;">🙏✨</div><h2 style="font-size:32px;margin:0 0 16px;color:#1862A8;">Rosary Complete!</h2><p style="font-size:18px;color:#6b7280;margin:0;">Thank you for your devotion. May God bless you.</p>';

  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Add CSS animations (fade in and scale in effects)
  if (!document.getElementById('celebration-styles')) {
    const style = document.createElement('style');
    style.id = 'celebration-styles';
    // Define keyframe animations for smooth appearance
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}';
    document.head.appendChild(style);
  }

  // Remove overlay after 3 seconds (auto-dismiss)
  setTimeout(() => {
    overlay.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => overlay.remove(), 300);
  }, 3000);

  // 🎊 Confetti effect (simple version)
  // Creates 50 colorful circles that fall from the top
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      // Random color from our color palette
      confetti.style.cssText = `position:fixed;width:10px;height:10px;background:${['#1862A8', '#FDDB6F', '#ff6b6b', '#4ecdc4'][Math.floor(Math.random() * 4)]};left:${Math.random() * 100}%;top:-10px;z-index:10001;border-radius:50%;pointer-events:none;`;
      document.body.appendChild(confetti);
      // Random duration and end position
      const duration = 2000 + Math.random() * 1000;
      const endX = Math.random() * window.innerWidth;
      const endY = window.innerHeight + 100;
      // Animate the confetti falling and rotating
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${endX - parseFloat(confetti.style.left) * window.innerWidth / 100}px, ${endY}px) rotate(720deg)`, opacity: 0 }
      ], { duration, easing: 'ease-out' }).onfinish = () => confetti.remove();
    }, i * 30);  // Stagger the confetti (each one starts 30ms after the previous)
  }
}

// 📝 Log rosary: Record that you prayed the rosary today
// Tracks streaks (consecutive days) and total count
// showCelebration: whether to show the celebration popup
async function logRosary(showCelebration = false) {
  const today = todayStr();                        // Today's date string
  const user = authService ? authService.getCurrentUser() : null;
  
  // Check if already logged today - check both stats and prayer log
  let alreadyLogged = false;
  let currentStats = { total: 0, streak: 0, lastDate: null };
  let knownLogDates = [];
  let knownLogCount = null;
  
  if (user && window.firestoreService) {
    // For authenticated users, check Firestore prayer log first
    try {
      const prayerLog = await firestoreService.getPrayerLog(user.uid);
      if (prayerLog.success) {
        knownLogCount = prayerLog.data.length;
        knownLogDates = prayerLog.data.map(getPrayerEntryDate).filter(Boolean);
        if (knownLogDates.includes(today)) {
          alreadyLogged = true;
        }
      }
      
      // Get current stats from Firestore
      const stats = await firestoreService.getUserStats(user.uid);
      if (stats.success) {
        currentStats = stats.data;
        // Also check if lastDate matches today
        if (currentStats.lastDate === today) {
          alreadyLogged = true;
        }
      }
    } catch (error) {
      console.warn('Error checking Firestore data:', error);
      // Fall back to localStorage check
      const last = getLS(LS_KEYS.LAST_DATE, null);
      const fallbackLog = getLS(LS_KEYS.LOG, []);
      knownLogDates = fallbackLog.map(entry => entry?.date).filter(Boolean);
      knownLogCount = fallbackLog.length;
      if (last === today) {
        alreadyLogged = true;
      }
      currentStats = {
        total: getLS(LS_KEYS.TOTAL, 0),
        streak: getLS(LS_KEYS.STREAK, 0),
        lastDate: last
      };
    }
  } else {
    // For non-authenticated users, check localStorage
    const log = getLS(LS_KEYS.LOG, []);
    knownLogDates = log.map(entry => entry?.date).filter(Boolean);
    knownLogCount = log.length;
    const last = getLS(LS_KEYS.LAST_DATE, null);
    if (last === today || knownLogDates.includes(today)) {
      alreadyLogged = true;
    }
    currentStats = {
      total: getLS(LS_KEYS.TOTAL, 0),
      streak: getLS(LS_KEYS.STREAK, 0),
      lastDate: last
    };
  }
  
  if (alreadyLogged) {
    if (showCelebration) {
      alert('You already logged today 🙌');
    }
    return false;  // Don't log again
  }
  
  // Calculate new streak.
  // Any successful new log should show at least day 1 immediately.
  let newStreak = 1;
  if (knownLogDates.length > 0) {
    newStreak = calculateStreakFromDates(knownLogDates.concat(today), today);
  }

  // Fallback when prayer-log dates are unavailable.
  if ((!newStreak || newStreak < 1) && currentStats.lastDate) {
    // Check if last log was yesterday (to continue streak)
    const y = new Date(); 
    y.setDate(y.getDate() - 1);  // Yesterday's date
    if (localDateStr(y) === currentStats.lastDate) {
      newStreak = (currentStats.streak || 0) + 1;  // Continue streak
    } else {
      newStreak = 1;
    }
  }

  if (!newStreak || newStreak < 1) {
    newStreak = 1;
  }
  
  let newTotal = (currentStats.total || 0) + 1;
  if (typeof knownLogCount === 'number') {
    newTotal = Math.max(newTotal, knownLogCount + 1);
  }
  
  // Update Firestore first for authenticated users.
  // This prevents optimistic UI updates that later revert if remote writes fail.
  if (user && window.firestoreService) {
    try {
      // Add to prayer log first (this checks for duplicates)
      const logResult = await firestoreService.addPrayerLogEntry(user.uid, {
        date: today,
        notes: 'Rosary prayed'
      });
      
      // If entry already exists, don't proceed with logging
      if (!logResult.success && logResult.error === 'Entry already exists for this date') {
        if (showCelebration) {
          alert('You already logged today 🙌');
        }
        return false;
      }

      if (!logResult.success) {
        console.warn('Failed to add prayer log entry:', logResult.error);
        if (showCelebration) {
          alert(`Could not save prayer log entry: ${logResult.error || 'unknown error'}`);
        }
        return false;
      }
      
      // Update stats in Firestore
      const statsResult = await firestoreService.updateUserStats(user.uid, {
        total: newTotal,
        streak: newStreak,
        lastDate: today
      });

      if (!statsResult.success) {
        console.warn('Failed to update stats:', statsResult.error);
        if (showCelebration) {
          alert(`Could not update stats: ${statsResult.error || 'unknown error'}`);
        }
        return false;
      }
    } catch (error) {
      console.warn('Failed to update Firestore:', error);
      if (showCelebration) {
        alert(`Could not save to Firebase: ${error.message || error}`);
      }
      return false;
    }
  }

  // Save updated stats to local cache after successful remote sync (or for local-only users)
  setLS(LS_KEYS.LAST_DATE, today);      // Update last date
  setLS(LS_KEYS.TOTAL, newTotal);       // Increment total
  setLS(LS_KEYS.STREAK, newStreak);     // Update streak
  
  // Update the display
  syncStats();
  
  // Show celebration if requested
  if (showCelebration) {
    celebrate();
    // Reset IRG progress when rosary is completed
    // This ensures users start from the beginning next time
    if (stepIndex === GUIDE.length - 1) {
      stepIndex = 0;
      saveIRGProgress();
    }
  }
  return true;
}

// ✅ Log button: Record that you prayed the rosary today
// This is the button in the sidebar stats card
document.getElementById('logBtn').addEventListener('click', () => {
  logRosary(true);  // Log with celebration
});

// ========== DARK MODE FUNCTIONALITY ==========
// 🌙 Dark mode toggle functionality

// Toggle dark mode on/off
function toggleDarkMode() {
  const isDarkMode = htmlRootEl.classList.toggle('dark-mode');
  // Update button emoji: 🌙 when light mode, ☀️ when dark mode
  darkModeToggleEl.textContent = isDarkMode ? '☀️' : '🌙';
  // Save preference to localStorage
  setLS(LS_KEYS.DARK_MODE, isDarkMode);
}

// Initialize dark mode based on saved preference
function initDarkMode() {
  const savedDarkMode = getLS(LS_KEYS.DARK_MODE, false);
  if (savedDarkMode) {
    htmlRootEl.classList.add('dark-mode');
    darkModeToggleEl.textContent = '☀️';
  } else {
    htmlRootEl.classList.remove('dark-mode');
    darkModeToggleEl.textContent = '🌙';
  }
}

// Dark mode toggle button event listener
darkModeToggleEl.addEventListener('click', toggleDarkMode);

// ========== "NEW TO THE ROSARY" SECTION FUNCTIONALITY ==========
// 👋 Allow users to dismiss the "New to the Rosary?" section

// Initialize "New to the Rosary?" section visibility
function initNewToRosarySection() {
  const newToRosarySection = document.getElementById('newToRosarySection');
  const showLink = document.getElementById('showNewToRosaryLink');
  if (!newToRosarySection) return;
  
  const shouldHide = getLS(LS_KEYS.HIDE_NEW_TO_ROSARY, false);
  if (shouldHide) {
    newToRosarySection.style.display = 'none';
    // Show the restore link in footer
    if (showLink) {
      showLink.style.display = 'inline';
    }
  } else {
    // Hide the restore link if section is visible
    if (showLink) {
      showLink.style.display = 'none';
    }
  }
}

// Dismiss the "New to the Rosary?" section
function dismissNewToRosarySection() {
  const newToRosarySection = document.getElementById('newToRosarySection');
  const showLink = document.getElementById('showNewToRosaryLink');
  if (!newToRosarySection) return;
  
  // Hide the section
  newToRosarySection.style.display = 'none';
  
  // Show the restore link in footer
  if (showLink) {
    showLink.style.display = 'inline';
  }
  
  // Save preference to localStorage
  setLS(LS_KEYS.HIDE_NEW_TO_ROSARY, true);
}

// Dismiss button event listener
const dismissNewToRosaryBtn = document.getElementById('dismissNewToRosary');
if (dismissNewToRosaryBtn) {
  dismissNewToRosaryBtn.addEventListener('click', dismissNewToRosarySection);
}

// Show the "New to the Rosary?" section again (for testing/resetting)
function showNewToRosarySection() {
  const newToRosarySection = document.getElementById('newToRosarySection');
  const showLink = document.getElementById('showNewToRosaryLink');
  if (!newToRosarySection) return;
  
  // Show the section
  newToRosarySection.style.display = '';
  
  // Hide the restore link in footer
  if (showLink) {
    showLink.style.display = 'none';
  }
  
  // Clear the preference from localStorage
  setLS(LS_KEYS.HIDE_NEW_TO_ROSARY, false);
  
  // Scroll to the section so user can see it
  newToRosarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log('✅ "New to the Rosary?" section is now visible again');
}

// Make it available globally for easy console access
window.showNewToRosarySection = showNewToRosarySection;

// ========== 1-CLICK HAIL MARYS TOGGLE FUNCTIONALITY ==========
// ⚙️ Toggle for 1-click Hail Marys feature

// Initialize 1-click Hail Marys toggle based on saved preference
function initOneClickHailMarysToggle() {
  if (!oneClickHailMarysToggleEl) return;
  
  const savedPreference = getLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, false);
  oneClickHailMarysToggleEl.checked = savedPreference;
}

// Toggle 1-click Hail Marys on/off
function toggleOneClickHailMarys() {
  if (!oneClickHailMarysToggleEl) return;
  
  const isEnabled = oneClickHailMarysToggleEl.checked;
  setLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, isEnabled);
  
  // Re-render step to update button text if needed
  renderStep();
}

// 1-click Hail Marys toggle event listener
if (oneClickHailMarysToggleEl) {
  oneClickHailMarysToggleEl.addEventListener('change', toggleOneClickHailMarys);
}

// ========== INITIALIZE APP ==========
// 🚀 Start the application when page loads
// This runs automatically when the page finishes loading

// Initialize with Firebase if available
async function initializeApp() {
  initDarkMode(); // Initialize dark mode first
  initOneClickHailMarysToggle();
  
  // If authenticated, load stats from Firestore
  if (window.authService && window.firestoreService) {
    const user = window.authService.getCurrentUser();
    if (user) {
      try {
        // Load and sync stats from Firestore
        const stats = await firestoreService.getUserStats(user.uid);
        const knownStatsTotal = (stats.success && stats.data && Number.isFinite(stats.data.total))
          ? stats.data.total
          : null;
        if (stats.success && stats.data) {
          // Update localStorage cache with Firestore data (this is the source of truth)
          const firestoreTotal = stats.data.total || 0;
          const firestoreStreak = stats.data.streak || 0;
          const firestoreLastDate = stats.data.lastDate || null;
          
          setLS(LS_KEYS.TOTAL, firestoreTotal);
          setLS(LS_KEYS.STREAK, firestoreStreak);
          setLS(LS_KEYS.LAST_DATE, firestoreLastDate);
          
          // Update display
          syncStats();
        } else {
          // No stats in Firestore yet, use localStorage
          syncStats();
        }

        // Self-heal any historical total drift by counting real prayer-log entries.
        await reconcileTotalWithPrayerLog(user.uid, knownStatsTotal);
        
        // Load and sync settings
        const settings = await firestoreService.getUserSettings(user.uid);
        if (settings.success) {
          if (settings.data.darkMode !== undefined) {
            setLS(LS_KEYS.DARK_MODE, settings.data.darkMode);
            // Update dark mode UI
            const htmlRootEl = document.documentElement;
            const darkModeToggleEl = document.getElementById('darkModeToggle');
            if (settings.data.darkMode) {
              htmlRootEl.classList.add('dark-mode');
              if (darkModeToggleEl) darkModeToggleEl.textContent = '☀️';
            } else {
              htmlRootEl.classList.remove('dark-mode');
              if (darkModeToggleEl) darkModeToggleEl.textContent = '🌙';
            }
          }
          if (settings.data.oneClickHailMarys !== undefined) {
            setLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, settings.data.oneClickHailMarys);
            // Update toggle UI
            const toggleEl = document.getElementById('oneClickHailMarysToggle');
            if (toggleEl) toggleEl.checked = settings.data.oneClickHailMarys;
          }
          if (settings.data.timezone) {
            setLS(LS_KEYS.TIMEZONE, settings.data.timezone);
          }
        }
        
        // Set up real-time listeners for stats updates
        firestoreService.listenToStats(user.uid, (result) => {
          if (result.success) {
            if (result.data.total !== undefined) {
              setLS(LS_KEYS.TOTAL, result.data.total);
              syncStats();
            }
            if (result.data.streak !== undefined) {
              setLS(LS_KEYS.STREAK, result.data.streak);
              syncStats();
            }
            if (result.data.lastDate !== undefined) {
              setLS(LS_KEYS.LAST_DATE, result.data.lastDate);
            }
          }
        });
        
        // Set up real-time listener for settings updates
        firestoreService.listenToSettings(user.uid, (result) => {
          if (result.success) {
            if (result.data.darkMode !== undefined) {
              setLS(LS_KEYS.DARK_MODE, result.data.darkMode);
              const htmlRootEl = document.documentElement;
              const darkModeToggleEl = document.getElementById('darkModeToggle');
              if (result.data.darkMode) {
                htmlRootEl.classList.add('dark-mode');
                if (darkModeToggleEl) darkModeToggleEl.textContent = '☀️';
              } else {
                htmlRootEl.classList.remove('dark-mode');
                if (darkModeToggleEl) darkModeToggleEl.textContent = '🌙';
              }
            }
            if (result.data.oneClickHailMarys !== undefined) {
              setLS(LS_KEYS.ONE_CLICK_HAIL_MARYS, result.data.oneClickHailMarys);
              const toggleEl = document.getElementById('oneClickHailMarysToggle');
              if (toggleEl) toggleEl.checked = result.data.oneClickHailMarys;
            }
            if (result.data.timezone) {
              setLS(LS_KEYS.TIMEZONE, result.data.timezone);
            }
          }
        });
      } catch (error) {
        console.warn('Error loading data from Firestore:', error);
        // Continue with localStorage data
        syncStats();
      }
    } else {
      // Not authenticated, use localStorage
      syncStats();
    }
  } else {
    // Firebase not available, use localStorage
    syncStats();
  }
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    hydrateUI();
  });
} else {
  (async () => {
    await initializeApp();
    hydrateUI();
  })();
}

// Refresh IRG progress after auth state is known
async function refreshIRGProgressFromAuth() {
  const savedStep = await loadIRGProgress();
  if (typeof savedStep === 'number' && savedStep !== stepIndex) {
    stepIndex = savedStep;
    renderStep();
  }
}

if (window.authService && authService.onAuthStateChanged) {
  authService.onAuthStateChanged((user) => {
    if (user) {
      refreshIRGProgressFromAuth();
    }
  });
}

// Set up restore link event listener after DOM is ready
// This ensures the footer link exists before we try to attach the listener
const restoreNewToRosaryLink = document.getElementById('restoreNewToRosaryLink');
if (restoreNewToRosaryLink) {
  restoreNewToRosaryLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    showNewToRosarySection();
  });
}

