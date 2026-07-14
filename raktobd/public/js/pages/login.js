// Login Page for RoktoDanBD

const LoginPage = {
  render: async () => {
    return `
      <div class="page-wrapper flex-center" style="min-height: calc(100vh - var(--navbar-height)); padding: var(--space-md);">
        <div class="card" style="width: 100%; max-width: 420px; padding: var(--space-md); border-radius: var(--radius-xl);">
          <div class="text-center" style="margin-bottom: var(--space-md);">
            <div style="font-size: 40px; margin-bottom: 8px;">🩸</div>
            <h1 class="headline-md">Welcome Back</h1>
            <p class="body-sm" style="color: var(--on-surface-variant);">Access your donor portal to log donations and update profile.</p>
          </div>

          <form id="login-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
            <div class="form-group">
              <label class="form-label" for="login-identifier">Email or Phone Number</label>
              <input type="text" class="form-input" id="login-identifier" required placeholder="01XXXXXXXXX or email@example.com" />
            </div>

            <div class="form-group">
              <div class="flex-between">
                <label class="form-label" for="login-pass">Password</label>
                <!-- For now, we can skip forgot password or handle it as an alert -->
                <a href="javascript:void(0)" onclick="toast.info('Please contact administrator to reset your password.')" style="font-size: 12px; color: var(--secondary); font-weight: 500;">Forgot?</a>
              </div>
              <input type="password" class="form-input" id="login-pass" required placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary btn-full" id="btn-submit-login" style="margin-top: 8px;">
              Sign In
            </button>
          </form>

          <div class="divider-label" style="margin-block: var(--space-md);">or</div>

          <a href="#/register" class="btn btn-secondary btn-full">
            Register as Volunteer Donor
          </a>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('login-form');
    const submitBtn = document.getElementById('btn-submit-login');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const identifier = document.getElementById('login-identifier').value.trim();
      const password = document.getElementById('login-pass').value;

      const payload = { password };
      
      // Determine if email or phone
      if (identifier.includes('@')) {
        payload.email = identifier;
      } else {
        payload.phone = identifier;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        await api.login(payload);
        toast.success('Successfully logged in!');
        
        // Re-render Navbar to reflect logged in state
        const appHeader = document.querySelector('nav.navbar');
        if (appHeader) {
          appHeader.outerHTML = Navbar.render();
          Navbar.init();
        }

        // Redirect to dashboard
        setTimeout(() => {
          window.location.hash = '#/dashboard';
        }, 1000);
      } catch (err) {
        console.error('Login error:', err);
        toast.error(err.message || 'Invalid credentials or account pending admin approval.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });
  }
};

window.LoginPage = LoginPage;
