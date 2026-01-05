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
  "3× Hail Mary (Faith, Hope, Charity)": "Hail_Mary.png",
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

// 📅 Helper function: Get today's date in YYYY-MM-DD format
// Returns a string like "2024-01-15"
const todayStr = () => new Date().toISOString().slice(0, 10);

// 💾 LocalStorage keys for persistence
// localStorage is browser storage that saves data between visits
// These are the "keys" (like variable names) we use to store/retrieve data
const LS_KEYS = { 
  TOTAL: 'rosary_total_v1',      // Total count of rosaries prayed
  LAST_DATE: 'rosary_last_date_v1', // Date of last rosary
  STREAK: 'rosary_streak_v1',    // Current streak count
  DARK_MODE: 'dark_mode_v1'      // Dark mode preference
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
  { title: '3× Hail Mary (Faith, Hope, Charity)', text: () => PRAYERS.hailMary + 'Repeat 3 times with these intentions.' },
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
// 🛠️ Helper functions that do specific tasks

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

// 📚 Dynamically build the Common Prayers section
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
    h2.textContent = 'Common Prayers';
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
  
  // For Hail Mary steps, show visual beads instead of just "#/10"
  if (step.isHailMary && step.hailMaryNumber) {
    // Generate the bead visualization (shows progress through the 10 Hail Marys)
    stepTitleEl.innerHTML = `Hail Mary ${generateBeads(step.hailMaryNumber)}`;
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
  
  // Check if prayer text exceeds threshold and enable scrolling if needed
  if (PRAYER_SCROLL_THRESHOLD_LINES < 999) {
    // Remove scrollable class first to get accurate measurements
    prayerTextEl.classList.remove('scrollable');
    
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
    } else {
      // Reset max-height if scrolling is not needed
      prayerTextEl.style.maxHeight = '';
    }
  } else {
    // Threshold is disabled (set to 999 or higher), remove scrollable class
    prayerTextEl.classList.remove('scrollable');
    prayerTextEl.style.maxHeight = '';
  }
  
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
      jumpBtnEl.textContent = 'Jump to Next Decade';
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
  if (isFinalStep) {
    nextBtnEl.textContent = 'Log Today\'s Rosary';
  } else {
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
function hydrateUI() {
  // Set today's mystery name in the hero section
  todayMysteryEl.textContent = TODAY_SET;
  // Set the mystery badge (e.g., "Joyful Mysteries")
  mysteryBadgeEl.textContent = TODAY_SET + ' Mysteries';
  // Build and display the mysteries accordion
  renderMysteryAccordion();
  // Build and display the common prayers section
  renderCommonPrayers();
  // Show the first step of the rosary
  renderStep();
  // Update the stats (streak, total, progress bar)
  syncStats();

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
    // Otherwise, move to the next step
    // Math.min ensures we never go past the last step
    stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
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
    // Otherwise, move to the next step
    // Math.min ensures we never go past the last step
    stepIndex = Math.min(GUIDE.length - 1, stepIndex + 1);
    renderStep();  // Update the display
  }
});

// ⬅️ Previous button: Go back to previous step
document.getElementById('prevBtn').addEventListener('click', () => { 
  // Math.max ensures we never go below 0 (first step)
  stepIndex = Math.max(0, stepIndex - 1); 
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
    renderStep();
  }
});

// 🔄 Restart button: Return to the first step of the guide
restartBtnEl.addEventListener('click', () => {
  stepIndex = 0;  // Go back to beginning
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
    renderStep(); 
  } 
  if (e.key === 'ArrowLeft') { 
    // Left arrow = previous step
    stepIndex = Math.max(0, stepIndex - 1); 
    renderStep(); 
  } 
});

// ========== LOCALSTORAGE & STATS ==========
// 💾 localStorage is browser storage that persists between page visits
// It's like a tiny database that lives in your browser

// 📖 Helper function to read from localStorage
// k = key (the name), f = fallback (default value if nothing found)
function getLS(k, f) { 
  try { 
    const v = localStorage.getItem(k);  // Try to get the value
    return v === null ? f : JSON.parse(v);  // If null, return fallback; otherwise parse JSON
  } catch { 
    return f;  // If error, return fallback
  } 
}

// 💾 Helper function to write to localStorage
// k = key (the name), v = value (the data to save)
function setLS(k, v) { 
  try { 
    localStorage.setItem(k, JSON.stringify(v));  // Convert to JSON string and save
  } catch { 
    // If error, silently fail (localStorage might be disabled)
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
function logRosary(showCelebration = false) {
  // Get current stats from localStorage
  const last = getLS(LS_KEYS.LAST_DATE, null);    // Date of last rosary
  const total = getLS(LS_KEYS.TOTAL, 0);          // Total count
  const streak = getLS(LS_KEYS.STREAK, 0);         // Current streak
  const today = todayStr();                        // Today's date string
  
  // Check if already logged today
  if (last === today) {
    if (showCelebration) {
      alert('You already logged today 🙌');
    }
    return false;  // Don't log again
  }
  
  // Calculate new streak
  let newStreak = 1;  // Default to 1 if no previous log
  if (last) { 
    // Check if last log was yesterday (to continue streak)
    const y = new Date(); 
    y.setDate(y.getDate() - 1);  // Yesterday's date
    if (y.toISOString().slice(0, 10) === last) {
      newStreak = streak + 1;  // Continue streak
    }
    // If last log was not yesterday, streak resets to 1
  }
  
  // Save updated stats to localStorage
  setLS(LS_KEYS.LAST_DATE, today);      // Update last date
  setLS(LS_KEYS.TOTAL, total + 1);      // Increment total
  setLS(LS_KEYS.STREAK, newStreak);     // Update streak
  
  // Update the display
  syncStats();
  
  // Show celebration if requested
  if (showCelebration) {
    celebrate();
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

// ========== INITIALIZE APP ==========
// 🚀 Start the application when page loads
// This runs automatically when the page finishes loading
initDarkMode(); // Initialize dark mode first
hydrateUI();

