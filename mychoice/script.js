// Language support
const translations = {
    en: {
        appTitle: "My Choice",
        categoryAll: "All",
        categoryHydration: "💧 Hydration",
        categoryDistraction: "🔄 Distraction", 
        categoryMindset: "🧠 Mindset",
        helpMeNow: "Help Me Now",
        saveAsFavorite: "Save as Favorite",
        savedAsFavorite: "Saved!",
        alreadySaved: "Already Saved!",
        yourTip: "Your Tip",
        savedFavorites: "Saved Favorites",
        noFavoritesYet: "No favorites saved yet.",
        clickHelpMe: "Click \"Help Me Now\" to get a helpful tip!",
        remove: "🗑️"
    },
    no: {
        appTitle: "Mitt Valg",
        categoryAll: "Alle",
        categoryHydration: "💧 Væske",
        categoryDistraction: "🔄 Avledning",
        categoryMindset: "🧠 Tankesett",
        helpMeNow: "Hjelp meg nå",
        saveAsFavorite: "Lagre som favoritt",
        savedAsFavorite: "Lagret!",
        alreadySaved: "Allerede lagret!",
        yourTip: "Ditt tips",
        savedFavorites: "Lagrede favoritter",
        noFavoritesYet: "Ingen favoritter lagret ennå.",
        clickHelpMe: "Klikk \"Hjelp meg nå\" for å få et nyttig tips!",
        remove: "🗑️"
    }
};

