// Admin Thalassemia Matcher Page for RoktoDanBD

const AdminThalassemiaPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">Thalassemia Matching</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Verify and assist regular Thalassemia patients in finding recurring donation buddies.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-thal">🔄 Refresh Applications</button>
        </div>

        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Location</th>
                <th>Transfusion Frequency</th>
                <th>Assigned Hospital & Doctor</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-thal-tbody">
              <tr>
                <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">
                  Loading buddy match applications...
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

    const tbody = document.getElementById('admin-thal-tbody');
    const refreshBtn = document.getElementById('btn-refresh-thal');

    const fetchApplications = async () => {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">
            Refreshing buddy match applications...
          </td>
        </tr>
      `;

      try {
        const apps = await adminApi.getThalassemia();
        if (window.currentPath !== '/thalassemia') return;

        if (apps.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">
                No Thalassemia match applications open.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = apps.map(app => {
          let badgeClass = 'badge-pending';
          if (app.status === 'reviewed') badgeClass = 'badge-suspended';
          else if (app.status === 'assisted') badgeClass = 'badge-approved';

          return `
            <tr>
              <td>
                <div style="font-weight: 700;">${app.name}</div>
                ${app.note ? `<div style="font-size: 11px; color: var(--text-muted); font-style: italic; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${app.note}">Note: "${app.note}"</div>` : ''}
              </td>
              <td>${app.phone}</td>
              <td>${app.age} Yrs</td>
              <td><span style="font-weight: 700; color: var(--primary);">${app.bloodGroup}</span></td>
              <td>${app.district}</td>
              <td><strong>${app.transfusionFreq || 'Monthly'}</strong></td>
              <td>
                <div>${app.hospital || 'Not Specified'}</div>
                <div style="font-size:11px; color:var(--text-muted);">${app.doctorName ? `Dr. ${app.doctorName}` : 'No doctor listed'}</div>
              </td>
              <td><span class="badge ${badgeClass}">${app.status}</span></td>
              <td style="text-align: right;">
                <select class="form-select" style="min-height:30px; width: 110px; font-size:12px; display:inline-block; padding: 4px;" onchange="AdminThalassemiaPage.changeStatus('${app._id}', this.value)">
                  <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                  <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
                  <option value="assisted" ${app.status === 'assisted' ? 'selected' : ''}>Assisted</option>
                </select>
              </td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error(err);
        if (window.currentPath !== '/thalassemia') return;
        tbody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 32px; color: var(--danger);">
              Failed to load applications feed.
            </td>
          </tr>
        `;
      }
    };

    refreshBtn.addEventListener('click', fetchApplications);
    fetchApplications();
  },

  changeStatus: async (appId, newStatus) => {
    try {
      await adminApi.updateThalassemia(appId, newStatus);
      adminToast.success(`Application status marked as: ${newStatus}`);
      
      const activeComponent = routes[window.location.hash.slice(1) || '/'];
      if (activeComponent && activeComponent.afterRender) {
        activeComponent.afterRender();
      }
    } catch (e) {
      console.error(e);
      adminToast.error('Could not update application status.');
    }
  }
};

window.AdminThalassemiaPage = AdminThalassemiaPage;
