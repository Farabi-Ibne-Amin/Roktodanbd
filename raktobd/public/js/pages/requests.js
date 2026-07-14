// Blood Requests Page for RoktoDanBD (Translated to Bangla)

const RequestsPage = {
  render: async () => {
    return `
      <div class="page-wrapper">
        <header class="page-header">
          <div class="container">
            <span class="section-tag" style="color: var(--primary);">জরুরি ফিড</span>
            <h1 class="headline-lg">রক্তের অনুরোধসমূহ</h1>
            <p class="body-md">বর্তমান জরুরি রক্তপ্রয়োজনের অনুরোধগুলো দেখুন অথবা স্থানীয় রক্তদাতাদের বিজ্ঞপ্তি পাঠাতে নতুন অনুরোধ পোস্ট করুন।</p>
          </div>
        </header>

        <section class="section">
          <div class="container">
            <div class="dashboard-grid">
              
              <!-- Left Column: Submit Request Form -->
              <div class="profile-card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                <h2 class="headline-sm" style="margin-bottom: var(--space-sm); color: var(--primary); display: flex; align-items: center; gap: 8px;">
                  <span>🩸</span> রক্তের অনুরোধ করুন
                </h2>
                <form id="create-request-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                  
                  <div class="form-group">
                    <label class="form-label required" for="req-name">অনুরোধকারীর নাম</label>
                    <input type="text" class="form-input" id="req-name" required placeholder="পূর্ণ নাম" />
                  </div>

                  <div class="form-group">
                    <label class="form-label required" for="req-phone">মোবাইল নম্বর</label>
                    <input type="tel" class="form-input" id="req-phone" required placeholder="01XXXXXXXXX" />
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label required" for="req-blood">রক্তের গ্রুপ</label>
                      <select class="form-select" id="req-blood" required>
                        <option value="">নির্বাচন করুন</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label required" for="req-bags">রক্তের পরিমাণ (ব্যাগ)</label>
                      <input type="number" class="form-input" id="req-bags" required min="1" max="10" value="1" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label required" for="req-urgency">জরুরি অবস্থা</label>
                    <select class="form-select" id="req-urgency" required>
                      <option value="normal">সাধারণ প্রয়োজন</option>
                      <option value="urgent">অত্যন্ত জরুরি</option>
                      <option value="critical">আশঙ্কাজনক (তাৎক্ষণিক)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label required" for="req-hospital">হাসপাতালের নাম</label>
                    <input type="text" class="form-input" id="req-hospital" required placeholder="যেমন: ঢাকা মেডিকেল কলেজ" />
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label required" for="req-district">জেলা</label>
                      <select class="form-select" id="req-district" required>
                        <option value="">জেলা নির্বাচন করুন</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="req-upazila">উপজেলা / এলাকা</label>
                      <select class="form-select" id="req-upazila" disabled>
                        <option value="">প্রথমে জেলা নির্বাচন করুন</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="req-note">অতিরিক্ত বিবরণ</label>
                    <textarea class="form-textarea" id="req-note" placeholder="রোগীর ইতিহাস, রক্তদাতার শর্ত বা অতিরিক্ত তথ্য এখানে লিখুন..."></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary btn-full" id="btn-submit-request">
                    অনুরোধ জমা দিন
                  </button>
                </form>
              </div>

              <!-- Right Column: Active Requests List -->
              <div>
                <div class="flex-between" style="margin-bottom: var(--space-sm);">
                  <h2 class="headline-sm">সক্রিয় অনুরোধসমূহ</h2>
                  <button class="btn btn-ghost btn-sm" id="btn-refresh-requests">🔄 রিফ্রেশ</button>
                </div>

                <div id="requests-list" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                  <div class="skeleton skeleton-card"></div>
                  <div class="skeleton skeleton-card"></div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    const listEl = document.getElementById('requests-list');
    const refreshBtn = document.getElementById('btn-refresh-requests');
    const form = document.getElementById('create-request-form');
    const submitBtn = document.getElementById('btn-submit-request');

    // Populate district/upazila selects from BD_GEODATA
    const reqDistrictSelect = document.getElementById('req-district');
    const reqUpazilaSelect = document.getElementById('req-upazila');
    (window.BD_GEODATA || []).forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.district;
      opt.textContent = d.district;
      reqDistrictSelect.appendChild(opt);
    });
    reqDistrictSelect.addEventListener('change', () => {
      reqUpazilaSelect.innerHTML = '<option value="">উপজেলা নির্বাচন করুন</option>';
      const match = (window.BD_GEODATA || []).find(d => d.district === reqDistrictSelect.value);
      if (match && match.upazilas.length > 0) {
        reqUpazilaSelect.disabled = false;
        match.upazilas.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u;
          opt.textContent = u;
          reqUpazilaSelect.appendChild(opt);
        });
      } else {
        reqUpazilaSelect.disabled = true;
        reqUpazilaSelect.innerHTML = '<option value="">প্রথমে জেলা নির্বাচন করুন</option>';
      }
    });

    // 1. Function to fetch and display open requests
    const fetchRequests = async () => {
      listEl.innerHTML = `
        <div class="skeleton skeleton-card" style="height: 100px;"></div>
        <div class="skeleton skeleton-card" style="height: 100px;"></div>
      `;

      try {
        const requests = await api.getRequests();
        if (window.currentPath !== '/requests') return;
        if (requests.length === 0) {
          listEl.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon">📢</div>
              <h3>কোনো সক্রিয় অনুরোধ নেই</h3>
              <p>এই মুহূর্তে কোনো জরুরি রক্তের অনুরোধ পাওয়া যায়নি।</p>
            </div>
          `;
        } else {
          listEl.innerHTML = requests.map(req => RequestCard.render(req)).join('');
        }
      } catch (e) {
        if (window.currentPath !== '/requests') return;
        console.error('Failed to load blood requests:', e);
        listEl.innerHTML = `
          <div class="empty-state">
            <h3>অনুরোধ লোড করতে ব্যর্থ হয়েছে</h3>
            <p>অনুগ্রহ করে রিফ্রেশ বাটনে ক্লিক করুন অথবা নেটওয়ার্ক কানেকশন চেক করুন।</p>
          </div>
        `;
      }
    };

    // 2. Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        requesterName: document.getElementById('req-name').value.trim(),
        phone: document.getElementById('req-phone').value.trim(),
        bloodGroup: document.getElementById('req-blood').value,
        bagsNeeded: parseInt(document.getElementById('req-bags').value) || 1,
        urgency: document.getElementById('req-urgency').value,
        hospital: document.getElementById('req-hospital').value.trim(),
        district: document.getElementById('req-district').value.trim(),
        upazila: document.getElementById('req-upazila').value.trim(),
        note: document.getElementById('req-note').value.trim()
      };

      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        await api.submitRequest(payload);
        toast.success('আপনার রক্তের অনুরোধটি সফলভাবে পোস্ট করা হয়েছে।');
        form.reset();
        
        // Reset urgency selector default value
        document.getElementById('req-urgency').value = 'normal';
        document.getElementById('req-bags').value = '1';
        
        // Refresh the feed
        fetchRequests();
      } catch (err) {
        console.error('Request submission failed:', err);
        toast.error(err.message || 'অনুরোধ জমা দিতে ব্যর্থ হয়েছে।');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });

    // Refresh button event listener
    refreshBtn.addEventListener('click', fetchRequests);

    // Load requests initially
    fetchRequests();
  }
};

window.RequestsPage = RequestsPage;
