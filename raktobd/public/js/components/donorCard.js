// Donor Card Component for RoktoDanBD (Translated to Bangla)

const DonorCard = {
  render: (donor) => {
    // Calculate blood group CSS class helper
    const getBloodClass = (group) => {
      if (group === 'A+') return 'Apos';
      if (group === 'A-') return 'Aneg';
      if (group === 'B+') return 'Bpos';
      if (group === 'B-') return 'Bneg';
      if (group === 'O+') return 'Opos';
      if (group === 'O-') return 'Oneg';
      if (group === 'AB+') return 'ABpos';
      if (group === 'AB-') return 'ABneg';
      return '';
    };

    // Format last donated date
    let donationStatusText = 'রক্তদানে প্রস্তুত';
    let isAvailable = true;
    if (donor.lastDonated) {
      const lastDate = new Date(donor.lastDonated);
      const diffTime = Math.abs(new Date() - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 120) {
        isAvailable = false;
        const remainingDays = 120 - diffDays;
        donationStatusText = `প্রস্তুত নন (${remainingDays} দিন বাকি)`;
      } else {
        const months = Math.floor(diffDays / 30);
        donationStatusText = months > 12 ? '১ বছরেরও বেশি আগে দিয়েছেন' : `${months} মাস আগে দিয়েছেন`;
      }
    }
    
    return `
      <div class="donor-card">
        <div class="donor-card-header">
          <div class="blood-badge ${getBloodClass(donor.bloodGroup)}">
            ${donor.bloodGroup}
          </div>
          <div class="donor-info">
            <h3 class="donor-name">${donor.name}</h3>
            <div class="donor-meta">
              <span class="donor-location">
                📍 ${donor.upazila ? `${donor.upazila}, ` : ''}${donor.district}
              </span>
            </div>
          </div>
        </div>
        
        <div class="donor-card-body-simple" style="font-size: 14px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--on-surface-variant);">রক্তদানের সংখ্যা:</span>
            <strong>${donor.donationCount || 0} বার</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--on-surface-variant);">অবস্থা:</span>
            <span style="font-weight: 600; color: ${isAvailable ? 'var(--success)' : 'var(--error)'}">
              ${donationStatusText}
            </span>
          </div>
        </div>

        <div class="donor-card-footer">
          ${donor.phone ? `
            <a href="tel:${donor.phone}" class="btn btn-primary btn-sm btn-full">
              📞 কল করুন
            </a>
          ` : `
            <button class="btn btn-secondary btn-sm btn-full" onclick="DonorCard.requestContact('${donor.name}', '${donor.bloodGroup}')">
              ✉️ যোগাযোগের অনুরোধ
            </button>
          `}
        </div>
      </div>
    `;
  },

  requestContact: (name, group) => {
    const isAuth = api.isAuthenticated();
    if (!isAuth) {
      toast.warning('রক্তদাতাদের সাথে সরাসরি যোগাযোগ করতে অনুগ্রহ করে লগইন করুন।');
      window.location.hash = '#/login';
      return;
    }
    
    alert(`${name} (${group}) এর সাথে যোগাযোগ করতে অনুগ্রহ করে একটি রক্তের অনুরোধ পোস্ট করুন। রক্তদাতারা সরাসরি আপনার মোবাইল নম্বরে কল করবেন।`);
    window.location.hash = '#/requests';
  }
};

window.DonorCard = DonorCard;
