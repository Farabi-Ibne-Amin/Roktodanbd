// Thalassemia Program Page for RoktoDanBD (Translated to Bangla)

const ThalassemiaPage = {
  render: async () => {
    return `
      <div class="page-wrapper">
        <header class="page-header" style="background: linear-gradient(135deg, #fff5f5, #e7eeff);">
          <div class="container flex-between" style="gap: var(--space-md); flex-wrap: wrap;">
            <div style="max-width: 600px;">
              <span class="section-tag" style="color: var(--primary);">নিয়মিত সহায়তা</span>
              <h1 class="headline-lg">থ্যালাসেমিয়া সহায়তা</h1>
              <p class="body-md">আমাদের দীর্ঘমেয়াদী রক্তদাতা ম্যাচিং প্রোগ্রামের জন্য আবেদন করুন। আমরা নিয়মিত রোগীদের নিয়মিত রক্তদাতাদের সাথে সংযুক্ত করি।</p>
            </div>
            
            <div style="font-size: 56px;" class="hide-mobile">🩺</div>
          </div>
        </header>

        <section class="section">
          <div class="container">
            <div class="dashboard-grid">
              
              <!-- Info details column -->
              <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                  <h3 class="headline-sm" style="color: var(--primary); margin-bottom: 8px;">থ্যালাসেমিয়া কী?</h3>
                  <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6; margin-bottom: var(--space-sm);">
                    থ্যালাসেমিয়া একটি বংশগত রক্তাল্পতাজনিত রোগ, যার ফলে শরীরে স্বাভাবিকের চেয়ে কম অক্সিজেন বহনকারী প্রোটিন (হিমোগ্লোবিন) এবং কম লোহিত রক্তকণিকা তৈরি হয়।
                  </p>
                  <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6;">
                    মাঝারি থেকে তীব্র থ্যালাসেমিয়া রোগীদের প্রতি কয়েক সপ্তাহ পর পর রক্ত পরিবর্তনের প্রয়োজন হয়। এই প্রোগ্রামের লক্ষ্য রোগীদের নিয়মিত রক্তদাতাদের সাথে যুক্ত করা যাতে প্রয়োজনে রক্ত পেতে কোনো সমস্যা না হয়।
                  </p>
                </div>

                <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg); background: var(--surface-container-low);">
                  <h3 class="headline-sm" style="margin-bottom: var(--space-sm);">যোগ্যতা</h3>
                  <ul class="body-sm" style="display: flex; flex-direction: column; gap: 8px; color: var(--on-surface-variant); padding-left: 18px; list-style-type: disc;">
                    <li>থ্যালাসেমিয়া মেজর বা ইন্টারমিডিয়া রোগ নির্ণয়ের সত্যতা থাকতে হবে।</li>
                    <li>হাসপাতালে সহজ যাতায়াত সুবিধাসহ বাংলাদেশের স্থায়ী বাসিন্দা হতে হবে।</li>
                    <li>রক্ত পরিবর্তনের প্রয়োজনীয়তা সংক্রান্ত ডাক্তারের প্রেসক্রিপশন থাকতে হবে।</li>
                  </ul>
                </div>
              </div>

              <!-- Form column -->
              <div class="card" style="padding: var(--space-md); border-radius: var(--radius-lg);">
                <h2 class="headline-sm" style="color: var(--secondary); margin-bottom: var(--space-sm);">আবেদন ফর্ম</h2>
                <form id="thalassemia-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                  
                  <div class="form-group">
                    <label class="form-label required" for="thal-name">রোগীর নাম</label>
                    <input type="text" class="form-input" id="thal-name" required placeholder="পূর্ণ নাম" />
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label required" for="thal-phone">যোগাযোগের মোবাইল নম্বর</label>
                      <input type="tel" class="form-input" id="thal-phone" required placeholder="01XXXXXXXXX" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required" for="thal-age">রোগীর বয়স</label>
                      <input type="number" class="form-input" id="thal-age" required min="1" max="100" placeholder="বছর" />
                    </div>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label required" for="thal-blood">রক্তের গ্রুপ</label>
                      <select class="form-select" id="thal-blood" required>
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
                      <label class="form-label required" for="thal-district">জেলা</label>
                      <select class="form-select" id="thal-district" required>
                        <option value="">জেলা নির্বাচন করুন</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label required" for="thal-freq">রক্ত পরিবর্তনের ফ্রিকোয়েন্সি</label>
                    <select class="form-select" id="thal-freq" required>
                      <option value="Every 2 weeks">প্রতি ২ সপ্তাহে একবার</option>
                      <option value="Every 3 weeks">প্রতি ৩ সপ্তাহে একবার</option>
                      <option value="Every month">প্রতি মাসে একবার</option>
                      <option value="Every 2-3 months">প্রতি ২-৩ মাসে একবার</option>
                    </select>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="thal-hospital">প্রধান হাসপাতাল</label>
                      <input type="text" class="form-input" id="thal-hospital" placeholder="যেমন: ন্যাশনাল হাসপাতাল" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="thal-doctor">পরামর্শদাতা ডাক্তার</label>
                      <input type="text" class="form-input" id="thal-doctor" placeholder="ডাক্তারের নাম" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="thal-note">বিশেষ প্রয়োজনীয়তা</label>
                    <textarea class="form-textarea" id="thal-note" placeholder="রক্তদাতা মেলাবার শর্তাবলি, ফিল্টার ব্যাগ বা রোগীর কোনো বিশেষ প্রয়োজনীয়তা থাকলে এখানে উল্লেখ করুন..."></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary btn-full" id="btn-submit-thalassemia">
                    আবেদন জমা দিন
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('thalassemia-form');
    const submitBtn = document.getElementById('btn-submit-thalassemia');

    // Populate district select from BD_GEODATA
    const thalDistrictSelect = document.getElementById('thal-district');
    (window.BD_GEODATA || []).forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.district;
      opt.textContent = d.district;
      thalDistrictSelect.appendChild(opt);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        name: document.getElementById('thal-name').value.trim(),
        phone: document.getElementById('thal-phone').value.trim(),
        age: parseInt(document.getElementById('thal-age').value) || 0,
        district: document.getElementById('thal-district').value.trim(),
        bloodGroup: document.getElementById('thal-blood').value,
        transfusionFreq: document.getElementById('thal-freq').value,
        hospital: document.getElementById('thal-hospital').value.trim(),
        doctorName: document.getElementById('thal-doctor').value.trim(),
        note: document.getElementById('thal-note').value.trim()
      };

      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        await api.submitThalassemia(payload);
        toast.success('আপনার থ্যালাসেমিয়া সহায়তা আবেদনটি সফলভাবে জমা হয়েছে।');
        form.reset();
        
        // Reset defaults
        document.getElementById('thal-freq').value = 'Every month';
      } catch (err) {
        console.error('Thalassemia application failed:', err);
        toast.error(err.message || 'আবেদন জমা দিতে ব্যর্থ হয়েছে।');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });
  }
};

window.ThalassemiaPage = ThalassemiaPage;
