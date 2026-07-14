// Admin bKash Donations Logs Page for RoktoDanBD

const AdminDonationsPage = {
  render: async () => {
    return `
      <div>
        <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 class="header-title" style="font-size: 24px; margin-bottom: 4px;">Donation Transactions</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Audit log of monetary contributions received via bKash payment gateway.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-refresh-donations">🔄 Refresh Logs</button>
        </div>

        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Transaction ID (TrxID)</th>
                <th>Amount (BDT)</th>
                <th>Payment Status</th>
                <th>Purpose</th>
                <th>Date Initiated</th>
              </tr>
            </thead>
            <tbody id="admin-donations-tbody">
              <tr>
                <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">
                  Loading transactions log...
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

    const tbody = document.getElementById('admin-donations-tbody');
    const refreshBtn = document.getElementById('btn-refresh-donations');

    const fetchDonations = async () => {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">
            Refreshing transaction auditing logs...
          </td>
        </tr>
      `;

      try {
        const donations = await adminApi.getDonations();
        if (window.currentPath !== '/donations') return;

        if (donations.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-muted);">
                No bKash transactions recorded yet.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = donations.map(don => {
          let badgeClass = 'badge-pending';
          if (don.status === 'completed') badgeClass = 'badge-approved';
          else if (don.status === 'cancelled') badgeClass = 'badge-suspended';
          else if (don.status === 'failed') badgeClass = 'badge-rejected';

          return `
            <tr>
              <td><code>${don.paymentID}</code></td>
              <td><code>${don.trxID || 'Pending Execution'}</code></td>
              <td><strong>${don.amount} BDT</strong></td>
              <td><span class="badge ${badgeClass}">${don.status}</span></td>
              <td>${don.purpose || 'General Donation'}</td>
              <td>${new Date(don.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error(err);
        if (window.currentPath !== '/donations') return;
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 32px; color: var(--danger);">
              Failed to load donations history. Please check gateway.
            </td>
          </tr>
        `;
      }
    };

    refreshBtn.addEventListener('click', fetchDonations);
    fetchDonations();
  }
};

window.AdminDonationsPage = AdminDonationsPage;
