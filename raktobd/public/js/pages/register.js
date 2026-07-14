// Donor Registration Page for RoktoDanBD

const RegisterPage = {
  render: async () => {
    return `
      <div class="page-wrapper">
        <header class="page-header">
          <div class="container">
            <span class="section-tag" style="color: var(--primary);">Join Our Community</span>
            <h1 class="headline-lg">Donor Registration</h1>
            <p class="body-md">Register as a voluntary donor, verify your reports, and save lives.</p>
          </div>
        </header>

        <section class="section">
          <div class="container" style="max-width: 680px;">
            <!-- Stepper Indicators -->
            <div class="stepper" id="register-stepper">
              <div class="step active" data-step="1">
                <div class="step-circle">1</div>
                <div class="step-label">Account Info</div>
              </div>
              <div class="step" data-step="2">
                <div class="step-circle">2</div>
                <div class="step-label">Medical Details</div>
              </div>
              <div class="step" data-step="3">
                <div class="step-circle">3</div>
                <div class="step-label">Verification Docs</div>
              </div>
            </div>

            <!-- Registration Form Card -->
            <div class="card" style="padding: var(--space-md); border-radius: var(--radius-xl);">
              <form id="register-form">
                
                <!-- STEP 1: Account Info -->
                <div class="step-panel active" id="step-panel-1">
                  <h2 class="headline-sm" style="margin-bottom: var(--space-md); color: var(--secondary);">Step 1: Contact & Credentials</h2>
                  
                  <div class="form-group" style="margin-bottom: var(--space-sm);">
                    <label class="form-label required" for="reg-full-name">Full Name</label>
                    <input type="text" class="form-input" id="reg-full-name" required placeholder="e.g. Tanvir Rahman" />
                  </div>

                  <div class="form-group" style="margin-bottom: var(--space-sm);">
                    <label class="form-label required" for="reg-user-phone">Phone Number</label>
                    <input type="tel" class="form-input" id="reg-user-phone" required placeholder="01XXXXXXXXX" />
                    <span class="form-hint">Used for primary communication and login.</span>
                  </div>

                  <div class="form-group" style="margin-bottom: var(--space-sm);">
                    <label class="form-label" for="reg-user-email">Email Address</label>
                    <input type="email" class="form-input" id="reg-user-email" placeholder="email@example.com" />
                  </div>

                  <div class="form-grid" style="margin-bottom: var(--space-md);">
                    <div class="form-group">
                      <label class="form-label required" for="reg-user-pass">Password</label>
                      <input type="password" class="form-input" id="reg-user-pass" required placeholder="Min 6 characters" minlength="6" />
                    </div>
                    <div class="form-group">
                      <label class="form-label required" for="reg-user-confirm-pass">Confirm Password</label>
                      <input type="password" class="form-input" id="reg-user-confirm-pass" required placeholder="Re-type password" />
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-end;">
                    <button type="button" class="btn btn-primary" id="btn-next-step-1">Continue &rarr;</button>
                  </div>
                </div>

                <!-- STEP 2: Medical Details -->
                <div class="step-panel" id="step-panel-2">
                  <h2 class="headline-sm" style="margin-bottom: var(--space-md); color: var(--secondary);">Step 2: Medical & Demographics</h2>
                  
                  <div class="form-grid" style="margin-bottom: var(--space-sm);">
                    <div class="form-group">
                      <label class="form-label required" for="reg-user-dob">Date of Birth</label>
                      <input type="date" class="form-input" id="reg-user-dob" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label required" for="reg-user-weight">Weight (kg)</label>
                      <input type="number" class="form-input" id="reg-user-weight" required min="45" max="150" placeholder="e.g. 62" />
                    </div>
                  </div>

                  <div class="form-group" style="margin-bottom: var(--space-sm);">
                    <label class="form-label required" for="reg-user-blood">Blood Group</label>
                    <select class="form-select" id="reg-user-blood" required>
                      <option value="">Select Blood Group</option>
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

                  <div class="form-grid" style="margin-bottom: var(--space-sm);">
                    <div class="form-group">
                      <label class="form-label required" for="reg-user-district">District</label>
                      <select class="form-select" id="reg-user-district" required>
                        <option value="">Select District</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="reg-user-upazila">Upazila / Area</label>
                      <select class="form-select" id="reg-user-upazila" disabled>
                        <option value="">Select District first</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group" style="margin-bottom: var(--space-md);">
                    <label class="form-label" for="reg-user-note">Medical Note (Optional)</label>
                    <textarea class="form-textarea" id="reg-user-note" placeholder="List any medical issues, recent vaccinations, or medications if applicable..."></textarea>
                  </div>

                  <div class="flex-between">
                    <button type="button" class="btn btn-secondary" id="btn-prev-step-2">&larr; Back</button>
                    <button type="button" class="btn btn-primary" id="btn-next-step-2">Continue &rarr;</button>
                  </div>
                </div>

                <!-- STEP 3: Verification Docs -->
                <div class="step-panel" id="step-panel-3">
                  <h2 class="headline-sm" style="margin-bottom: 8px; color: var(--secondary);">Step 3: Verification Documents</h2>
                  <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: var(--space-md);">
                    Uploading files enables the admin to mark your profile as <strong>Verified</strong>. All files are optional but highly recommended.
                  </p>

                  <div class="form-grid" style="margin-bottom: var(--space-sm);">
                    <!-- Blood Report -->
                    <div class="form-group">
                      <label class="form-label">Blood Group Card / Report</label>
                      <div class="file-upload-zone" id="zone-bloodReport">
                        <div class="upload-icon">📄</div>
                        <div class="body-sm">Click to upload Blood Report</div>
                        <input type="file" id="file-bloodReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                    <!-- HB Report -->
                    <div class="form-group">
                      <label class="form-label">Hemoglobin Report</label>
                      <div class="file-upload-zone" id="zone-hbReport">
                        <div class="upload-icon">🩸</div>
                        <div class="body-sm">Click to upload Hb Report</div>
                        <input type="file" id="file-hbReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                  </div>

                  <div class="form-grid" style="margin-bottom: var(--space-sm);">
                    <!-- NID Report -->
                    <div class="form-group">
                      <label class="form-label">NID / ID Card Document</label>
                      <div class="file-upload-zone" id="zone-nidReport">
                        <div class="upload-icon">🪪</div>
                        <div class="body-sm">Click to upload NID Document</div>
                        <input type="file" id="file-nidReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                    <!-- CBC Report -->
                    <div class="form-group">
                      <label class="form-label">CBC Report</label>
                      <div class="file-upload-zone" id="zone-cbcReport">
                        <div class="upload-icon">🩺</div>
                        <div class="body-sm">Click to upload CBC Report</div>
                        <input type="file" id="file-cbcReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                  </div>

                  <div class="form-grid" style="margin-bottom: var(--space-md);">
                    <!-- Infection Report -->
                    <div class="form-group">
                      <label class="form-label">Infection Test Report</label>
                      <div class="file-upload-zone" id="zone-infReport">
                        <div class="upload-icon">🛡️</div>
                        <div class="body-sm">Click to upload Infection Report</div>
                        <input type="file" id="file-infReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                    <!-- Certificate Report -->
                    <div class="form-group">
                      <label class="form-label">Donation Certificate</label>
                      <div class="file-upload-zone" id="zone-certReport">
                        <div class="upload-icon">🎖️</div>
                        <div class="body-sm">Click to upload Certificate</div>
                        <input type="file" id="file-certReport" accept="image/*,application/pdf" />
                      </div>
                    </div>
                  </div>

                  <div class="flex-between">
                    <button type="button" class="btn btn-secondary" id="btn-prev-step-3">&larr; Back</button>
                    <button type="submit" class="btn btn-primary" id="btn-submit-registration">Submit Registration</button>
                  </div>
                </div>

              </form>
            </div>
            
            <p class="text-center body-sm" style="margin-top: var(--space-md); color: var(--on-surface-variant);">
              Already registered? <a href="#/login" style="color: var(--primary); font-weight: 600;">Sign in here</a>
            </p>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    const stepper = document.getElementById('register-stepper');
    const form = document.getElementById('register-form');
    
    // Step panels
    const panel1 = document.getElementById('step-panel-1');
    const panel2 = document.getElementById('step-panel-2');
    const panel3 = document.getElementById('step-panel-3');

    // Navigation buttons
    const next1 = document.getElementById('btn-next-step-1');
    const prev2 = document.getElementById('btn-prev-step-2');
    const next2 = document.getElementById('btn-next-step-2');
    const prev3 = document.getElementById('btn-prev-step-3');
    const submitBtn = document.getElementById('btn-submit-registration');

    // 1. Wizard Stepper Navigation logic
    const setStep = (stepNumber) => {
      // Manage steps active/done classes
      const steps = stepper.querySelectorAll('.step');
      steps.forEach(s => {
        const stepVal = parseInt(s.dataset.step);
        if (stepVal === stepNumber) {
          s.className = 'step active';
        } else if (stepVal < stepNumber) {
          s.className = 'step done';
        } else {
          s.className = 'step';
        }
      });

      // Manage panel visibility
      panel1.classList.toggle('active', stepNumber === 1);
      panel2.classList.toggle('active', stepNumber === 2);
      panel3.classList.toggle('active', stepNumber === 3);

      window.scrollTo(0, 0);
    };

    next1.addEventListener('click', () => {
      // Validate step 1 fields
      const name = document.getElementById('reg-full-name');
      const phone = document.getElementById('reg-user-phone');
      const pass = document.getElementById('reg-user-pass');
      const confirmPass = document.getElementById('reg-user-confirm-pass');

      if (!name.value.trim() || !phone.value.trim() || !pass.value || !confirmPass.value) {
        toast.error('Please fill in all credentials fields.');
        return;
      }

      if (pass.value.length < 6) {
        toast.error('Password must be at least 6 characters.');
        return;
      }

      if (pass.value !== confirmPass.value) {
        toast.error('Passwords do not match.');
        return;
      }

      setStep(2);
    });

    prev2.addEventListener('click', () => setStep(1));

    // Populate district select from BD_GEODATA
    const districtSelect = document.getElementById('reg-user-district');
    const upazilaSelect = document.getElementById('reg-user-upazila');

    if (window.BD_GEODATA) {
      window.BD_GEODATA.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.district;
        opt.textContent = d.district;
        districtSelect.appendChild(opt);
      });
    }

    districtSelect.addEventListener('change', () => {
      upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';
      const match = (window.BD_GEODATA || []).find(d => d.district === districtSelect.value);
      if (match && match.upazilas.length > 0) {
        upazilaSelect.disabled = false;
        match.upazilas.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u;
          opt.textContent = u;
          upazilaSelect.appendChild(opt);
        });
      } else {
        upazilaSelect.disabled = true;
        upazilaSelect.innerHTML = '<option value="">Select District first</option>';
      }
    });

    next2.addEventListener('click', () => {
      // Validate step 2 fields
      const dob = document.getElementById('reg-user-dob');
      const weight = document.getElementById('reg-user-weight');
      const blood = document.getElementById('reg-user-blood');
      const district = document.getElementById('reg-user-district');

      if (!dob.value || !weight.value || !blood.value || !district.value) {
        toast.error('Please fill in all medical and location fields.');
        return;
      }

      setStep(3);
    });

    prev3.addEventListener('click', () => setStep(2));

    // 2. File Upload Dropzone visual feedback logic
    const files = ['bloodReport', 'hbReport', 'nidReport', 'cbcReport', 'infReport', 'certReport'];
    files.forEach(fileKey => {
      const zone = document.getElementById(`zone-${fileKey}`);
      const input = document.getElementById(`file-${fileKey}`);

      zone.addEventListener('click', () => input.click());

      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          zone.classList.add('file-uploaded');
          zone.querySelector('.body-sm').textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        } else {
          zone.classList.remove('file-uploaded');
          zone.querySelector('.body-sm').textContent = `Click to upload ${fileKey}`;
        }
      });
    });

    // 3. Register Submission logic
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData();
      
      // Text inputs
      formData.append('name', document.getElementById('reg-full-name').value.trim());
      formData.append('phone', document.getElementById('reg-user-phone').value.trim());
      formData.append('email', document.getElementById('reg-user-email').value.trim());
      formData.append('password', document.getElementById('reg-user-pass').value);
      formData.append('dob', document.getElementById('reg-user-dob').value);
      formData.append('weight', document.getElementById('reg-user-weight').value);
      formData.append('bloodGroup', document.getElementById('reg-user-blood').value);
      formData.append('district', document.getElementById('reg-user-district').value.trim());
      formData.append('upazila', document.getElementById('reg-user-upazila').value.trim());
      formData.append('healthNote', document.getElementById('reg-user-note').value.trim());
      formData.append('role', 'donor'); // defaults to donor

      // Files
      files.forEach(fileKey => {
        const input = document.getElementById(`file-${fileKey}`);
        if (input.files && input.files[0]) {
          formData.append(fileKey, input.files[0]);
        }
      });

      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');

      try {
        await api.register(formData);
        toast.success('Registration successful! Please login once your profile is approved.');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } catch (err) {
        console.error('Registration error:', err);
        toast.error(err.message || 'Registration failed. Check inputs.');
        // Go back to the correct step if needed, or stay on step 3
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
      }
    });
  }
};

window.RegisterPage = RegisterPage;
