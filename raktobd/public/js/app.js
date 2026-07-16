// Single Page App Router & Controller for RoktoDanBD

const routes = {
  '/': HomePage,
  '/donors': DonorsPage,
  '/requests': RequestsPage,
  '/thalassemia': ThalassemiaPage,
  '/donate': DonatePage,
  '/donation-success': DonationSuccessPage,
  '/donation-cancel': DonationCancelPage,
  '/donation-failure': DonationFailurePage,
  '/register': RegisterPage,
  '/login': LoginPage,
  '/dashboard': DashboardPage
};

// Footer layout component
const Footer = {
  render: () => {
    return `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <div class="footer-brand">RoktoDan<span>BD</span></div>
            <p class="footer-desc">
              RoktoDanBD is a voluntary community initiative dedicated to bridging the gap between blood donors and recipients across Bangladesh. Free, fast, and secure.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div class="footer-links">
              <a href="#/">Home</a>
              <a href="#/donors">Find Donors</a>
              <a href="#/requests">Blood Requests</a>
              <a href="#/thalassemia">Thalassemia Assistance</a>
            </div>
          </div>
          <div>
            <h4>Involvement</h4>
            <div class="footer-links">
              <a href="#/register">Register as Donor</a>
              <a href="#/login">Donor Login</a>
              <a href="javascript:void(0)" onclick="toast.info('Mobile application coming soon!')">Get Android App</a>
              <a href="javascript:void(0)" onclick="toast.info('Contact system is under maintenance')">Contact Support</a>
            </div>
          </div>
          <div>
            <h4>Urgent Inquiries</h4>
            <p class="footer-desc" style="font-size: 13px;">
              For immediate critical matching requests, post an emergency request or reach out to our divisional coordinators.
            </p>
            <div style="margin-top: 12px; font-weight: 700; color: white;">
              📞 +880 1537-103242
            </div>
          </div>
        </div>
        <div class="container footer-bottom">
          <div>&copy; 2026 RoktoDanBD. All rights reserved. Created with Urgency, Trust & Community.</div>
          <div>Made for Bangladesh 🇧🇩</div>
        </div>
      </footer>
    `;
  }
};

const router = async () => {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  // Intercept server-side redirects for donation callback
  if (window.location.pathname === '/donation-success') {
    const paymentID = new URLSearchParams(window.location.search).get('paymentID');
    window.location.replace(`/#/donation-success?paymentID=${paymentID || ''}`);
    return;
  }
  if (window.location.pathname === '/donation-cancel') {
    window.location.replace('/#/donation-cancel');
    return;
  }
  if (window.location.pathname === '/donation-failure') {
    window.location.replace('/#/donation-failure');
    return;
  }

  // Extract hash path, default to '/'
  const fullPath = window.location.hash.slice(1) || '/';
  const rPath = fullPath.split('?')[0];
  
  // Save current route path to resolve async race conditions
  window.currentPath = rPath;
  
  // Basic Auth Guard
  const isAuth = api.isAuthenticated();
  if (rPath === '/dashboard' && !isAuth) {
    toast.warning('Please log in to access the dashboard.');
    window.location.hash = '#/login';
    return;
  }

  // Get matching page component, fallback to HomePage if not found
  const page = routes[rPath] || HomePage;

  // Render wrapper: Navbar + Page content + Footer
  appEl.innerHTML = `
    ${Navbar.render()}
    <main id="page-content" class="fade-in">
      <div style="display: flex; justify-content: center; padding: 100px 0;">
        <div class="initial-loader" style="min-height: auto;">
          <div class="loader-drop">
            <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="48">
              <path d="M24 0C24 0 4 24 4 38C4 49.046 13 58 24 58C35 58 44 49.046 44 38C44 24 24 0 24 0Z" fill="#b7102a"/>
            </svg>
          </div>
        </div>
      </div>
    </main>
    ${Footer.render()}
  `;

  // Initialize navbar script event handlers
  Navbar.init();

  // Render actual page
  try {
    const pageHtml = await page.render();
    const contentEl = document.getElementById('page-content');
    if (contentEl) {
      contentEl.innerHTML = pageHtml;
    }
    
    // Trigger after render hooks (e.g. state loading, form binding)
    if (page.afterRender) {
      await page.afterRender();
    }
  } catch (err) {
    console.error('Page rendering failed:', err);
    const contentEl = document.getElementById('page-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="container empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Failed to render page</h3>
          <p>${err.message || 'An unexpected error occurred. Please refresh.'}</p>
          <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: var(--space-sm);">Reload Page</button>
        </div>
      `;
    }
  }
};

// Route listeners
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
