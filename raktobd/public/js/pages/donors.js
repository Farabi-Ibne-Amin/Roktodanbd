// Find Donors Page for RoktoDanBD (Translated to Bangla)

const DonorsPage = {
  districtsData: [], // Stores district & upazila hierarchy loaded from API

  render: async () => {
    return `
      <div class="page-wrapper">
        <header class="page-header">
          <div class="container">
            <span class="section-tag" style="color: var(--primary);">রক্তদাতা তালিকা</span>
            <h1 class="headline-lg">রক্তদাতা খুঁজুন</h1>
            <p class="body-md">আপনার এলাকায় রক্তদানের উপযুক্ত সক্রিয় রক্তদাতাদের তালিকা খুঁজুন ও ফিল্টার করুন।</p>
          </div>
        </header>

        <section class="section">
          <div class="container" style="display: flex; flex-direction: column; gap: var(--space-md);">
            <!-- Filter Bar -->
            <div class="filter-bar">
              <div class="form-group">
                <label class="form-label" for="filter-blood">রক্তের গ্রুপ</label>
                <select class="form-select" id="filter-blood">
                  <option value="">সব গ্রুপ</option>
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
                <label class="form-label" for="filter-district">জেলা</label>
                <select class="form-select" id="filter-district">
                  <option value="">সব জেলা</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="filter-upazila">উপজেলা / এলাকা</label>
                <select class="form-select" id="filter-upazila" disabled>
                  <option value="">প্রথমে জেলা নির্বাচন করুন</option>
                </select>
              </div>

              <div class="filter-actions">
                <button class="btn btn-secondary btn-icon" id="btn-reset-filters" title="রিসেট ফিল্টার">🔄</button>
                <button class="btn btn-primary" id="btn-search-donors">🔍 খুঁজুন</button>
              </div>
            </div>

            <!-- Results Section -->
            <div>
              <div class="flex-between" style="margin-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
                <h2 class="headline-sm" id="search-results-title">উপযুক্ত রক্তদাতাগণ</h2>
                <div style="font-size: 13px; color: var(--on-surface-variant);">
                  শুধুমাত্র প্রস্তুত রক্তদাতাদের দেখানো হচ্ছে (যারা গত ১২০ দিনে রক্ত দেননি)।
                </div>
              </div>

              <div id="donors-grid" class="grid-auto-fill">
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    const gridEl = document.getElementById('donors-grid');
    const districtSelect = document.getElementById('filter-district');
    const upazilaSelect = document.getElementById('filter-upazila');
    const bloodSelect = document.getElementById('filter-blood');
    const searchBtn = document.getElementById('btn-search-donors');
    const resetBtn = document.getElementById('btn-reset-filters');
    const titleEl = document.getElementById('search-results-title');

    // 1. Populate district filter from local BD_GEODATA
    DonorsPage.districtsData = window.BD_GEODATA || [];
    DonorsPage.districtsData.forEach(d => {
      const option = document.createElement('option');
      option.value = d.district;
      option.textContent = d.district;
      districtSelect.appendChild(option);
    });

    // 2. Handle district change to populate upazila
    districtSelect.addEventListener('change', () => {
      const selectedDistrict = districtSelect.value;
      upazilaSelect.innerHTML = '<option value="">সব উপজেলা</option>';
      
      if (!selectedDistrict) {
        upazilaSelect.disabled = true;
        upazilaSelect.innerHTML = '<option value="">প্রথমে জেলা নির্বাচন করুন</option>';
        return;
      }

      const match = DonorsPage.districtsData.find(d => d.district === selectedDistrict);
      if (match && match.upazilas && match.upazilas.length > 0) {
        upazilaSelect.disabled = false;
        match.upazilas.forEach(u => {
          const option = document.createElement('option');
          option.value = u;
          option.textContent = u;
          upazilaSelect.appendChild(option);
        });
      } else {
        upazilaSelect.disabled = true;
      }
    });

    // 3. Search triggers
    const performSearch = async () => {
      gridEl.innerHTML = `
        <div class="skeleton skeleton-card" style="grid-column: span 3; height: 120px;"></div>
      `;
      
      const params = {};
      if (bloodSelect.value) params.bloodGroup = bloodSelect.value;
      if (districtSelect.value) params.district = districtSelect.value;
      if (upazilaSelect.value) params.upazila = upazilaSelect.value;

      try {
        const donors = await api.getDonors(params);
        if (window.currentPath !== '/donors') return;
        titleEl.textContent = `উপযুক্ত রক্তদাতাগণ (${donors.length.toLocaleString('bn-BD')})`;

        if (donors.length === 0) {
          gridEl.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-icon">🔍</div>
              <h3>কোনো রক্তদাতা পাওয়া যায়নি</h3>
              <p>ফিল্টার পরিবর্তন করুন অথবা আপনার খোঁজার পরিসর বাড়ান।</p>
            </div>
          `;
        } else {
          gridEl.innerHTML = donors.map(d => DonorCard.render(d)).join('');
        }
      } catch (e) {
        if (window.currentPath !== '/donors') return;
        console.error('Search failed:', e);
        toast.error('রক্তদাতা খুঁজতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        gridEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h3>অনুসন্ধান করার সময় ত্রুটি ঘটেছে</h3>
            <p>অনুগ্রহ করে পেজটি রিলোড করে আবার চেষ্টা করুন।</p>
          </div>
        `;
      }
    };

    searchBtn.addEventListener('click', performSearch);

    // Reset filters
    resetBtn.addEventListener('click', () => {
      bloodSelect.value = '';
      districtSelect.value = '';
      upazilaSelect.value = '';
      upazilaSelect.disabled = true;
      upazilaSelect.innerHTML = '<option value="">প্রথমে জেলা নির্বাচন করুন</option>';
      performSearch();
    });

    // Run initial search with no filters on page load
    performSearch();
  }
};

window.DonorsPage = DonorsPage;