// Array of tips with text and category (English)
const tipsEN = [
    // Hydration tips
    { text: "💧 Drink a large glass of water slowly. Sometimes cravings are just thirst in disguise.", category: "hydration" },
    { text: "🍋 Try sparkling water with a slice of lemon or lime for a refreshing alternative.", category: "hydration" },
    { text: "🍵 Have a cup of herbal tea. The warmth and flavor can satisfy your craving.", category: "hydration" },
    { text: "🥥 Drink coconut water for natural electrolytes and a subtle sweet taste.", category: "hydration" },
    { text: "🧊 Try ice-cold water with cucumber slices for a spa-like refreshing experience.", category: "hydration" },
    { text: "🌡️ Sip on warm water with a squeeze of lemon to calm your stomach.", category: "hydration" },
    { text: "🫐 Infuse your water with berries or mint for a natural flavor boost.", category: "hydration" },
    { text: "🍶 Carry a water bottle and take small sips every few minutes.", category: "hydration" },
    { text: "🍽️ Drink a glass of water before every meal to feel fuller.", category: "hydration" },
    { text: "✨ Try a calorie-free flavored water if you crave something sweet.", category: "hydration" },
    { text: "🍲 Have a warm broth-based drink to soothe hunger pangs.", category: "hydration" },
    { text: "🔄 Alternate between water and herbal tea throughout the day.", category: "hydration" },
    { text: "🧂 Add a pinch of salt to your water if you've been sweating a lot.", category: "hydration" },
    { text: "⏰ Drink water before deciding to snack—wait 10 minutes after.", category: "hydration" },
    { text: "🖥️ Keep a glass of water at your desk and refill it often.", category: "hydration" },
    { text: "🥂 Try sparkling water in a fancy glass to make it feel special.", category: "hydration" },
    { text: "🥤 Drink water with a straw—it can make you drink more without noticing.", category: "hydration" },
    { text: "🌅 Start your day with a big glass of water before coffee or tea.", category: "hydration" },
    { text: "⏲️ Set a timer to remind yourself to drink water every hour.", category: "hydration" },
    { text: "🎯 Challenge yourself to finish a water bottle before lunch.", category: "hydration" },

    // Distraction tips
    { text: "🌬️ Take 10 deep breaths and count them slowly. Focus only on your breathing.", category: "distraction" },
    { text: "🚶 Go for a 5-minute walk, even if it's just around your home or office.", category: "distraction" },
    { text: "📞 Call or text someone you care about. Connection can shift your focus.", category: "distraction" },
    { text: "🏃 Do 20 jumping jacks or push-ups to get your blood flowing.", category: "distraction" },
    { text: "🎵 Listen to your favorite song and really focus on the lyrics or melody.", category: "distraction" },
    { text: "📝 Write down 3 things you're grateful for right now.", category: "distraction" },
    { text: "🗂️ Organize a small area of your home—like a drawer or shelf.", category: "distraction" },
    { text: "🧩 Play a quick brain game or puzzle on your phone.", category: "distraction" },
    { text: "🪥 Brush your teeth to reset your taste buds and freshen your mouth.", category: "distraction" },
    { text: "🧘 Do a quick stretch routine to release tension.", category: "distraction" },
    { text: "😂 Watch a short funny video to lift your mood.", category: "distraction" },
    { text: "🌳 Step outside and get some fresh air for a few minutes.", category: "distraction" },
    { text: "👕 Fold laundry or do a small household chore.", category: "distraction" },
    { text: "📖 Read a few pages of a book or an article you enjoy.", category: "distraction" },
    { text: "✏️ Sketch or doodle something creative for 5 minutes.", category: "distraction" },
    { text: "👀 Practice a quick mindfulness exercise—notice 5 things around you.", category: "distraction" },
    { text: "🥗 Plan your next meal in a healthy way instead of snacking.", category: "distraction" },
    { text: "📔 Write down your craving in a journal and how you feel.", category: "distraction" },
    { text: "🏠 Do a quick tidy-up of your workspace or living room.", category: "distraction" },
    { text: "📸 Look at old photos that make you happy.", category: "distraction" },

    // Mindset tips
    { text: "⏳ Remind yourself: 'This craving is temporary and will pass.'", category: "mindset" },
    { text: "❓ Ask yourself: 'What am I really hungry for?' It might be comfort, not food.", category: "mindset" },
    { text: "🎯 Remember your goals and why you started this journey.", category: "mindset" },
    { text: "💪 Tell yourself: 'I am in control of my choices and I choose what's best for me.'", category: "mindset" },
    { text: "😊 Think about how proud you'll feel in 30 minutes if you don't give in to this craving.", category: "mindset" },
    { text: "🤗 Practice self-compassion. You're human, and cravings are normal.", category: "mindset" },
    { text: "🔮 Visualize your future self achieving your health goals.", category: "mindset" },
    { text: "💭 Repeat a positive affirmation like 'I am stronger than this craving.'", category: "mindset" },
    { text: "🚫 Remind yourself that one snack won't fix stress or boredom.", category: "mindset" },
    { text: "📈 Think about how much effort you've already put into your progress.", category: "mindset" },
    { text: "🤔 Ask: 'Will this choice bring me closer to my goal or further away?'", category: "mindset" },
    { text: "🌅 Imagine how good it feels to wake up tomorrow without regret.", category: "mindset" },
    { text: "⏱️ Focus on the fact that cravings usually last only 10-15 minutes.", category: "mindset" },
    { text: "⏰ Tell yourself: 'I can eat later if I still want it, but I'll wait for now.'", category: "mindset" },
    { text: "🎉 Celebrate small wins—every craving resisted is progress.", category: "mindset" },
    { text: "⚡ Think about the non-scale victories you're aiming for (energy, confidence).", category: "mindset" },
    { text: "🆚 Remind yourself that hunger and craving are not the same thing.", category: "mindset" },
    { text: "🍽️ Picture yourself enjoying a healthy meal later instead of snacking now.", category: "mindset" },
    { text: "✨ Say: 'I deserve to feel good, not guilty.'", category: "mindset" },
    { text: "💎 Remember: 'Discomfort is temporary, but results last.'", category: "mindset" }
];

