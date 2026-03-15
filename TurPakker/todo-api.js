// todo-api.js - Microsoft Graph To Do API wrapper

const TodoApi = {
  GRAPH_BASE: 'https://graph.microsoft.com/v1.0/me/todo',

  /**
   * Make authenticated Graph API request
   */
  async _request(path, method = 'GET', body = null) {
    const token = await AuthManager.getToken();
    if (!token) throw new Error('Not authenticated');

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.GRAPH_BASE}${path}`, options);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Graph API error ${response.status}: ${errText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  },

  /**
   * Get all To Do lists
   */
  async getLists() {
    const data = await this._request('/lists');
    return data.value || [];
  },

  /**
   * Create a new To Do list
   */
  async createList(displayName) {
    return this._request('/lists', 'POST', { displayName });
  },

  /**
   * Get tasks in a list
   */
  async getTasks(listId) {
    const data = await this._request(`/lists/${listId}/tasks`);
    return data.value || [];
  },

  /**
   * Create a task in a list
   */
  async createTask(listId, title, categories = null) {
    const body = { title };
    if (categories) {
      body.categories = categories;
    }
    return this._request(`/lists/${listId}/tasks`, 'POST', body);
  },

  /**
   * Update a task (e.g., mark as completed)
   */
  async updateTask(listId, taskId, updates) {
    return this._request(`/lists/${listId}/tasks/${taskId}`, 'PATCH', updates);
  },

  /**
   * Delete a task
   */
  async deleteTask(listId, taskId) {
    return this._request(`/lists/${listId}/tasks/${taskId}`, 'DELETE');
  },

  /**
   * Sync packing list to Microsoft To Do
   * Creates a list named "TurPakker: [Trip Name]" and adds all items
   */
  async syncToTodo(tripName, packingList) {
    try {
      // Create the list
      const listName = `TurPakker: ${tripName}`;
      const list = await this.createList(listName);
      const listId = list.id;

      // Add items by category
      let created = 0;
      for (const [catKey, category] of Object.entries(packingList)) {
        for (const item of category.items) {
          const title = `[${category.label.split(' (')[0]}] ${item.name}`;
          const task = await this.createTask(listId, title);

          // If item is already packed, mark as completed
          if (item.packed) {
            await this.updateTask(listId, task.id, {
              status: 'completed'
            });
          }
          created++;
        }
      }

      return { listId, listName, itemCount: created };
    } catch (e) {
      console.error('Sync to To Do failed:', e);
      throw e;
    }
  },

  /**
   * Pull packing items from an existing To Do list
   */
  async pullFromTodo(listId) {
    const tasks = await this.getTasks(listId);
    return tasks.map(task => ({
      id: task.id,
      name: task.title,
      packed: task.status === 'completed',
    }));
  },

  /**
   * Update pack status of an item in To Do
   */
  async updatePackStatus(listId, taskId, packed) {
    return this.updateTask(listId, taskId, {
      status: packed ? 'completed' : 'notStarted'
    });
  }
};
