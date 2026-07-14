// Router & Layout controller for RoktoDanBD Admin SPA

const routes = {
  '/': AdminDashboardPage,
  '/users': AdminUsersPage,
  '/requests': AdminRequestsPage,
  '/donations': AdminDonationsPage,
  '/thalassemia': AdminThalassemiaPage,
  '/settings': AdminSettingsPage,
  '/login': AdminLoginPage
};

const Layout = {
  render: (contentHtml) => {
    const activeHash = window.location.hash || '#/';
    const getActive = (hash) => activeHash === hash ? 'active' : '';

    return `
      <div class="admin-frame">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <div class="sidebar-logo">
            RoktoDan<span>BD Admin</span>
          </div>
          <nav class="sidebar-menu">
            <a href="#/" class="sidebar-item ${getActive('#/') || getActive('')}">
              <span>📊</span> System Overview
            </a>
            <a href="#/users" class="sidebar-item ${getActive('#/users')}">
              <span>👥</span> User Directory
            </a>
            <a href="#/requests" class="sidebar-item ${getActive('#/requests')}">
              <span>📢</span> Blood Requests
            </a>
            <a href="#/thalassemia" class="sidebar-item ${getActive('#/thalassemia')}">
              <span>🩺</span> Thalassemia matching
            </a>
            <a href="#/donations" class="sidebar-item ${getActive('#/donations')}">
              <span>💸</span> bKash Donations
            </a>
            <a href="#/settings" class="sidebar-item ${getActive('#/settings')}">
              <span>⚙️</span> Site Settings
            </a>
          </nav>
          <div class="sidebar-footer">
            <button class="btn btn-secondary btn-sm btn-full" id="btn-admin-logout" style="border-color: rgba(255,255,255,0.1); color: #94a3b8; background: transparent;">
              🚪 Exit Session
            </button>
          </div>
        </aside>

        <!-- Main Workspace Frame -->
        <div class="admin-main">
          <header class="admin-header">
            <h2 class="header-title" id="page-title-label">RoktoDanBD Admin Portal</h2>
            <div class="header-actions">
              <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">Role: <strong>Superadmin</strong></span>
            </div>
          </header>
          
          <main class="admin-content" id="admin-page-content">
            ${contentHtml}
          </main>
        </div>
      </div>
    `;
  },

  init: () => {
    const logoutBtn = document.getElementById('btn-admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        adminApi.logout();
        adminToast.success('Admin logged out successfully.');
      });
    }

    // Set page header dynamically based on route
    const label = document.getElementById('page-title-label');
    if (label) {
      const activeHash = window.location.hash || '#/';
      if (activeHash === '#/') label.innerText = 'System Dashboard';
      else if (activeHash === '#/users') label.innerText = 'Manage Registered Donors';
      else if (activeHash === '#/requests') label.innerText = 'Audit Blood Requests';
      else if (activeHash === '#/thalassemia') label.innerText = 'Thalassemia Matching Panel';
      else if (activeHash === '#/donations') label.innerText = 'bKash Donation Audits';
      else if (activeHash === '#/settings') label.innerText = 'Edit Site Announcements';
    }
  }
};

const adminRouter = async () => {
  const appEl = document.getElementById('admin-app');
  if (!appEl) return;

  const rPath = window.location.hash.slice(1) || '/';
  
  // Track active path to bypass race conditions
  window.currentPath = rPath;

  const isAuth = adminApi.isAuthenticated();
  if (rPath !== '/login' && !isAuth) {
    window.location.hash = '#/login';
    return;
  }

  const page = routes[rPath] || AdminDashboardPage;

  if (rPath === '/login') {
    // Render login without sidebar frame
    appEl.innerHTML = await page.render();
    if (page.afterRender) {
      await page.afterRender();
    }
  } else {
    // Render frame with layout wrapper
    const initialLoader = `
      <div style="display:flex; justify-content:center; padding:100px 0;">
        <div class="spinner"></div>
      </div>
    `;
    appEl.innerHTML = Layout.render(initialLoader);
    Layout.init();

    try {
      const pageHtml = await page.render();
      const contentEl = document.getElementById('admin-page-content');
      if (contentEl) {
        contentEl.innerHTML = pageHtml;
      }

      if (page.afterRender) {
        await page.afterRender();
      }
    } catch (err) {
      console.error(err);
      const contentEl = document.getElementById('admin-page-content');
      if (contentEl) {
        contentEl.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--danger);">
            <h3>Application Rendering Failed</h3>
            <p>${err.message || 'Check connection details.'}</p>
          </div>
        `;
      }
    }
  }
};

window.addEventListener('hashchange', adminRouter);
window.addEventListener('DOMContentLoaded', adminRouter);