// Norwegian tips
const tipsNO = [
    // Væsketips
    { text: "💧 Drikk et stort glass vann sakte. Noen ganger er sug bare tørst i forkledning.", category: "hydration" },
    { text: "🍋 Prøv boblende vann med en skive sitron eller lime som et forfriskende alternativ.", category: "hydration" },
    { text: "🍵 Ta deg en kopp urte-te. Varmen og smaken kan tilfredsstille suget ditt.", category: "hydration" },
    { text: "🥥 Drikk kokosmelk for naturlige elektrolytter og en mild søt smak.", category: "hydration" },
    { text: "🧊 Prøv isskald vann med agurk-skiver for en spa-lignende forfriskende opplevelse.", category: "hydration" },
    { text: "🌡️ Sipp på varmt vann med en skvett sitron for å roe magen.", category: "hydration" },
    { text: "🫐 Tilsett bær eller mynte i vannet ditt for en naturlig smaksboost.", category: "hydration" },
    { text: "🍶 Bær en vannflaske og ta små slurker hvert par minutt.", category: "hydration" },
    { text: "🍽️ Drikk et glass vann før hvert måltid for å føle deg mer mett.", category: "hydration" },
    { text: "✨ Prøv kalorifattig smakstilsatt vann hvis du har sug etter noe søtt.", category: "hydration" },
    { text: "🍲 Ta en varm buljongsbasert drikk for å lindre sult.", category: "hydration" },
    { text: "🔄 Veksle mellom vann og urte-te gjennom dagen.", category: "hydration" },
    { text: "🧂 Tilsett en klype salt i vannet hvis du har svettet mye.", category: "hydration" },
    { text: "⏰ Drikk vann før du bestemmer deg for å snakse—vent 10 minutter etterpå.", category: "hydration" },
    { text: "🖥️ Ha et glass vann på skrivebordet og fyll det opp ofte.", category: "hydration" },
    { text: "🥂 Prøv boblende vann i et fancy glass for å gjøre det spesielt.", category: "hydration" },
    { text: "🥤 Drikk vann med sugerør—det kan få deg til å drikke mer uten å legge merke til det.", category: "hydration" },
    { text: "🌅 Start dagen med et stort glass vann før kaffe eller te.", category: "hydration" },
    { text: "⏲️ Sett en timer for å minne deg selv på å drikke vann hver time.", category: "hydration" },
    { text: "🎯 Utfordre deg selv til å tømme en vannflaske før lunsj.", category: "hydration" },

    // Avledningstips
    { text: "🌬️ Ta 10 dype åndedrag og tell dem sakte. Fokuser bare på pusten din.", category: "distraction" },
    { text: "🚶 Gå en 5-minutters tur, selv om det bare er rundt hjemmet eller kontoret.", category: "distraction" },
    { text: "📞 Ring eller send melding til noen du bryr deg om. Kontakt kan endre fokuset ditt.", category: "distraction" },
    { text: "🏃 Gjør 20 hopp eller push-ups for å få blodet i sirkulasjon.", category: "distraction" },
    { text: "🎵 Lytt til favorittsangen din og fokuser virkelig på teksten eller melodien.", category: "distraction" },
    { text: "📝 Skriv ned 3 ting du er takknemlig for akkurat nå.", category: "distraction" },
    { text: "🗂️ Organiser et lite område av hjemmet ditt—som en skuff eller hylle.", category: "distraction" },
    { text: "🧩 Spill et raskt hjernespill eller puslespill på telefonen din.", category: "distraction" },
    { text: "🪥 Puss tennene for å nullstille smaksløkene og friske opp munnen.", category: "distraction" },
    { text: "🧘 Gjør en rask tøyningsrutine for å slippe spenning.", category: "distraction" },
    { text: "😂 Se en kort morsom video for å løfte stemningen.", category: "distraction" },
    { text: "🌳 Gå ut og få litt frisk luft i noen få minutter.", category: "distraction" },
    { text: "👕 Brett klær eller gjør en liten husoppgave.", category: "distraction" },
    { text: "📖 Les noen få sider av en bok eller en artikkel du liker.", category: "distraction" },
    { text: "✏️ Skisser eller krible noe kreativt i 5 minutter.", category: "distraction" },
    { text: "👀 Øv på en rask mindfulness-øvelse—legg merke til 5 ting rundt deg.", category: "distraction" },
    { text: "🥗 Planlegg neste måltid på en sunn måte i stedet for å snakse.", category: "distraction" },
    { text: "📔 Skriv ned suget ditt i en dagbok og hvordan du føler deg.", category: "distraction" },
    { text: "🏠 Gjør en rask opprydning av arbeidsplassen eller stuen.", category: "distraction" },
    { text: "📸 Se på gamle bilder som gjør deg glad.", category: "distraction" },

    // Tankesett-tips
    { text: "⏳ Minn deg selv: 'Dette suget er midlertidig og vil gå over.'", category: "mindset" },
    { text: "❓ Spør deg selv: 'Hva er jeg egentlig sulten på?' Det kan være trøst, ikke mat.", category: "mindset" },
    { text: "🎯 Husk målene dine og hvorfor du startet denne reisen.", category: "mindset" },
    { text: "💪 Si til deg selv: 'Jeg har kontroll over valgene mine og jeg velger det som er best for meg.'", category: "mindset" },
    { text: "😊 Tenk på hvor stolt du vil føle deg om 30 minutter hvis du ikke gir etter for dette suget.", category: "mindset" },
    { text: "🤗 Øv selvmedfølelse. Du er menneske, og sug er normalt.", category: "mindset" },
    { text: "🔮 Visualiser ditt fremtidige selv som oppnår helsemålene dine.", category: "mindset" },
    { text: "💭 Gjenta en positiv bekreftelse som 'Jeg er sterkere enn dette suget.'", category: "mindset" },
    { text: "🚫 Minn deg selv på at én snacks ikke vil fikse stress eller kjedsomhet.", category: "mindset" },
    { text: "📈 Tenk på hvor mye innsats du allerede har lagt ned i fremgangen din.", category: "mindset" },
    { text: "🤔 Spør: 'Vil dette valget bringe meg nærmere målet mitt eller lenger unna?'", category: "mindset" },
    { text: "🌅 Forestill deg hvor godt det føles å våkne i morgen uten anger.", category: "mindset" },
    { text: "⏱️ Fokuser på at sug vanligvis bare varer 10-15 minutter.", category: "mindset" },
    { text: "⏰ Si til deg selv: 'Jeg kan spise senere hvis jeg fortsatt vil ha det, men jeg venter nå.'", category: "mindset" },
    { text: "🎉 Feir små seire—hvert sug du motstår er fremgang.", category: "mindset" },
    { text: "⚡ Tenk på ikke-vekt-relaterte seire du sikter mot (energi, selvtillit).", category: "mindset" },
    { text: "🆚 Minn deg selv på at sult og sug ikke er det samme.", category: "mindset" },
    { text: "🍽️ Se for deg at du nyter et sunt måltid senere i stedet for å snakse nå.", category: "mindset" },
    { text: "✨ Si: 'Jeg fortjener å føle meg bra, ikke skyldig.'", category: "mindset" },
    { text: "💎 Husk: 'Ubehag er midlertidig, men resultater varer.'", category: "mindset" }
];

