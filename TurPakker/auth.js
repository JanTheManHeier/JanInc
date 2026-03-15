// auth.js - MSAL authentication for Microsoft Graph

const AuthManager = {
  // ---- CONFIGURE YOUR APP HERE ----
  CLIENT_ID: 'e5873034-8339-4a29-ad90-f7cc58d85a56',
  AUTHORITY: 'https://login.microsoftonline.com/consumers',
  REDIRECT_URI: 'http://localhost:3000/',
  SCOPES: ['Tasks.ReadWrite', 'User.Read'],

  msalInstance: null,
  account: null,

  /**
   * Initialize MSAL
   */
  init() {
    if (typeof msal === 'undefined') {
      console.warn('MSAL library not loaded. To Do sync will be unavailable.');
      return false;
    }

    const msalConfig = {
      auth: {
        clientId: this.CLIENT_ID,
        authority: this.AUTHORITY,
        redirectUri: this.REDIRECT_URI,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      }
    };

    try {
      this.msalInstance = new msal.PublicClientApplication(msalConfig);
      // Handle redirect response
      this.msalInstance.handleRedirectPromise().then(response => {
        if (response) {
          this.account = response.account;
          this._onAuthChange();
        } else {
          const accounts = this.msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            this.account = accounts[0];
            this._onAuthChange();
          }
        }
      }).catch(err => {
        console.error('Auth redirect error:', err);
      });
      return true;
    } catch (e) {
      console.error('MSAL init error:', e);
      return false;
    }
  },

  /**
   * Check if the client ID has been configured
   */
  isConfigured() {
    return this.CLIENT_ID !== 'YOUR_CLIENT_ID_HERE' && this.CLIENT_ID.length > 10;
  },

  /**
   * Sign in with Microsoft
   */
  async signIn() {
    if (!this.msalInstance) return null;
    if (!this.isConfigured()) {
      alert('Microsoft To Do integration krever en Azure AD app.\n\n' +
        '1. G\u00E5 til https://portal.azure.com\n' +
        '2. Registrer en ny app (Azure AD > App registrations)\n' +
        '3. Sett Redirect URI til: ' + this.REDIRECT_URI + '\n' +
        '4. Kopier Application (client) ID\n' +
        '5. Oppdater CLIENT_ID i auth.js');
      return null;
    }

    try {
      const response = await this.msalInstance.loginPopup({
        scopes: this.SCOPES,
      });
      this.account = response.account;
      this._onAuthChange();
      return this.account;
    } catch (e) {
      console.error('Login error:', e);
      return null;
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    if (!this.msalInstance) return;
    try {
      await this.msalInstance.logoutPopup();
      this.account = null;
      this._onAuthChange();
    } catch (e) {
      console.error('Logout error:', e);
    }
  },

  /**
   * Get access token for Graph API
   */
  async getToken() {
    if (!this.msalInstance || !this.account) return null;

    const request = {
      scopes: this.SCOPES,
      account: this.account,
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (e) {
      // Silent token acquisition failed, try popup
      try {
        const response = await this.msalInstance.acquireTokenPopup(request);
        return response.accessToken;
      } catch (e2) {
        console.error('Token acquisition failed:', e2);
        return null;
      }
    }
  },

  /**
   * Check if user is signed in
   */
  isSignedIn() {
    return this.account !== null;
  },

  /**
   * Get display name
   */
  getDisplayName() {
    return this.account ? (this.account.name || this.account.username) : null;
  },

  /**
   * Auth state change callback
   */
  _onAuthChange() {
    if (typeof App !== 'undefined' && App.updateAuthUI) {
      App.updateAuthUI();
    }
  }
};
