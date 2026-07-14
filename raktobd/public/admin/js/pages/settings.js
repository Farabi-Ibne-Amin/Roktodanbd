// Admin System Settings Page for RoktoDanBD

const AdminSettingsPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px;">
          <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">Site Settings</h1>
          <p style="color: var(--text-muted); font-size: 14px;">Modify global helpline contacts and emergency system announcements.</p>
        </div>

        <div class="card" style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; max-width: 560px;">
          <form id="admin-settings-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
            
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="settings-banner">Emergency Banner Text</label>
              <textarea class="form-textarea" id="settings-banner" required style="min-height: 80px;" placeholder="🚨 জরুরি রক্তের প্রয়োজন? এখনি ফোন করুন: ..."></textarea>
              <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Displays on recipient views during high-stress alerts.</span>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="settings-phone">Helpline Phone Number</label>
              <input type="tel" class="form-input" id="settings-phone" required placeholder="017XXXXXXXX" />
              <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Central volunteer coordinator hotline listed in site footer.</span>
            </div>

            <div class="form-group" style="margin-bottom: 24px; flex-direction: row; align-items: center; gap: 8px;">
              <input type="checkbox" id="settings-announcement" style="width: 18px; height: 18px; cursor: pointer;" />
              <label class="form-label" for="settings-announcement" style="cursor: pointer; margin-bottom: 0;">Enable Site Announcement Banner</label>
            </div>

            <button type="submit" class="btn btn-primary" id="btn-save-settings">
              Save Configuration Settings
            </button>

          </form>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    if (!adminApi.isAuthenticated()) return;

    const form = document.getElementById('admin-settings-form');
    const submitBtn = document.getElementById('btn-save-settings');

    // 1. Fetch current settings configuration
    try {
      const settings = await adminApi.getSettings();
      if (window.currentPath !== '/settings') return;

      document.getElementById('settings-banner').value = settings.emergencyBannerText || '';
      document.getElementById('settings-phone').value = settings.contactPhone || '';
      document.getElementById('settings-announcement').checked = !!settings.siteAnnouncementEnabled;
    } catch (e) {
      console.error(e);
      if (window.currentPath !== '/settings') return;
      adminToast.error('Could not load settings configurations.');
    }

    // 2. Submit edits
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        emergencyBannerText: document.getElementById('settings-banner').value.trim(),
        contactPhone: document.getElementById('settings-phone').value.trim(),
        siteAnnouncementEnabled: document.getElementById('settings-announcement').checked
      };

      submitBtn.disabled = true;
      submitBtn.innerText = 'Saving configuration...';

      try {
        await adminApi.updateSettings(payload);
        adminToast.success('Global site settings updated successfully.');
      } catch (err) {
        console.error(err);
        adminToast.error('Failed to update settings configuration.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Save Configuration Settings';
      }
    });
  }
};

window.AdminSettingsPage = AdminSettingsPage;
