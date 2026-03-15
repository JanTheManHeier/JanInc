// SmartHandel - Microsoft Graph To Do API Wrapper
// Handles all To Do list operations via Microsoft Graph

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

class TodoAPI {
  constructor() {
    this.lists = [];
    this.selectedListId = null;
    this.tasks = [];
  }

  async graphRequest(url, method = 'GET', body = null) {
    const token = await auth.getToken();
    if (!token) {
      throw new Error('Ikke autentisert');
    }

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${GRAPH_BASE}${url}`, options);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Graph API feil (${response.status}): ${errText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  // List operations
  async loadLists() {
    if (!auth.isLoggedIn()) return [];

    try {
      const data = await this.graphRequest('/me/todo/lists');
      this.lists = data.value || [];
      this.renderListSelector();

      // Restore selected list
      const savedListId = await db.getSetting('selectedListId');
      if (savedListId && this.lists.find(l => l.id === savedListId)) {
        this.selectedListId = savedListId;
        await this.loadTasks();
      }

      return this.lists;
    } catch (error) {
      console.error('Load lists error:', error);
      showToast('Kunne ikke laste lister: ' + error.message, 'error');
      return [];
    }
  }

  async selectList(listId) {
    this.selectedListId = listId;
    await db.setSetting('selectedListId', listId);
    await this.loadTasks();
  }

  // Task operations
  async loadTasks() {
    if (!this.selectedListId) return [];

    try {
      const data = await this.graphRequest(
        `/me/todo/lists/${this.selectedListId}/tasks?$filter=status ne 'completed'&$orderby=importance desc,createdDateTime desc&$top=100`
      );
      this.tasks = data.value || [];
      this.renderTasks();
      return this.tasks;
    } catch (error) {
      console.error('Load tasks error:', error);
      showToast('Kunne ikke laste oppgaver: ' + error.message, 'error');
      return [];
    }
  }

  async createTask(title, listId = null) {
    const targetList = listId || this.selectedListId;
    if (!targetList) {
      showToast('Velg en liste f\u00f8rst', 'warning');
      return null;
    }

    try {
      const task = await this.graphRequest(
        `/me/todo/lists/${targetList}/tasks`,
        'POST',
        { title }
      );
      showToast(`Lagt til: ${title}`, 'success');
      await this.loadTasks();
      return task;
    } catch (error) {
      console.error('Create task error:', error);
      showToast('Kunne ikke opprette oppgave: ' + error.message, 'error');
      return null;
    }
  }

  async createTasks(titles, listId = null) {
    const targetList = listId || this.selectedListId;
    if (!targetList) {
      showToast('Velg en liste f\u00f8rst', 'warning');
      return [];
    }

    const results = [];
    for (const title of titles) {
      try {
        const task = await this.graphRequest(
          `/me/todo/lists/${targetList}/tasks`,
          'POST',
          { title }
        );
        results.push(task);
      } catch (error) {
        console.error(`Failed to create task "${title}":`, error);
      }
    }

    if (results.length > 0) {
      showToast(`Lagt til ${results.length} varer i listen`, 'success');
      await this.loadTasks();
    }
    return results;
  }

  async completeTask(taskId) {
    if (!this.selectedListId) return;

    try {
      await this.graphRequest(
        `/me/todo/lists/${this.selectedListId}/tasks/${taskId}`,
        'PATCH',
        { status: 'completed' }
      );
      await this.loadTasks();
    } catch (error) {
      console.error('Complete task error:', error);
    }
  }

  async deleteTask(taskId) {
    if (!this.selectedListId) return;

    try {
      await this.graphRequest(
        `/me/todo/lists/${this.selectedListId}/tasks/${taskId}`,
        'DELETE'
      );
      await this.loadTasks();
    } catch (error) {
      console.error('Delete task error:', error);
    }
  }

  // UI Rendering
  renderListSelector() {
    const selector = document.getElementById('todo-list-selector');
    if (!selector) return;

    selector.innerHTML = '<option value="">Velg en liste...</option>';
    for (const list of this.lists) {
      const opt = document.createElement('option');
      opt.value = list.id;
      opt.textContent = list.displayName;
      if (list.id === this.selectedListId) opt.selected = true;
      selector.appendChild(opt);
    }

    // Also update settings list mapping
    this.renderSettingsLists();
  }

  renderSettingsLists() {
    const container = document.getElementById('settings-lists');
    if (!container) return;

    if (this.lists.length === 0) {
      container.innerHTML = '<p class="muted">Logg inn for \u00e5 se lister</p>';
      return;
    }

    container.innerHTML = this.lists.map(list => `
      <div class="settings-list-item">
        <span class="list-name">${list.displayName}</span>
        <span class="list-id muted">${list.id.substring(0, 12)}...</span>
      </div>
    `).join('');
  }

  renderTasks() {
    const container = document.getElementById('todo-tasks');
    if (!container) return;

    if (!auth.isLoggedIn()) {
      container.innerHTML = '<div class="empty-state"><p>Logg inn for \u00e5 se handlelisten din</p></div>';
      return;
    }

    if (!this.selectedListId) {
      container.innerHTML = '<div class="empty-state"><p>Velg en liste fra menyen over</p></div>';
      return;
    }

    if (this.tasks.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ingen oppgaver i denne listen</p></div>';
      return;
    }

    container.innerHTML = this.tasks.map(task => `
      <div class="task-item" data-id="${task.id}">
        <button class="task-check" onclick="todoApi.completeTask('${task.id}')" title="Merk som fullf\u00f8rt">
          <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>
        </button>
        <span class="task-title">${escapeHtml(task.title)}</span>
        <button class="task-delete" onclick="todoApi.deleteTask('${task.id}')" title="Slett">&times;</button>
      </div>
    `).join('');
  }

  // === Smart Sync: category-aware To Do integration ===

  // Build a map of list displayName -> list id
  getListMap() {
    const map = {};
    for (const list of this.lists) {
      map[list.displayName.toLowerCase()] = list.id;
    }
    return map;
  }

  // Find the best matching list for a category name
  findListForCategory(category) {
    const listMap = this.getListMap();
    const catLower = category.toLowerCase();

    // Direct match
    if (listMap[catLower]) return listMap[catLower];

    // Partial match (category name contained in list name or vice versa)
    for (const [name, id] of Object.entries(listMap)) {
      if (name.includes(catLower) || catLower.includes(name)) return id;
    }

    // Known mappings for abbreviated/different names
    const aliases = {
      'frukt og gr\u00f8nt': ['frukt', 'gr\u00f8nt', 'gr\u00f8nnsaker'],
      'kj\u00f8tt og ost': ['kj\u00f8tt', 'ost'],
      'br\u00f8dmat': ['br\u00f8d'],
      'melkeskapet': ['meieri', 'melk'],
      't\u00f8rrvarer': ['t\u00f8rr'],
      'rengj\u00f8ringsartikler': ['rengj\u00f8ring'],
    };

    for (const [listName, alts] of Object.entries(aliases)) {
      if (alts.some(a => catLower.includes(a))) {
        if (listMap[listName]) return listMap[listName];
      }
    }

    return null;
  }

  // Get all tasks (including completed) from a list
  async getAllTasksInList(listId) {
    try {
      const data = await this.graphRequest(
        '/me/todo/lists/' + listId + '/tasks?$top=200'
      );
      return data.value || [];
    } catch (error) {
      console.error('Get all tasks error:', error);
      return [];
    }
  }

  // Smart add: check if item exists, reactivate if completed, create if missing
  async smartAddItem(itemName, category) {
    const listId = this.findListForCategory(category);
    if (!listId) {
      // Fallback: use selected list
      if (this.selectedListId) {
        return this.createTask(itemName, this.selectedListId);
      }
      console.warn('No list found for category:', category);
      return null;
    }

    // Get all tasks in the target list (including completed)
    const existingTasks = await this.getAllTasksInList(listId);

    // Search for matching task (case-insensitive)
    const nameLower = itemName.toLowerCase();
    const match = existingTasks.find(function(t) {
      return t.title.toLowerCase() === nameLower;
    });

    if (match) {
      if (match.status === 'completed') {
        // Reactivate completed task
        try {
          await this.graphRequest(
            '/me/todo/lists/' + listId + '/tasks/' + match.id,
            'PATCH',
            { status: 'notStarted' }
          );
          return { action: 'reactivated', task: match };
        } catch (error) {
          console.error('Reactivate task error:', error);
          return null;
        }
      } else {
        // Already exists and not completed — skip
        return { action: 'exists', task: match };
      }
    }

    // Not found — create new
    try {
      const task = await this.graphRequest(
        '/me/todo/lists/' + listId + '/tasks',
        'POST',
        { title: itemName }
      );
      return { action: 'created', task: task };
    } catch (error) {
      console.error('Create task error:', error);
      return null;
    }
  }

  // Smart sync multiple items with category awareness
  async smartSync(items) {
    // items: [{ name, category }, ...]
    if (!auth.isLoggedIn()) {
      showToast('Logg inn f\u00f8rst', 'warning');
      return [];
    }

    if (this.lists.length === 0) {
      await this.loadLists();
    }

    var results = { created: 0, reactivated: 0, exists: 0, failed: 0 };

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var result = await this.smartAddItem(item.name, item.category);
      if (result) {
        results[result.action] = (results[result.action] || 0) + 1;
      } else {
        results.failed++;
      }
    }

    var msg = [];
    if (results.created > 0) msg.push(results.created + ' nye');
    if (results.reactivated > 0) msg.push(results.reactivated + ' reaktivert');
    if (results.exists > 0) msg.push(results.exists + ' fantes allerede');
    if (results.failed > 0) msg.push(results.failed + ' feilet');

    showToast('To Do-synk: ' + msg.join(', '), results.failed > 0 ? 'warning' : 'success');

    // Refresh current list view
    if (this.selectedListId) await this.loadTasks();

    return results;
  }
}

const todoApi = new TodoAPI();
