// Dashboard Page for RoktoDanBD

const DashboardPage = {
  render: async () => {
    return `
      <div class="page-wrapper">
        <header class="page-header">
          <div class="container">
            <span class="section-tag" style="color: var(--primary);">Donor Portal</span>
            <h1 class="headline-lg">Your Dashboard</h1>
            <p class="body-md">Manage your profile, log new donations, and view your history.</p>
          </div>
        </header>

        <section class="section">
          <div class="container">
            <div class="dashboard-grid">
              
              <!-- Left Sidebar: Profile Details & Update Profile -->
              <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                
                <!-- Profile Status & Quick Donate -->
                <div class="profile-card">
                  <div class="profile-card-banner"></div>
                  <div class="profile-card-body">
                    <div class="profile-avatar-wrap" id="dash-blood-avatar">O+</div>
                    <h2 class="profile-name" id="dash-name">Loading...</h2>
                    <p class="profile-meta">
                      <span>Status: </span>
                      <span class="badge badge-normal" id="dash-status">Pending</span>
                    </p>
                    
                    <div style="margin-top: var(--space-sm); border-top: 1px solid var(--surface-container); padding-top: var(--space-sm);">
                      <div class="profile-stats">
                        <div class="profile-stat">
                          <div class="profile-stat-num" id="dash-donations-count">0</div>
                          <div class="profile-stat-label">Donations</div>
                        </div>
                        <div class="profile-stat">
                          <div class="profile-stat-num" id="dash-availability">Yes</div>
                          <div class="profile-stat-label">Available</div>
                        </div>
                      </div>
                    </div>

                    <!-- Quick Donated Today Action -->
                    <button class="btn btn-primary btn-full" id="btn-donated-today" style="margin-top: var(--space-md);">
                      📅 Donated Today
                    </button>
                    <span class="form-hint" style="display: block; text-align: center; margin-top: 4px;">
                      Marks you as unavailable for 120 days.
                    </span>
                  </div>
                </div>

                <!-- Update Details Form Card -->
                <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                  <h3 class="headline-sm" style="margin-bottom: var(--space-sm); color: var(--secondary);">Update Profile</h3>
                  <form id="update-profile-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                    <div class="form-group">
                      <label class="form-label" for="profile-name">Name</label>
                      <input type="text" class="form-input" id="profile-name" required />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="profile-email">Email</label>
                      <input type="email" class="form-input" id="profile-email" />
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label" for="profile-dob">Date of Birth</label>
                        <input type="date" class="form-input" id="profile-dob" required />
                      </div>
                      <div class="form-group">
                        <label class="form-label" for="profile-weight">Weight (kg)</label>
                        <input type="number" class="form-input" id="profile-weight" required />
                      </div>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label" for="profile-district">District</label>
                        <select class="form-select" id="profile-district" required>
                          <option value="">Select District</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label" for="profile-upazila">Upazila / Area</label>
                        <select class="form-select" id="profile-upazila" disabled>
                          <option value="">Select District first</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="profile-health-note">Health Note</label>
                      <textarea class="form-textarea" id="profile-health-note"></textarea>
                    </div>

                    <button type="submit" class="btn btn-secondary btn-full" id="btn-update-profile">
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>

              <!-- Right Content Area: Donation Logger & History -->
              <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                
                <!-- Logger Form Card -->
                <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                  <h3 class="headline-sm" style="margin-bottom: var(--space-sm); color: var(--secondary);">Log Donation</h3>
                  <form id="log-donation-form" class="form-grid" style="align-items: flex-end;">
                    
                    <div class="form-group">
                      <label class="form-label" for="log-date">Donation Date</label>
                      <input type="date" class="form-input" id="log-date" required />
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="log-type">Donation Type</label>
                      <select class="form-select" id="log-type" required>
                        <option value="full">Whole Blood</option>
                        <option value="platelet">Platelet</option>
                        <option value="plasma">Plasma</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="log-hospital">Hospital Name</label>
                      <input type="text" class="form-input" id="log-hospital" required placeholder="e.g. Apollo Hospital" />
                    </div>

                    <button type="submit" class="btn btn-primary" id="btn-submit-donation" style="min-height: 48px; width: 100%;">
                      Log Donation
                    </button>
                  </form>
                </div>

                <!-- History Logs Card -->
                <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                  <h3 class="headline-sm" style="margin-bottom: var(--space-sm); color: var(--secondary);">Donation History</h3>
                  <div id="donations-history-list">
                    <div class="skeleton" style="height: 50px; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 50px;"></div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    if (!api.isAuthenticated()) {
      toast.warning('Please login to access your dashboard.');
      window.location.hash = '#/login';
      return;
    }

    const nameEl = document.getElementById('dash-name');
    const statusEl = document.getElementById('dash-status');
    const countEl = document.getElementById('dash-donations-count');
    const availEl = document.getElementById('dash-availability');
    const avatarEl = document.getElementById('dash-blood-avatar');

    // Forms & Controls
    const updateForm = document.getElementById('update-profile-form');
    const logForm = document.getElementById('log-donation-form');
    const historyList = document.getElementById('donations-history-list');
    const quickBtn = document.getElementById('btn-donated-today');

    // Populate district select from BD_GEODATA
    const profileDistrictSelect = document.getElementById('profile-district');
    const profileUpazilaSelect = document.getElementById('profile-upazila');
    (window.BD_GEODATA || []).forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.district;
      opt.textContent = d.district;
      profileDistrictSelect.appendChild(opt);
    });
    const populateUpazilas = (districtName, currentUpazila) => {
      profileUpazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
      const match = (window.BD_GEODATA || []).find(d => d.district === districtName);
      if (match && match.upazilas.length > 0) {
        profileUpazilaSelect.disabled = false;
        match.upazilas.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u;
          opt.textContent = u;
          if (u === currentUpazila) opt.selected = true;
          profileUpazilaSelect.appendChild(opt);
        });
      } else {
        profileUpazilaSelect.disabled = true;
      }
    };
    profileDistrictSelect.addEventListener('change', () => populateUpazilas(profileDistrictSelect.value, ''));

    // 1. Fetch Profile Data
    const loadProfile = async () => {
      try {
        const user = await api.getProfile();
        if (window.currentPath !== '/dashboard') return;
        
        nameEl.textContent = user.name;
        statusEl.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1);
        
        if (user.status === 'approved') {
          statusEl.className = 'badge badge-normal';
        } else if (user.status === 'pending') {
          statusEl.className = 'badge badge-urgent';
        } else {
          statusEl.className = 'badge badge-critical';
        }

        countEl.textContent = user.donationCount || 0;
        avatarEl.textContent = user.bloodGroup;
        
        // Calculate blood class avatar theme
        avatarEl.className = 'profile-avatar-wrap';
        if (user.bloodGroup.startsWith('A')) avatarEl.style.background = 'var(--bg-Apos)';
        else if (user.bloodGroup.startsWith('B')) avatarEl.style.background = 'var(--bg-Bpos)';
        else if (user.bloodGroup.startsWith('O')) avatarEl.style.background = 'var(--bg-Opos)';
        else avatarEl.style.background = 'var(--bg-ABpos)';

        // Calculate availability
        let isAvailable = true;
        if (user.lastDonated) {
          const lastDate = new Date(user.lastDonated);
          const diffDays = Math.ceil(Math.abs(new Date() - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays < 120) {
            isAvailable = false;
          }
        }
        availEl.textContent = isAvailable ? 'Yes' : 'No';
        availEl.style.color = isAvailable ? 'var(--success)' : 'var(--error)';

        // Populate update form fields
        document.getElementById('profile-name').value = user.name || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-dob').value = user.dob || '';
        document.getElementById('profile-weight').value = user.weight || '';
        profileDistrictSelect.value = user.district || '';
        populateUpazilas(user.district || '', user.upazila || '');
        document.getElementById('profile-health-note').value = user.healthNote || '';

      } catch (err) {
        if (window.currentPath !== '/dashboard') return;
        console.error('Failed to load profile:', err);
        toast.error('Could not load user profile details.');
      }
    };

    // 2. Fetch Donation Log History
    const loadHistory = async () => {
      try {
        const donations = await api.getDonations();
        if (window.currentPath !== '/dashboard') return;
        if (donations.length === 0) {
          historyList.innerHTML = `
            <div class="empty-state" style="padding-block: var(--space-md);">
              <p>No donation logs recorded yet. Log your first donation above!</p>
            </div>
          `;
        } else {
          historyList.innerHTML = donations.map(log => `
            <div class="donation-log-item">
              <div class="donation-log-icon">🩸</div>
              <div class="donation-log-info">
                <div class="donation-log-date">${new Date(log.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                <div class="donation-log-details">
                  Type: <strong>${log.type.toUpperCase()}</strong> at <strong>${log.hospital || 'Not Specified'}</strong>
                </div>
              </div>
              <span class="badge badge-normal" style="align-self: center;">Verified</span>
            </div>
          `).join('');
        }
      } catch (err) {
        if (window.currentPath !== '/dashboard') return;
        console.error('History load failed:', err);
        historyList.innerHTML = '<p style="color: var(--error);">Failed to load donation logs.</p>';
      }
    };

    // 3. Handle profile update form
    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('profile-name').value.trim(),
        email: document.getElementById('profile-email').value.trim(),
        dob: document.getElementById('profile-dob').value,
        weight: parseInt(document.getElementById('profile-weight').value),
        district: document.getElementById('profile-district').value.trim(),
        upazila: document.getElementById('profile-upazila').value.trim(),
        healthNote: document.getElementById('profile-health-note').value.trim()
      };

      const saveBtn = document.getElementById('btn-update-profile');
      saveBtn.disabled = true;
      saveBtn.classList.add('btn-loading');

      try {
        await api.updateProfile(payload);
        toast.success('Profile updated successfully!');
        loadProfile();
      } catch (err) {
        toast.error(err.message || 'Failed to update profile.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.classList.remove('btn-loading');
      }
    });

    // 4. Handle log donation form
    logForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        date: document.getElementById('log-date').value,
        type: document.getElementById('log-type').value,
        hospital: document.getElementById('log-hospital').value.trim()
      };

      const submitBtn = document.getElementById('btn-submit-donation');
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        await api.logDonation(payload);
        toast.success('Donation logged successfully!');
        logForm.reset();
        loadProfile();
        loadHistory();
      } catch (err) {
        toast.error(err.message || 'Failed to log donation.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });

    // 5. Handle quick "donated today" action
    quickBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to log a donation for today? This will make you unavailable in donor listings for the next 120 days.')) {
        return;
      }
      
      try {
        await api.donatedToday();
        toast.success('Logged donation for today. Thank you for saving lives!');
        loadProfile();
        loadHistory();
      } catch (err) {
        toast.error(err.message || 'Failed to record donation.');
      }
    });

    // Run initial loads
    await loadProfile();
    await loadHistory();
  }
};

window.DashboardPage = DashboardPage;
