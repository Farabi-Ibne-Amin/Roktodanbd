// Admin Users Management Page for RoktoDanBD

const AdminUsersPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">User Directory</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Approve, reject, suspend, or view verification documents for users.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-users">🔄 Refresh List</button>
        </div>

        <!-- Users Table -->
        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>District</th>
                <th>Role</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-users-tbody">
              <tr>
                <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">
                  Loading users registry...
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

    const tbody = document.getElementById('admin-users-tbody');
    const refreshBtn = document.getElementById('btn-refresh-users');

    const fetchUsers = async () => {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">
            Refreshing users registry...
          </td>
        </tr>
      `;

      try {
        const users = await adminApi.getUsers();
        if (window.currentPath !== '/users') return;

        if (users.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">
                No users found in database.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = users.map(user => {
          let badgeClass = 'badge-pending';
          if (user.status === 'approved') badgeClass = 'badge-approved';
          else if (user.status === 'rejected') badgeClass = 'badge-rejected';
          else if (user.status === 'suspended') badgeClass = 'badge-suspended';
          else if (user.status === 'deleted') badgeClass = 'badge-deleted';

          return `
            <tr>
              <td><strong>${user.name}</strong></td>
              <td>${user.phone}</td>
              <td><span style="font-weight: 700;">${user.bloodGroup}</span></td>
              <td>${user.district}</td>
              <td><span style="font-size: 13px; text-transform: capitalize;">${user.role}</span></td>
              <td><span class="badge ${badgeClass}">${user.status}</span></td>
              <td style="text-align: right;">
                <div class="actions-cell" style="justify-content: flex-end;">
                  <button class="btn btn-secondary btn-sm" onclick="AdminUsersPage.showAuditModal('${user._id}')">
                    🔍 Review & Action
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="AdminUsersPage.deleteUser('${user._id}', '${user.name}')">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error('Failed to load users:', err);
        if (window.currentPath !== '/users') return;
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: var(--danger);">
              Error loading registry. Please check server.
            </td>
          </tr>
        `;
      }
    };

    refreshBtn.addEventListener('click', fetchUsers);
    fetchUsers();
  },

  // Modal inspector logic
  showAuditModal: async (userId) => {
    const modalOverlay = document.getElementById('admin-modal-overlay');
    const modalContainer = document.getElementById('admin-modal-container');
    
    modalOverlay.classList.remove('hidden');
    modalContainer.classList.remove('hidden');

    modalContainer.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">Donor Profile Verification</h3>
        <button class="modal-close-btn" onclick="AdminUsersPage.closeModal()" style="font-size: 24px;">&times;</button>
      </div>
      <div class="modal-body" style="text-align: center; padding: 40px;">
        <div class="spinner" style="margin: 0 auto 16px;"></div>
        <p>Fetching complete profile verification details...</p>
      </div>
    `;

    try {
      const user = await adminApi.getUserDetails(userId);
      
      const fileTypes = [
        { key: 'bloodReport', label: 'Blood Card / Report' },
        { key: 'hbReport', label: 'Hemoglobin (Hb) Report' },
        { key: 'nidReport', label: 'NID / Identity File' },
        { key: 'cbcReport', label: 'CBC Diagnostic Report' },
        { key: 'infReport', label: 'Infection Test Card' },
        { key: 'certReport', label: 'Donation Certificate' }
      ];

      const docsHtml = fileTypes.map(doc => {
        const file = user.files && user.files[doc.key];
        const hasFile = file && file.url;

        return `
          <div class="doc-card">
            <div>
              <div class="doc-name">${doc.label}</div>
              <span style="font-size:11px; color:${hasFile ? 'var(--success)' : 'var(--text-muted)'}; font-weight:600;">
                ${hasFile ? '📄 Attached' : '❌ Missing'}
              </span>
            </div>
            ${hasFile ? `
              <a href="${file.url}" target="_blank" class="btn btn-secondary btn-sm" style="height: 28px; padding-inline: 10px;">
                Open &rarr;
              </a>
            ` : `
              <button disabled class="btn btn-secondary btn-sm" style="height: 28px; opacity:0.4;">None</button>
            `}
          </div>
        `;
      }).join('');

      modalContainer.innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Verification Inspector: ${user.name}</h3>
          <button onclick="AdminUsersPage.closeModal()" style="font-size: 24px;">&times;</button>
        </div>
        
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 13px;">
            <div>
              <p><strong>Phone:</strong> ${user.phone}</p>
              <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
              <p><strong>Blood Group:</strong> <span style="color:var(--primary); font-weight:700;">${user.bloodGroup}</span></p>
              <p><strong>Weight:</strong> ${user.weight ? `${user.weight} kg` : 'N/A'}</p>
            </div>
            <div>
              <p><strong>Date of Birth:</strong> ${user.dob || 'N/A'}</p>
              <p><strong>Location:</strong> ${user.upazila ? `${user.upazila}, ` : ''}${user.district}</p>
              <p><strong>Donations:</strong> ${user.donationCount || 0} times</p>
              <p><strong>Status:</strong> <span class="badge badge-pending" id="modal-badge-status" style="text-transform: capitalize;">${user.status}</span></p>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <p><strong>Health note:</strong></p>
            <div style="background:#f8fafc; padding:10px; border-radius:var(--radius); font-size:13px; font-style:italic; border-left:3px solid var(--secondary); margin-top:4px;">
              "${user.healthNote || 'No additional note provided by donor.'}"
            </div>
          </div>

          <h4 style="font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 4px;">Uploaded Documents</h4>
          <div class="doc-links-grid">
            ${docsHtml}
          </div>

          <div style="margin-top: 24px;">
            <div class="form-group">
              <label class="form-label" for="modal-admin-note">Administrator Audit Note</label>
              <textarea class="form-textarea" id="modal-admin-note" placeholder="Write reason for rejection, verification remarks, or suspension parameters..." style="min-height: 70px;">${user.adminNote || ''}</textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" onclick="AdminUsersPage.closeModal()">Cancel</button>
          
          <div class="actions-cell">
            <button class="btn btn-danger btn-sm" onclick="AdminUsersPage.updateStatus('${user._id}', 'reject')">
              ❌ Reject Profile
            </button>
            <button class="btn btn-secondary btn-sm" onclick="AdminUsersPage.updateStatus('${user._id}', 'suspend')">
              ⚠️ Suspend User
            </button>
            <button class="btn btn-success btn-sm" onclick="AdminUsersPage.updateStatus('${user._id}', 'approve')">
              ✅ Approve & Verify
            </button>
          </div>
        </div>
      `;

      // Adjust badge class in modal dynamically
      const statusBadge = document.getElementById('modal-badge-status');
      if (user.status === 'approved') statusBadge.className = 'badge badge-approved';
      else if (user.status === 'pending') statusBadge.className = 'badge badge-pending';
      else if (user.status === 'suspended') statusBadge.className = 'badge badge-suspended';
      else statusBadge.className = 'badge badge-rejected';

    } catch (e) {
      console.error(e);
      modalContainer.innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">Verification Error</h3>
          <button onclick="AdminUsersPage.closeModal()" style="font-size: 24px;">&times;</button>
        </div>
        <div class="modal-body" style="color: var(--danger); text-align: center; padding: 40px;">
          Failed to retrieve user details. Please check server.
        </div>
      `;
    }
  },

  closeModal: () => {
    document.getElementById('admin-modal-overlay').classList.add('hidden');
    document.getElementById('admin-modal-container').classList.add('hidden');
  },

  updateStatus: async (userId, action) => {
    const adminNote = document.getElementById('modal-admin-note').value.trim();
    
    try {
      if (action === 'approve') {
        await adminApi.approveUser(userId, { adminNote });
        adminToast.success('User profile marked as Approved.');
      } else if (action === 'reject') {
        await adminApi.rejectUser(userId, { adminNote });
        adminToast.success('User registration rejected.');
      } else if (action === 'suspend') {
        await adminApi.suspendUser(userId, { adminNote });
        adminToast.success('User profile suspended.');
      }
      
      AdminUsersPage.closeModal();
      
      // Refresh user grid
      const activeComponent = routes[window.location.hash.slice(1) || '/'];
      if (activeComponent && activeComponent.afterRender) {
        activeComponent.afterRender();
      }
    } catch (err) {
      console.error(err);
      adminToast.error(err.message || 'Failed to update user status.');
    }
  },

  deleteUser: async (userId, name) => {
    if (!confirm(`Are you absolutely sure you want to delete donor ${name}? This action soft-deletes the user profile.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      adminToast.success('Donor deleted successfully.');
      
      // Refresh list
      const activeComponent = routes[window.location.hash.slice(1) || '/'];
      if (activeComponent && activeComponent.afterRender) {
        activeComponent.afterRender();
      }
    } catch (err) {
      console.error(err);
      adminToast.error('Could not delete user.');
    }
  }
};

window.AdminUsersPage = AdminUsersPage;
