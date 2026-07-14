// Navigation Bar Component for RoktoDanBD

const Navbar = {
  render: () => {
    const isAuth = api.isAuthenticated();
    const activeHash = window.location.hash || '#/';
    
    const getActive = (hash) => activeHash === hash ? 'active' : '';

    return `
      <nav class="navbar" id="app-navbar">
        <div class="container navbar-inner">
          <a href="#/" class="navbar-logo">
            <svg class="navbar-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 4 10 4 15.5C4 19.642 7.582 23 12 23C16.418 23 20 19.642 20 15.5C20 10 12 2 12 2Z" fill="var(--primary)"/>
              <path d="M12 6C12 6 7 12 7 15.5C7 18 9 20 12 20" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
            </svg>
            রক্তদান<span>বাংলাদেশ</span>
          </a>
          
          <div class="navbar-nav" id="navbar-links">
            <a href="#/" class="nav-link ${getActive('#/') || getActive('')}">হোম</a>
            <a href="#/donors" class="nav-link ${getActive('#/donors')}">রক্তদাতা খুঁজুন</a>
            <a href="#/requests" class="nav-link ${getActive('#/requests')}">রক্তের অনুরোধ</a>
            <a href="#/thalassemia" class="nav-link ${getActive('#/thalassemia')}">থ্যালাসেমিয়া</a>
            <a href="#/donate" class="nav-link ${getActive('#/donate')}">অনুদান</a>
          </div>

          <div class="navbar-actions">
            ${isAuth ? `
              <a href="#/dashboard" class="btn btn-secondary btn-sm">ড্যাশবোর্ড</a>
              <button id="nav-logout-btn" class="btn btn-ghost btn-sm">লগআউট</button>
            ` : `
              <a href="#/login" class="btn btn-ghost btn-sm">লগইন</a>
              <a href="#/register" class="btn btn-primary btn-sm btn-pill">রক্তদাতা নিবন্ধন</a>
            `}
            
            <button class="hamburger" id="nav-toggle" aria-label="Toggle Navigation">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    `;
  },

  init: () => {
    // Scroll state change for visual effect
    const navbar = document.getElementById('app-navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }

    // Handle mobile hamburger menu
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('navbar-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
      });
    }

    // Handle logout button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        api.logout();
        toast.success('সফলভাবে লগআউট করা হয়েছে।');
      });
    }
  }
};

window.Navbar = Navbar;
