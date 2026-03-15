// SmartHandel - MSAL Authentication
// Handles Microsoft identity platform authentication for Graph API access

const msalConfig = {
  auth: {
    clientId: '4896c649-0b5c-4660-8471-393d887ae137',
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: window.location.origin + '/',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const loginRequest = {
  scopes: ['Tasks.ReadWrite', 'User.Read'],
};

const tokenRequest = {
  scopes: ['Tasks.ReadWrite'],
};

class AuthManager {
  constructor() {
    this.msalInstance = null;
    this.account = null;
    this.initialized = false;
  }

  async init() {
    // Load saved client ID from settings (override default if set)
    const savedClientId = await db.getSetting('clientId');
    if (savedClientId) {
      msalConfig.auth.clientId = savedClientId;
    }

    // Check if MSAL is available
    if (typeof msal === 'undefined') {
      console.warn('MSAL library not loaded. Auth features disabled.');
      this.initialized = false;
      return;
    }

    try {
      this.msalInstance = new msal.PublicClientApplication(msalConfig);
      await this.msalInstance.initialize();

      // Handle redirect response
      const response = await this.msalInstance.handleRedirectPromise();
      if (response) {
        this.account = response.account;
      } else {
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          this.account = accounts[0];
        }
      }

      this.initialized = true;
      this.updateUI();
    } catch (error) {
      console.error('MSAL init error:', error);
      this.initialized = false;
    }
  }

  async login() {
    if (!this.initialized) {
      showToast('Konfigurer Client ID i Innstillinger f\u00f8rst', 'warning');
      app.switchTab('settings');
      return;
    }

    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      this.account = response.account;
      this.updateUI();
      showToast('Logget inn som ' + this.account.name, 'success');
      // Refresh To Do lists after login
      if (typeof todoApi !== 'undefined') {
        todoApi.loadLists();
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.errorCode === 'user_cancelled') {
        showToast('Innlogging avbrutt', 'info');
      } else {
        showToast('Innloggingsfeil: ' + error.message, 'error');
      }
    }
  }

  async logout() {
    if (!this.initialized) return;
    try {
      await this.msalInstance.logoutPopup();
      this.account = null;
      this.updateUI();
      showToast('Logget ut', 'info');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getToken() {
    if (!this.initialized || !this.account) return null;

    try {
      const response = await this.msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: this.account,
      });
      return response.accessToken;
    } catch (error) {
      // Silent token acquisition failed, try popup
      try {
        const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
        return response.accessToken;
      } catch (popupError) {
        console.error('Token error:', popupError);
        showToast('Kunne ikke hente tilgangstoken', 'error');
        return null;
      }
    }
  }

  isLoggedIn() {
    return this.account !== null;
  }

  getAccountName() {
    return this.account ? this.account.name : null;
  }

  getAccountEmail() {
    return this.account ? this.account.username : null;
  }

  updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const authStatus = document.getElementById('auth-status');

    if (this.isLoggedIn()) {
      authBtn.textContent = 'Logg ut';
      authBtn.classList.add('logged-in');
      authStatus.textContent = this.getAccountName();
      authStatus.classList.add('active');
      document.body.classList.add('authenticated');
    } else {
      authBtn.textContent = 'Logg inn';
      authBtn.classList.remove('logged-in');
      authStatus.textContent = '';
      authStatus.classList.remove('active');
      document.body.classList.remove('authenticated');
    }
  }

  async updateClientId(clientId) {
    await db.setSetting('clientId', clientId);
    msalConfig.auth.clientId = clientId;
    // Reinitialize MSAL with new client ID
    this.msalInstance = null;
    this.account = null;
    this.initialized = false;
    await this.init();
    showToast('Client ID oppdatert. Logg inn p\u00e5 nytt.', 'info');
  }
}

const auth = new AuthManager();