let currentLanguage = 'en';
let currentTip = null;

// DOM elements
const categorySelect = document.getElementById('categorySelect');
const helpButton = document.getElementById('helpButton');
const tipDisplay = document.getElementById('tipDisplay');
const saveFavoriteButton = document.getElementById('saveFavoriteButton');
const favoritesList = document.getElementById('favoritesList');

// LocalStorage helper functions (more reliable for local development)
function setStorage(name, value) {
    try {
        localStorage.setItem(name, value);
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getStorage(name) {
    try {
        return localStorage.getItem(name);
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Get current tips based on language
function getCurrentTips() {
    return currentLanguage === 'en' ? tipsEN : tipsNO;
}

// Function to translate a tip from one language to another
function translateTip(tip, targetLanguage) {
    // If tip has stored index, use it for reliable translation
    if (tip.tipIndex !== undefined && tip.tipIndex >= 0) {
        const targetArray = targetLanguage === 'en' ? tipsEN : tipsNO;
        if (targetArray[tip.tipIndex]) {
            return {
                text: targetArray[tip.tipIndex].text,
                category: targetArray[tip.tipIndex].category
            };
        }
    }
    
    // Fallback: try to find the tip by matching text and category
    let tipIndex = -1;
    
    // Check English array first
    tipIndex = tipsEN.findIndex(t => 
        t.text === tip.text && t.category === tip.category
    );
    
    if (tipIndex !== -1) {
        // Found in English array
        const targetArray = targetLanguage === 'en' ? tipsEN : tipsNO;
        if (targetArray[tipIndex]) {
            return {
                text: targetArray[tipIndex].text,
                category: targetArray[tipIndex].category
            };
        }
    } else {
        // Try Norwegian array
        tipIndex = tipsNO.findIndex(t => 
            t.text === tip.text && t.category === tip.category
        );
        
        if (tipIndex !== -1) {
            const targetArray = targetLanguage === 'en' ? tipsEN : tipsNO;
            if (targetArray[tipIndex]) {
                return {
                    text: targetArray[tipIndex].text,
                    category: targetArray[tipIndex].category
                };
            }
        }
    }
    
    // If translation fails, return original tip
    console.log('Translation failed for tip:', tip);
    return tip;
}

// Get random tip based on selected category
function getRandomTip() {
    const selectedCategory = categorySelect.value.toLowerCase();
    const tips = getCurrentTips();
    let filteredTips = tips;

    if (selectedCategory !== 'all') {
        filteredTips = tips.filter(tip => tip.category === selectedCategory);
    }

    const randomIndex = Math.floor(Math.random() * filteredTips.length);
    return filteredTips[randomIndex];
}

// Display tip
function displayTip(tip) {
    // Get translated category name
    const categoryKey = `category${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}`;
    const categoryName = translations[currentLanguage][categoryKey] || tip.category;
    
    tipDisplay.innerHTML = `<p><strong>${categoryName}:</strong> ${tip.text}</p>`;
    
    // Reset button state
    saveFavoriteButton.style.display = 'block';
    saveFavoriteButton.disabled = false;
    saveFavoriteButton.style.backgroundColor = '#28a745';
    
    // Check if this tip is already in favorites
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.text === tip.text && fav.category === tip.category);
    
    if (isAlreadyFavorite) {
        saveFavoriteButton.textContent = translations[currentLanguage].alreadySaved;
        saveFavoriteButton.style.backgroundColor = '#6c757d';
        saveFavoriteButton.disabled = true;
    } else {
        saveFavoriteButton.textContent = translations[currentLanguage].saveAsFavorite;
    }
    
    currentTip = tip;
}

// Save tip to favorites
function saveFavorite() {
    if (!currentTip) return;

    const favorites = getFavorites();
    
    // Find the tip index to store for easier translation
    let tipIndex = -1;
    const currentTips = getCurrentTips();
    tipIndex = currentTips.findIndex(t => 
        t.text === currentTip.text && t.category === currentTip.category
    );
    
    // Create enhanced tip object with index for translation
    const tipToSave = {
        ...currentTip,
        tipIndex: tipIndex,
        originalLanguage: currentLanguage
    };
    
    // Check if tip is already in favorites (check by index if available)
    const isAlreadyFavorite = favorites.some(fav => {
        if (fav.tipIndex !== undefined && fav.tipIndex === tipIndex) {
            return true;
        }
        return fav.text === currentTip.text && fav.category === currentTip.category;
    });
    
    if (isAlreadyFavorite) {
        saveFavoriteButton.textContent = translations[currentLanguage].alreadySaved;
        saveFavoriteButton.style.backgroundColor = '#6c757d';
        return;
    }

    favorites.push(tipToSave);
    const saveSuccess = setStorage('cravingsFavorites', JSON.stringify(favorites));
    console.log('Save attempt:', saveSuccess, 'Favorites:', favorites);
    displayFavorites();
    
    // Update button to show saved state
    saveFavoriteButton.textContent = translations[currentLanguage].savedAsFavorite;
    saveFavoriteButton.style.backgroundColor = '#6c757d';
    saveFavoriteButton.disabled = true;
}

// Get favorites from localStorage
function getFavorites() {
    const favoritesJson = getStorage('cravingsFavorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

// Display favorites
function displayFavorites() {
    const favorites = getFavorites();
    console.log('Displaying favorites:', favorites);
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `<p id="noFavoritesText">${translations[currentLanguage].noFavoritesYet}</p>`;
        return;
    }

    // Show favorites in reverse order (last added first)
    const reversedFavorites = [...favorites].reverse();
    
    favoritesList.innerHTML = reversedFavorites.map((tip, displayIndex) => {
        const actualIndex = favorites.length - 1 - displayIndex;
        
        // Translate the tip to current language for display
        const translatedTip = translateTip(tip, currentLanguage);
        
        // Get translated category name
        const categoryKey = `category${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}`;
        const categoryName = translations[currentLanguage][categoryKey] || tip.category;
        
        return `<div class="favorite-item" draggable="true" data-index="${actualIndex}">
            <p><strong>${categoryName}:</strong> ${translatedTip.text}</p>
            <button onclick="removeFavorite(${actualIndex})" class="remove-btn" title="${translations[currentLanguage].remove}">🗑️</button>
        </div>`;
    }).join('');
    
    // Add drag and drop event listeners
    addDragAndDropListeners();
}

// Remove favorite
function removeFavorite(index) {
    const favorites = getFavorites();
    favorites.splice(index, 1);
    setStorage('cravingsFavorites', JSON.stringify(favorites));
    displayFavorites();
}

// Event listeners
helpButton.addEventListener('click', () => {
    const tip = getRandomTip();
    displayTip(tip);
});

saveFavoriteButton.addEventListener('click', saveFavorite);

// Drag and drop functionality
let draggedElement = null;
let touchStartY = 0;
let touchStartX = 0;
let dragGhost = null;

function addDragAndDropListeners() {
    const favoriteItems = document.querySelectorAll('.favorite-item');
    
    favoriteItems.forEach(item => {
        // Desktop drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        
        // Mobile touch events
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    // Create drag ghost
    createDragGhost(this, e.clientX, e.clientY);
    
    // Hide the default drag image
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Add mouse move listener for desktop
    document.addEventListener('dragover', updateGhostPosition);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    if (this !== draggedElement) {
        // Clear previous indicators
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.classList.remove('drag-over', 'drag-over-bottom');
        });
        
        // Add drop indicator based on mouse position
        const rect = this.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        
        if (e.clientY < midY) {
            this.classList.add('drag-over');
        } else {
            this.classList.add('drag-over-bottom');
        }
    }
    
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    // Clear all drag indicators
    document.querySelectorAll('.favorite-item').forEach(item => {
        item.classList.remove('drag-over', 'drag-over-bottom', 'dragging');
    });
    
    if (draggedElement !== this) {
        const favorites = getFavorites();
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Determine insertion point based on drop position
        const rect = this.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const insertIndex = e.clientY < midY ? targetIndex : targetIndex + 1;
        
        // Move item in array
        const draggedItem = favorites[draggedIndex];
        favorites.splice(draggedIndex, 1);
        
        // Adjust insert index if we removed an item before it
        const finalInsertIndex = draggedIndex < insertIndex ? insertIndex - 1 : insertIndex;
        favorites.splice(finalInsertIndex, 0, draggedItem);
        
        // Save updated order
        setStorage('cravingsFavorites', JSON.stringify(favorites));
        displayFavorites();
    }
    
    return false;
}

function handleDragEnd(e) {
    // Clear all drag states
    document.querySelectorAll('.favorite-item').forEach(item => {
        item.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
    });
    
    // Remove ghost and cleanup
    removeDragGhost();
    document.removeEventListener('dragover', updateGhostPosition);
    draggedElement = null;
}

// Mobile touch handlers
function handleTouchStart(e) {
    // Don't start drag if touch is on a button
    if (e.target.tagName === 'BUTTON') {
        return;
    }
    
    draggedElement = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    this.classList.add('dragging');
    
    // Create drag ghost for touch
    createDragGhost(this, touch.clientX, touch.clientY);
    
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!draggedElement) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Update ghost position
    if (dragGhost) {
        updateGhostPosition(e);
    }
    
    // Only start drag behavior if moved more than 10px
    if (deltaX < 10 && deltaY < 10) {
        return;
    }
    
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const favoriteItem = elementBelow?.closest('.favorite-item');
    
    if (favoriteItem && favoriteItem !== draggedElement) {
        // Clear previous indicators
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.classList.remove('drag-over', 'drag-over-bottom');
        });
        
        const rect = favoriteItem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        
        if (touch.clientY < midY) {
            favoriteItem.classList.add('drag-over');
        } else {
            favoriteItem.classList.add('drag-over-bottom');
        }
    }
    
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!draggedElement) return;
    
    // Check if this was actually a drag or just a tap
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Clear all drag states
    document.querySelectorAll('.favorite-item').forEach(item => {
        item.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
    });
    
    // Remove ghost
    removeDragGhost();
    
    // If it was a small movement, don't treat it as a drag (allow button clicks)
    if (deltaX < 10 && deltaY < 10) {
        draggedElement = null;
        return; // Don't prevent default, allow normal click events
    }
    
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = elementBelow?.closest('.favorite-item');
    
    if (targetItem && targetItem !== draggedElement) {
        const favorites = getFavorites();
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(targetItem.dataset.index);
        
        // Reorder items
        const draggedItem = favorites[draggedIndex];
        favorites.splice(draggedIndex, 1);
        favorites.splice(targetIndex, 0, draggedItem);
        
        // Save and refresh
        setStorage('cravingsFavorites', JSON.stringify(favorites));
        displayFavorites();
    }
    
    draggedElement = null;
    e.preventDefault();
}

