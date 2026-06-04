/* SilentSpeak — Global JS */

// Auto-dismiss toasts
document.addEventListener('DOMContentLoaded', () => {
  const toasts = document.querySelectorAll('.toast');
  toasts.forEach((t, i) => {
    setTimeout(() => {
      t.style.transition = 'opacity 0.4s, transform 0.4s';
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      setTimeout(() => t.remove(), 400);
    }, 3500 + i * 500);
  });

  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = '';
      } else {
        input.type = 'password';
        eyeOpen.style.display = '';
        eyeClosed.style.display = 'none';
      }
    });
  });

  // Login form loading state
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', () => {
      const btn = document.getElementById('submitBtn');
      if (btn) {
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-loader').style.display = '';
        btn.disabled = true;
      }
    });
  }
});
