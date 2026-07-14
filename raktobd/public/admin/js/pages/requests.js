// Admin Blood Requests Audit Page for RoktoDanBD

const AdminRequestsPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">Emergency Requests</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Review active emergency requests or close expired posts.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-requests">🔄 Refresh Feed</button>
        </div>

        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Phone</th>
                <th>Blood Needed</th>
                <th>Bags</th>
                <th>Hospital & Area</th>
                <th>Urgency</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-requests-tbody">
              <tr>
                <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
                  Loading active emergencies...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    if (!adminApi.isAuthenticated()) return;

    const tbody = document.getElementById('admin-requests-tbody');
    const refreshBtn = document.getElementById('btn-refresh-requests');

    const fetchRequests = async () => {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
            Refreshing active emergencies...
          </td>
        </tr>
      `;

      try {
        const requests = await adminApi.getRequests();
        if (window.currentPath !== '/requests') return;

        if (requests.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
                No blood requests open in database.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = requests.map(req => {
          let badgeClass = 'badge-pending';
          if (req.status === 'open') badgeClass = 'badge-approved';
          else if (req.status === 'fulfilled') badgeClass = 'badge-normal'; // custom style
          else if (req.status === 'expired') badgeClass = 'badge-rejected';
          else if (req.status === 'closed') badgeClass = 'badge-suspended';

          // Urgency Chip
          let urgChip = `<span class="badge badge-pending">${req.urgency}</span>`;
          if (req.urgency === 'critical') urgChip = `<span class="badge badge-rejected" style="animation: pulse-critical 2s infinite;">${req.urgency}</span>`;
          else if (req.urgency === 'urgent') urgChip = `<span class="badge badge-pending">${req.urgency}</span>`;

          return `
            <tr>
              <td><strong>${req.requesterName}</strong></td>
              <td>${req.phone}</td>
              <td><span style="font-weight: 700; color: var(--primary);">${req.bloodGroup}</span></td>
              <td>${req.bagsNeeded || 1} Bag(s)</td>
              <td>
                <div style="font-weight: 600;">${req.hospital}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${req.upazila ? `${req.upazila}, ` : ''}${req.district}</div>
              </td>
              <td>${urgChip}</td>
              <td><span class="badge ${badgeClass}">${req.status}</span></td>
              <td style="text-align: right;">
                <select class="form-select" style="min-height:30px; width: 120px; font-size:12px; display:inline-block; padding: 4px;" onchange="AdminRequestsPage.changeStatus('${req._id}', this.value)">
                  <option value="open" ${req.status === 'open' ? 'selected' : ''}>Open</option>
                  <option value="fulfilled" ${req.status === 'fulfilled' ? 'selected' : ''}>Fulfilled</option>
                  <option value="expired" ${req.status === 'expired' ? 'selected' : ''}>Expired</option>
                  <option value="closed" ${req.status === 'closed' ? 'selected' : ''}>Closed</option>
                  <option value="deleted" ${req.status === 'deleted' ? 'selected' : ''}>Deleted</option>
                </select>
              </td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error(err);
        if (window.currentPath !== '/requests') return;
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 32px; color: var(--danger);">
              Failed to load emergencies log.
            </td>
          </tr>
        `;
      }
    };

    refreshBtn.addEventListener('click', fetchRequests);
    fetchRequests();
  },

  changeStatus: async (reqId, newStatus) => {
    try {
      await adminApi.updateRequest(reqId, { status: newStatus });
      adminToast.success(`Request status updated to: ${newStatus}`);
      
      // Refresh current component after state updates
      const activeComponent = routes[window.location.hash.slice(1) || '/'];
      if (activeComponent && activeComponent.afterRender) {
        activeComponent.afterRender();
      }
    } catch (e) {
      console.error(e);
      adminToast.error('Could not update request status.');
    }
  }
};

window.AdminRequestsPage = AdminRequestsPage;