// Language switching functions
function switchLanguage(lang) {
    currentLanguage = lang;
    setStorage('preferredLanguage', lang);
    
    // Update UI language
    updateUILanguage();
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang${lang.toUpperCase()}`).classList.add('active');
    
    // Clear current tip if showing
    if (currentTip) {
        document.getElementById('tipDisplay').innerHTML = `<p id="clickHelpText">${translations[lang].clickHelpMe}</p>`;
        document.getElementById('saveFavoriteButton').style.display = 'none';
        currentTip = null;
    }
}

function updateUILanguage() {
    const t = translations[currentLanguage];
    
    // Update main UI elements
    document.getElementById('appTitle').textContent = t.appTitle;
    document.getElementById('helpButton').textContent = t.helpMeNow;
    document.getElementById('yourTipTitle').textContent = t.yourTip;
    document.getElementById('savedFavoritesTitle').textContent = t.savedFavorites;
    
    // Update category options
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.options[0].textContent = t.categoryAll;
    categorySelect.options[1].textContent = t.categoryHydration;
    categorySelect.options[2].textContent = t.categoryDistraction;
    categorySelect.options[3].textContent = t.categoryMindset;
    
    // Update placeholders and buttons
    const clickHelpText = document.getElementById('clickHelpText');
    if (clickHelpText) {
        clickHelpText.textContent = t.clickHelpMe;
    }
    
    const noFavoritesText = document.getElementById('noFavoritesText');
    if (noFavoritesText) {
        noFavoritesText.textContent = t.noFavoritesYet;
    }
    
    // Refresh favorites display
    displayFavorites();
}

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    return browserLang.startsWith('no') ? 'no' : 'en';
}

// Drag ghost helper functions
function createDragGhost(element, x, y) {
    // Remove any existing ghost
    removeDragGhost();
    
    // Create ghost element
    dragGhost = element.cloneNode(true);
    dragGhost.classList.remove('dragging', 'drag-over', 'drag-over-bottom');
    dragGhost.classList.add('drag-ghost');
    
    // Remove any event listeners from the ghost
    const ghostButtons = dragGhost.querySelectorAll('button');
    ghostButtons.forEach(btn => btn.remove());
    
    // Position ghost at cursor/touch point
    dragGhost.style.left = (x - 50) + 'px';
    dragGhost.style.top = (y - 30) + 'px';
    
    document.body.appendChild(dragGhost);
}

function updateGhostPosition(e) {
    if (!dragGhost) return;
    
    let x, y;
    if (e.touches && e.touches[0]) {
        // Touch event
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        // Mouse event
        x = e.clientX;
        y = e.clientY;
    }
    
    dragGhost.style.left = (x - 50) + 'px';
    dragGhost.style.top = (y - 30) + 'px';
}

function removeDragGhost() {
    if (dragGhost) {
        dragGhost.remove();
        dragGhost = null;
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved language preference or detect browser language
    const savedLanguage = getStorage('preferredLanguage');
    currentLanguage = savedLanguage || detectBrowserLanguage();
    
    // Initialize UI
    updateUILanguage();
    switchLanguage(currentLanguage);
    displayFavorites();
});