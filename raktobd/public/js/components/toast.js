// Toast Notifications System for RoktoDanBD

const toast = {
  show: (title, message, type = 'success', duration = 4000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    
    // Choose icon based on type
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toastEl.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toastEl);

    // Close button handler
    const closeBtn = toastEl.querySelector('.toast-close');
    const dismiss = () => {
      toastEl.classList.add('exit');
      toastEl.addEventListener('animationend', () => {
        toastEl.remove();
      });
    };

    closeBtn.addEventListener('click', dismiss);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  },
  
  success: (message, title = 'Success') => toast.show(title, message, 'success'),
  error: (message, title = 'Error') => toast.show(title, message, 'error'),
  warning: (message, title = 'Warning') => toast.show(title, message, 'warning'),
  info: (message, title = 'Info') => toast.show(title, message, 'info')
};

window.toast = toast;
