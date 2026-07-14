// Request Card Component for RoktoDanBD (Translated to Bangla)

const RequestCard = {
  render: (request) => {
    // Determine urgency class & label
    const urgency = request.urgency || 'normal';
    let urgencyClass = 'badge-normal';
    let urgencyText = 'সাধারণ প্রয়োজন';
    let accentClass = '';

    if (urgency === 'critical') {
      urgencyClass = 'badge-critical';
      urgencyText = 'জরুরি / আশঙ্কাজনক';
      accentClass = 'critical';
    } else if (urgency === 'urgent') {
      urgencyClass = 'badge-urgent';
      urgencyText = 'অত্যন্ত জরুরি';
      accentClass = 'urgent';
    }

    // Format relative time
    const timeAgo = (dateString) => {
      const date = new Date(dateString);
      const diffMs = new Date() - date;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 1) return 'এইমাত্র';
      if (diffMin < 60) return `${diffMin} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
      return `${diffDays} দিন আগে`;
    };

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

    return `
      <div class="request-card">
        <div class="request-card-accent ${accentClass}"></div>
        <div class="request-card-body">
          <div class="blood-badge ${getBloodClass(request.bloodGroup)}" style="margin-right: 4px;">
            ${request.bloodGroup}
          </div>
          <div class="request-card-info">
            <div class="flex-between" style="margin-bottom: 4px; gap: 8px; flex-wrap: wrap;">
              <span class="badge ${urgencyClass}">${urgencyText}</span>
              <span style="font-size: 12px; color: var(--on-surface-variant);">${timeAgo(request.createdAt)}</span>
            </div>
            
            <h3 class="request-card-title">${request.bagsNeeded || 1} ব্যাগ রক্তের প্রয়োজন (${request.hospital})</h3>
            
            <div class="request-card-detail">
              <span>📍</span> 
              <span>${request.upazila ? `${request.upazila}, ` : ''}${request.district}</span>
            </div>
            
            <div class="request-card-detail">
              <span>👤</span> 
              <span>অনুরোধকারী: ${request.requesterName}</span>
            </div>

            ${request.note ? `
              <div style="font-size: 13px; font-style: italic; margin-top: 8px; padding: 8px; background: var(--surface-container-low); border-radius: var(--radius); border-left: 3px solid var(--secondary); color: var(--on-surface-variant);">
                "${request.note}"
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="request-card-footer">
          <span style="font-size: 13px; color: var(--on-surface-variant);">ভেরিফাইড অনুরোধ</span>
          <a href="tel:${request.phone}" class="btn btn-primary btn-sm">
            📞 যোগাযোগ করুন
          </a>
        </div>
      </div>
    `;
  }
};

window.RequestCard = RequestCard;
