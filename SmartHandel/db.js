// SmartHandel - IndexedDB Storage Layer
// Handles all local storage for receipts, patterns, meals, and item database

const DB_NAME = 'SmartHandelDB';
const DB_VERSION = 3;

class SmartHandelDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Receipts store
        if (!db.objectStoreNames.contains('receipts')) {
          const receiptStore = db.createObjectStore('receipts', { keyPath: 'id', autoIncrement: true });
          receiptStore.createIndex('date', 'date', { unique: false });
          receiptStore.createIndex('store', 'store', { unique: false });
        }

        // Purchase items (individual line items from receipts)
        if (!db.objectStoreNames.contains('purchases')) {
          const purchaseStore = db.createObjectStore('purchases', { keyPath: 'id', autoIncrement: true });
          purchaseStore.createIndex('receiptId', 'receiptId', { unique: false });
          purchaseStore.createIndex('itemName', 'itemName', { unique: false });
          purchaseStore.createIndex('normalizedName', 'normalizedName', { unique: false });
          purchaseStore.createIndex('category', 'category', { unique: false });
          purchaseStore.createIndex('date', 'date', { unique: false });
        }

        // Meals store (user-confirmed meal patterns)
        if (!db.objectStoreNames.contains('meals')) {
          const mealStore = db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
          mealStore.createIndex('name', 'name', { unique: false });
        }

        // Item database (known items with categories)
        if (!db.objectStoreNames.contains('items')) {
          const itemStore = db.createObjectStore('items', { keyPath: 'normalizedName' });
          itemStore.createIndex('category', 'category', { unique: false });
          itemStore.createIndex('alwaysBuy', 'alwaysBuy', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Generic CRUD helpers
  async _add(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _put(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _getAllByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _delete(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async _count(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Receipt methods
  async addReceipt(receipt) {
    return this._add('receipts', receipt);
  }

  async getReceipt(id) {
    return this._get('receipts', id);
  }

  async getAllReceipts() {
    return this._getAll('receipts');
  }

  async deleteReceipt(id) {
    // Also delete associated purchases
    const purchases = await this._getAllByIndex('purchases', 'receiptId', id);
    const tx = this.db.transaction(['receipts', 'purchases'], 'readwrite');
    tx.objectStore('receipts').delete(id);
    for (const p of purchases) {
      tx.objectStore('purchases').delete(p.id);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Purchase methods
  async addPurchase(purchase) {
    return this._add('purchases', purchase);
  }

  async addPurchases(purchases) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('purchases', 'readwrite');
      const store = tx.objectStore('purchases');
      const ids = [];
      for (const p of purchases) {
        const req = store.add(p);
        req.onsuccess = () => ids.push(req.result);
      }
      tx.oncomplete = () => resolve(ids);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllPurchases() {
    return this._getAll('purchases');
  }

  async getPurchasesByItem(normalizedName) {
    return this._getAllByIndex('purchases', 'normalizedName', normalizedName);
  }

  async getPurchasesByReceipt(receiptId) {
    return this._getAllByIndex('purchases', 'receiptId', receiptId);
  }

  // Meal methods
  async addMeal(meal) {
    return this._add('meals', meal);
  }

  async updateMeal(meal) {
    return this._put('meals', meal);
  }

  async getMeal(id) {
    return this._get('meals', id);
  }

  async getAllMeals() {
    return this._getAll('meals');
  }

  async deleteMeal(id) {
    return this._delete('meals', id);
  }

  // Item database methods
  async addItem(item) {
    return this._put('items', item);
  }

  async getItem(normalizedName) {
    return this._get('items', normalizedName);
  }

  async getAllItems() {
    return this._getAll('items');
  }

  async getItemsByCategory(category) {
    return this._getAllByIndex('items', 'category', category);
  }

  async getAlwaysBuyItems() {
    return this._getAllByIndex('items', 'alwaysBuy', true);
  }

  // Settings methods
  async setSetting(key, value) {
    return this._put('settings', { key, value });
  }

  async getSetting(key) {
    const result = await this._get('settings', key);
    return result ? result.value : null;
  }

  async getAllSettings() {
    const all = await this._getAll('settings');
    const settings = {};
    for (const s of all) {
      settings[s.key] = s.value;
    }
    return settings;
  }

  // Stats
  async getStats() {
    const [receipts, purchases, meals, items] = await Promise.all([
      this._count('receipts'),
      this._count('purchases'),
      this._count('meals'),
      this._count('items'),
    ]);
    return { receipts, purchases, meals, items };
  }

  // Seed the item database with known Norwegian grocery items
  async seedItemDatabase() {
    const existingCount = await this._count('items');
    if (existingCount > 0) return; // Already seeded

    const items = getNorwegianGroceryItems();
    const tx = this.db.transaction('items', 'readwrite');
    const store = tx.objectStore('items');
    for (const item of items) {
      store.put(item);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(items.length);
      tx.onerror = () => reject(tx.error);
    });
  }
}

// Norwegian grocery items database — mapped to user's To Do shopping categories
function getNorwegianGroceryItems() {
  const categories = {
    'Frukt og grønt': [
      'Poteter', 'Potet', 'Mandelpoteter',
      'Løk', 'Gul løk', 'Rødløk', 'Vårløk', 'Hvitløk',
      'Gulrot', 'Gulrøtter',
      'Brokkoli', 'Blomkål',
      'Tomat', 'Tomater', 'Cherrytomater',
      'Paprika', 'Rød paprika', 'Grønn paprika', 'Gul paprika',
      'Agurk', 'Salat', 'Isbergsalat', 'Ruccola',
      'Spinat', 'Grønnkål',
      'Mais', 'Erter', 'Bønner', 'Sopp', 'Sjampinjong',
      'Squash', 'Aubergine', 'Avokado',
      'Selleri', 'Purre', 'Ingefær', 'Chili',
      'Epler', 'Bananer', 'Appelsiner', 'Klementiner',
      'Druer', 'Jordbær', 'Blåbær', 'Bringebær',
      'Pære', 'Mango', 'Ananas', 'Kiwi',
      'Sitron', 'Lime', 'Vannmelon',
    ],
    'Kjøtt og Ost': [
      'Kyllingfilet', 'Kyllinglår', 'Hel kylling', 'Kyllingbryst',
      'Kjøttdeig', 'Svinekoteletter', 'Svinekjøtt', 'Ribbe',
      'Biff', 'Entrecote', 'Ytrefilet', 'Indrefilet', 'Storfe',
      'Lammekjøtt', 'Lammelår', 'Lammekotelett',
      'Bacon', 'Skinke', 'Spekeskinke',
      'Pølser', 'Grillpølser', 'Wiener',
      'Ost', 'Brunost', 'Norvegia', 'Jarlsberg', 'Gulost', 'Hvitost', 'Mozzarella', 'Parmesan', 'Kremost', 'Cottage cheese',
      'Laks', 'Laksfilet', 'Røkelaks',
      'Torsk', 'Torskefilet',
      'Sei', 'Seifilet',
      'Reker', 'Makrell', 'Tunfisk',
      'Fiskepinner', 'Fiskekaker', 'Fiskeboller',
    ],
    'Brødmat': [
      'Brød', 'Grovbrød', 'Kneippbrød', 'Loff', 'Ciabatta',
      'Rundstykker', 'Polarbrød',
      'Knekkebrød', 'Kavring',
      'Lomper', 'Pitabrød', 'Nan',
      'Bagett',
      'Leverpostei', 'Kaviar', 'Nugatti', 'Syltetøy',
    ],
    'Frysevarer': [
      'Frosne grønnsaker', 'Frosne bær',
      'Pizza', 'Grandiosa', 'Big One',
      'Pommes frites', 'Potetstappe',
      'Frosne middager',
    ],
    'Melkeskapet': [
      'Melk', 'Lettmelk', 'H-melk', 'Skummet melk', 'Helmelk',
      'Smør', 'Meierismør', 'Bremykt', 'Margarin',
      'Yoghurt', 'Kulturmelk', 'Biola',
      'Rømme', 'Lettrømme', 'Seterrømme',
      'Fløte', 'Kremfløte', 'Matfløte', 'Crème fraîche',
      'Egg',
    ],
    'Drikke': [
      'Juice', 'Appelsinjuice', 'Eplejuice',
      'Brus', 'Cola', 'Solo', 'Fanta',
      'Vann', 'Mineralvann', 'Farris',
      'Kaffe', 'Te', 'Kakao',
    ],
    'Tørrvarer': [
      'Ris', 'Jasminris', 'Basmatiris', 'Fullkornsris',
      'Pasta', 'Spaghetti', 'Penne', 'Fusilli', 'Makaroni', 'Tagliatelle',
      'Havregryn', 'Müsli', 'Cornflakes',
      'Tomatpure', 'Hermetiske tomater', 'Hakkede tomater',
      'Kokosnøttmelk', 'Coconut milk',
      'Bønner hermetisk', 'Kikerter',
      'Olivenolje', 'Rapsolje', 'Smørolje',
      'Soyasaus', 'Sriracha', 'Ketchup', 'Sennep', 'Majones',
      'Buljong', 'Grønnsaksbuljong', 'Kyllingbuljong',
      'Salt', 'Pepper', 'Tortilla',
    ],
    'Bakevarer': [
      'Mel', 'Hvetemel', 'Sammalt',
      'Sukker', 'Melis', 'Brunt sukker',
      'Gjær', 'Tørrgjær', 'Bakepulver', 'Vaniljesukker',
    ],
    'Hygiene': [
      'Tannkrem', 'Tannbørste', 'Tannpirker',
      'Sjampo', 'Balsam', 'Dusjsåpe', 'Håndsåpe',
      'Toalettpapir', 'Tørkepapir', 'Servietter',
      'Deodorant',
    ],
    'Rengjøringsartikler': [
      'Vaskemiddel', 'Oppvaskmiddel', 'Skyllemiddel',
      'Avfallsposer', 'Plastfolie', 'Aluminiumsfolie',
    ],
    'Godis': [
      'Chips', 'Popcorn', 'Nøtter', 'Sjokolade',
      'Kjeks', 'Småkaker', 'Vafler',
      'Godteri', 'Lakris',
      'Tørkede frukter', 'Studentermix',
    ],
    'Is': [
      'Is', 'Ispinne',
    ],
    'Tran og Sanasol': [
      'Tran', 'Møllers tran', 'Sanasol',
    ],
    'Hund': [
      'Hundefor', 'Hundesnacks',
    ],
  };

  const items = [];
  for (const [category, names] of Object.entries(categories)) {
    for (const name of names) {
      items.push({
        normalizedName: normalizeName(name),
        displayName: name,
        category,
        alwaysBuy: false,
        avgPrice: null,
        purchaseCount: 0,
      });
    }
  }
  return items;
}

// Normalize item names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\d+\s*(g|kg|ml|l|cl|dl|stk|pk)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Singleton instance
const db = new SmartHandelDB();
