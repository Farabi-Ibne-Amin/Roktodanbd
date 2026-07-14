// Admin Dashboard Overview Page for RoktoDanBD

const AdminDashboardPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px;">
          <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">System Overview</h1>
          <p style="color: var(--text-muted); font-size: 14px;">Real-time diagnostics and operations analytics for RoktoDanBD.</p>
        </div>

        <!-- Diagnostic Stats Grid -->
        <div class="admin-stats-grid">
          
          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Total Users</h3>
              <div id="stat-total-users">...</div>
            </div>
            <div class="stat-card-icon" style="background: var(--info-bg); color: var(--info);">👥</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Pending Approvals</h3>
              <div id="stat-pending-approvals" style="color: var(--primary);">...</div>
            </div>
            <div class="stat-card-icon" style="background: var(--danger-bg); color: var(--primary);">⌛</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Open Requests</h3>
              <div id="stat-open-requests">...</div>
            </div>
            <div class="stat-card-icon" style="background: var(--warning-bg); color: var(--warning);">📢</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-info">
              <h3>Total Donations (bKash)</h3>
              <div id="stat-total-donations">...</div>
            </div>
            <div class="stat-card-icon" style="background: var(--success-bg); color: var(--success);">💸</div>
          </div>

        </div>

        <!-- Quick Info Blocks -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          
          <!-- System Status card -->
          <div class="card" style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">
            <h3 class="headline-sm" style="font-size: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <span>🛡️</span> Administrative Actions Quick Links
            </h3>
            <p class="body-sm" style="color: var(--text-muted); margin-bottom: 20px;">
              Audits and registrations must follow legal guidelines. Ensure donor health reports (Hb levels, infection reports) are verified before marking profiles as Approved.
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <a href="#/users" class="btn btn-secondary btn-sm" style="flex-direction: column; gap: 4px; padding-block: 16px; height: auto;">
                <span style="font-size: 20px;">👤</span>
                <span>Manage Users</span>
              </a>
              <a href="#/requests" class="btn btn-secondary btn-sm" style="flex-direction: column; gap: 4px; padding-block: 16px; height: auto;">
                <span style="font-size: 20px;">📢</span>
                <span>Audit Requests</span>
              </a>
              <a href="#/thalassemia" class="btn btn-secondary btn-sm" style="flex-direction: column; gap: 4px; padding-block: 16px; height: auto;">
                <span style="font-size: 20px;">🩺</span>
                <span>Thalassemia Matching</span>
              </a>
            </div>
          </div>

          <!-- Status Indicator -->
          <div class="card" style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 class="headline-sm" style="font-size: 16px; margin-bottom: 12px;">Server Diagnostics</h3>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Database:</span>
                  <span style="color: var(--success); font-weight: 700;">CONNECTED</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Gateway:</span>
                  <span style="color: var(--success); font-weight: 700;">ONLINE</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">API Status:</span>
                  <span style="color: var(--success); font-weight: 700;">OK</span>
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px; font-size: 11px; color: var(--text-muted); text-align: center;">
              RoktoDanBD System v2.0
            </div>
          </div>

        </div>
      </div>
    `;
  },

  afterRender: async () => {
    if (!adminApi.isAuthenticated()) return;

    try {
      const stats = await adminApi.getStats();
      if (window.currentPath !== '/') return;

      document.getElementById('stat-total-users').innerText = stats.totalUsers || 0;
      document.getElementById('stat-pending-approvals').innerText = stats.pendingApprovals || 0;
      document.getElementById('stat-open-requests').innerText = stats.openRequests || 0;
      document.getElementById('stat-total-donations').innerText = stats.totalDonations || 0;
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      if (window.currentPath !== '/') return;
      adminToast.error('Could not load overview statistics.');
    }
  }
};

window.AdminDashboardPage = AdminDashboardPage;
