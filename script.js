// Array of tips with text and category
const tips = [
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

// Get random tip based on selected category
function getRandomTip() {
    const selectedCategory = categorySelect.value.toLowerCase();
    let filteredTips = tips;

    if (selectedCategory !== 'all') {
        filteredTips = tips.filter(tip => tip.category === selectedCategory);
    }

    const randomIndex = Math.floor(Math.random() * filteredTips.length);
    return filteredTips[randomIndex];
}

// Display tip
function displayTip(tip) {
    tipDisplay.innerHTML = `<p><strong>${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}:</strong> ${tip.text}</p>`;
    
    // Reset button state
    saveFavoriteButton.style.display = 'block';
    saveFavoriteButton.disabled = false;
    saveFavoriteButton.style.backgroundColor = '#28a745';
    
    // Check if this tip is already in favorites
    const favorites = getFavorites();
    const isAlreadyFavorite = favorites.some(fav => fav.text === tip.text && fav.category === tip.category);
    
    if (isAlreadyFavorite) {
        saveFavoriteButton.textContent = 'Already Saved!';
        saveFavoriteButton.style.backgroundColor = '#6c757d';
        saveFavoriteButton.disabled = true;
    } else {
        saveFavoriteButton.textContent = 'Save as Favorite';
    }
    
    currentTip = tip;
}

// Save tip to favorites
function saveFavorite() {
    if (!currentTip) return;

    const favorites = getFavorites();
    
    // Check if tip is already in favorites
    const isAlreadyFavorite = favorites.some(fav => fav.text === currentTip.text && fav.category === currentTip.category);
    if (isAlreadyFavorite) {
        saveFavoriteButton.textContent = 'Already Saved!';
        saveFavoriteButton.style.backgroundColor = '#6c757d';
        return;
    }

    favorites.push(currentTip);
    const saveSuccess = setStorage('cravingsFavorites', JSON.stringify(favorites));
    console.log('Save attempt:', saveSuccess, 'Favorites:', favorites);
    displayFavorites();
    
    // Update button to show saved state
    saveFavoriteButton.textContent = 'Saved as Favorite!';
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
        favoritesList.innerHTML = '<p>No favorites saved yet.</p>';
        return;
    }

    // Show favorites in reverse order (last added first)
    const reversedFavorites = [...favorites].reverse();
    
    favoritesList.innerHTML = reversedFavorites.map((tip, displayIndex) => {
        const actualIndex = favorites.length - 1 - displayIndex;
        return `<div class="favorite-item" draggable="true" data-index="${actualIndex}">
            <p><strong>${tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}:</strong> ${tip.text}</p>
            <button onclick="removeFavorite(${actualIndex})" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Remove</button>
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

function addDragAndDropListeners() {
    const favoriteItems = document.querySelectorAll('.favorite-item');
    
    favoriteItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const favorites = getFavorites();
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Swap items in array
        const draggedItem = favorites[draggedIndex];
        favorites.splice(draggedIndex, 1);
        favorites.splice(targetIndex, 0, draggedItem);
        
        // Save updated order
        setStorage('cravingsFavorites', JSON.stringify(favorites));
        displayFavorites();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedElement = null;
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    displayFavorites();
});