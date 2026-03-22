(function () {
  'use strict';

  const API_BASE = '/api';
  const DEVICE_ID_KEY = 'spisslank-deviceId';

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  }

  async function apiCall(method, path, body) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function syncProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem('spisslank-profile') || '{}');
      await apiCall('PUT', '/spisslank-profile', {
        deviceId: getDeviceId(),
        name: profile.name || '',
        language: profile.language || 'no',
        dietaryRestrictions: profile.dietaryRestrictions || [],
        allergies: profile.allergies || [],
        mealFrequency: profile.mealFrequency || {},
      });
    } catch (e) { /* ignore */ }
  }

  function logUsage(eventType, eventData) {
    apiCall('POST', '/spisslank-usage', {
      deviceId: getDeviceId(),
      eventType,
      eventData: eventData || {},
    }).catch(() => {});
  }

  async function sharePlan(planData, title) {
    const result = await apiCall('POST', '/spisslank-share', {
      deviceId: getDeviceId(),
      planData,
      title: title || 'Min SpisSlank-plan',
    });
    return result;
  }

  async function loadSharedPlan(code) {
    try {
      const res = await fetch(`${API_BASE}/spisslank-plan/${encodeURIComponent(code)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function checkSharedPlanURL() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('plan');
    if (!code) return;

    window._sharedPlanCode = code;

    loadSharedPlan(code).then(plan => {
      if (plan) {
        window._sharedPlan = plan;
        window.dispatchEvent(new CustomEvent('sharedPlanLoaded', { detail: plan }));
      }
    });
  }

  window.getDeviceId = getDeviceId;
  window.syncProfile = syncProfile;
  window.logUsage = logUsage;
  window.sharePlan = sharePlan;
  window.loadSharedPlan = loadSharedPlan;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      logUsage('app_open');
      checkSharedPlanURL();
    });
  } else {
    logUsage('app_open');
    checkSharedPlanURL();
  }
})();
