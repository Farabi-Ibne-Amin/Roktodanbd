// Admin Login Page for RoktoDanBD

const AdminLoginPage = {
  render: async () => {
    return `
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 36px; margin-bottom: 8px;">🩸</div>
            <h1 class="header-title" style="font-size: 20px;">RoktoDanBD Admin</h1>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Sign in to access control portal</p>
          </div>

          <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 4px;">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input type="email" class="form-input" id="login-email" required placeholder="admin@example.com" />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" class="form-input" id="login-password" required placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary btn-full" id="btn-admin-login" style="margin-top: 12px;">
              Authenticate
            </button>
          </form>
          
          <div style="margin-top: 16px; font-size: 12px; text-align: center; color: var(--text-muted);">
            Need initial setup? Use the system <code style="background:#e2e8f0; padding:2px 4px; border-radius:2px;">/api/setup</code> endpoint.
          </div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('admin-login-form');
    const submitBtn = document.getElementById('btn-admin-login');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      submitBtn.disabled = true;
      submitBtn.innerText = 'Authenticating...';

      try {
        await adminApi.login({ email, password });
        adminToast.success('Authenticated successfully. Loading system...');
        
        setTimeout(() => {
          window.location.hash = '#/';
        }, 1000);
      } catch (err) {
        console.error('Admin Auth failed:', err);
        adminToast.error(err.message || 'Invalid administrator credentials.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Authenticate';
      }
    });
  }
};

window.AdminLoginPage = AdminLoginPage;
