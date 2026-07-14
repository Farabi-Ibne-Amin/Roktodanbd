// bKash Donation Page and Callback Pages for RoktoDanBD (Translated to Bangla)

const DonatePage = {
  render: async () => {
    let userEmail = '';
    let userName = '';
    if (api.isAuthenticated()) {
      try {
        const profile = await api.getProfile();
        userEmail = profile.email || '';
        userName = profile.name || '';
      } catch (err) {
        console.warn('Failed to load profile for autofill:', err);
      }
    }

    return `
      <div class="page-wrapper flex-center" style="min-height: calc(100vh - var(--navbar-height)); padding: var(--space-md); background: linear-gradient(135deg, #fff5f5, #f0f3ff);">
        <div class="card" style="width: 100%; max-width: 480px; padding: var(--space-md); border-radius: var(--radius-xl); border: 1px solid var(--surface-container-high);">
          
          <div class="text-center" style="margin-bottom: var(--space-md);">
            <!-- bKash themed header -->
            <div style="background: #e2136e; color: white; padding: 12px; border-radius: var(--radius); display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; font-size: 18px; margin-bottom: var(--space-sm);">
              <span>বিকাশ</span> পেমেন্ট গেটওয়ে
            </div>
            <h1 class="headline-md" style="margin-top: 8px;">আর্থিক অনুদান দিন</h1>
            <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 4px;">
              আপনার অনুদান আমাদের প্ল্যাটফর্ম পরিচালনা, সার্ভার খরচ এবং রক্তদাতাদের এসএমএস অ্যালার্ট পাঠানোর খরচ মেটাতে সাহায্য করে।
            </p>
          </div>

          <form id="donate-form" style="display: flex; flex-direction: column; gap: var(--space-sm);">
            
            <div class="form-group">
              <label class="form-label required" for="donate-amount">অনুদানের পরিমাণ (টাকা)</label>
              <input type="number" class="form-input" id="donate-amount" required min="10" max="100000" value="500" />
              <span class="form-hint">সর্বনিম্ন অনুদান ১০ টাকা।</span>
            </div>

            <div class="form-group">
              <label class="form-label required" for="donate-ref">দাতা বা রেফারেন্সের নাম</label>
              <input type="text" class="form-input" id="donate-ref" required placeholder="যেমন: আপনার নাম / মোবাইল" value="${userName}" />
            </div>

            <div class="form-group">
              <label class="form-label required" for="donate-email">ইমেইল এড্রেস</label>
              <input type="email" class="form-input" id="donate-email" required placeholder="যেমন: name@example.com" value="${userEmail}" />
              <span class="form-hint">অনুদান সফল হলে এই ইমেইলে রসিদ পাঠানো হবে।</span>
            </div>

            <!-- bKash themed payment button -->
            <button type="submit" class="btn btn-full" id="btn-submit-donation" style="background: #e2136e; color: white; font-weight: 700; border-color: #e2136e; min-height: 48px; margin-top: 8px;">
              বিকাশ দিয়ে পেমেন্ট করুন
            </button>

          </form>

          <div style="margin-top: var(--space-sm); font-size: 11px; text-align: center; color: var(--on-surface-variant); line-height: 1.4;">
            এটি একটি নিরাপদ বিকাশ স্যান্ডবক্স পেমেন্ট সিমুলেশন। কোনো আসল টাকা কাটা হবে না।
          </div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('donate-form');
    const submitBtn = document.getElementById('btn-submit-donation');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const amount = parseFloat(document.getElementById('donate-amount').value);
      const payerReference = document.getElementById('donate-ref').value.trim();
      const donorEmail = document.getElementById('donate-email').value.trim();

      if (isNaN(amount) || amount < 10) {
        toast.error('অনুগ্রহ করে অন্তত ১০ টাকা বা তার বেশি ইনপুট দিন।');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = 'বিকাশ গেটওয়ে লোড হচ্ছে...';

      try {
        const payload = {
          amount,
          payerReference,
          donorEmail,
          callbackUrl: window.location.origin + '/api/donations/donate/callback'
        };

        const result = await api.createBkashPayment(payload);
        toast.info('বিকাশ পেমেন্ট পোর্টালে রিডাইরেক্ট করা হচ্ছে...');
        
        setTimeout(() => {
          window.location.href = result.bkashURL;
        }, 1000);

      } catch (err) {
        console.error('Donation setup failed:', err);
        toast.error(err.message || 'পেমেন্ট গেটওয়ে সেশন তৈরি করতে ব্যর্থ হয়েছে।');
        submitBtn.disabled = false;
        submitBtn.innerText = 'বিকাশ দিয়ে পেমেন্ট করুন';
      }
    });
  }
};

const DonationSuccessPage = {
  render: async () => {
    const getParam = (name) => {
      const urlParams = new URLSearchParams(window.location.search);
      let val = urlParams.get(name);
      if (!val) {
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        val = hashParams.get(name);
      }
      return val;
    };

    const paymentID = getParam('paymentID') || 'N/A';

    return `
      <div class="page-wrapper flex-center" style="min-height: calc(100vh - var(--navbar-height)); padding: var(--space-md); background: linear-gradient(135deg, #f3fffa, #f0f3ff);">
        <div class="card text-center" style="width: 100%; max-width: 480px; padding: var(--space-md); border-radius: var(--radius-xl); border: 1px solid var(--success-container);">
          
          <div style="font-size: 64px; margin-bottom: var(--space-sm);">💚</div>
          <h1 class="headline-md" style="color: var(--success); margin-bottom: var(--space-sm);">অনুদানের পেমেন্ট সফল হয়েছে!</h1>
          <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6; margin-bottom: var(--space-md);">
            রক্তদান বাংলাদেশকে সমর্থন করার জন্য আপনাকে আন্তরিক ধন্যবাদ! আপনার ট্রানজেকশন সফলভাবে ভেরিফাই করা হয়েছে। আপনার এই অবদান জীবন বাঁচাতে সাহায্য করবে।
          </p>

          <div style="background: var(--surface-container-low); padding: var(--space-sm); border-radius: var(--radius); text-align: left; font-size: 13px; margin-bottom: var(--space-md); border-left: 4px solid var(--success);">
            <div style="margin-bottom: 4px;"><strong>পেমেন্ট আইডি:</strong> <code>${paymentID}</code></div>
            <div><strong>অবস্থা:</strong> <span class="badge badge-normal">সম্পন্ন</span></div>
          </div>

          <div class="flex-col gap-sm">
            <a href="#/" class="btn btn-primary btn-full">হোমে ফিরে যান</a>
            <a href="#/donors" class="btn btn-secondary btn-full">রক্তদাতা খুঁজুন</a>
          </div>

        </div>
      </div>
    `;
  }
};

const DonationCancelPage = {
  render: async () => {
    return `
      <div class="page-wrapper flex-center" style="min-height: calc(100vh - var(--navbar-height)); padding: var(--space-md); background: linear-gradient(135deg, #fffcf5, #f0f3ff);">
        <div class="card text-center" style="width: 100%; max-width: 480px; padding: var(--space-md); border-radius: var(--radius-xl); border: 1px solid var(--warning-container);">
          
          <div style="font-size: 64px; margin-bottom: var(--space-sm);">🟡</div>
          <h1 class="headline-md" style="color: var(--warning); margin-bottom: var(--space-sm);">পেমেন্ট বাতিল করা হয়েছে</h1>
          <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6; margin-bottom: var(--space-md);">
            আপনি বিকাশ পেমেন্ট সেশনটি বাতিল করেছেন। কোনো টাকা কাটা হয়নি। আবার চেষ্টা করতে চাইলে নিচের বাটনে ক্লিক করুন।
          </p>

          <div class="flex-col gap-sm">
            <a href="#/donate" class="btn btn-primary btn-full">আবার চেষ্টা করুন</a>
            <a href="#/" class="btn btn-secondary btn-full">হোমে ফিরে যান</a>
          </div>

        </div>
      </div>
    `;
  }
};

const DonationFailurePage = {
  render: async () => {
    return `
      <div class="page-wrapper flex-center" style="min-height: calc(100vh - var(--navbar-height)); padding: var(--space-md); background: linear-gradient(135deg, #fff5f5, #f0f3ff);">
        <div class="card text-center" style="width: 100%; max-width: 480px; padding: var(--space-md); border-radius: var(--radius-xl); border: 1px solid var(--error-container);">
          
          <div style="font-size: 64px; margin-bottom: var(--space-sm);">🔴</div>
          <h1 class="headline-md" style="color: var(--error); margin-bottom: var(--space-sm);">পেমেন্ট ব্যর্থ হয়েছে</h1>
          <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6; margin-bottom: var(--space-md);">
            বিকাশ লেনদেনটি সম্পন্ন করা যায়নি। এটি পেমেন্ট গেটওয়ে সময়সীমা অতিক্রম বা স্যান্ডবক্স টেস্ট ওয়ালেটে পর্যাপ্ত ব্যালেন্স না থাকার কারণে হতে পারে।
          </p>

          <div class="flex-col gap-sm">
            <a href="#/donate" class="btn btn-primary btn-full">আবার চেষ্টা করুন</a>
            <a href="#/" class="btn btn-secondary btn-full">হোমে ফিরে যান</a>
          </div>

        </div>
      </div>
    `;
  }
};

window.DonatePage = DonatePage;
window.DonationSuccessPage = DonationSuccessPage;
window.DonationCancelPage = DonationCancelPage;
window.DonationFailurePage = DonationFailurePage;
