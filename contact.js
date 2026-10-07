document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.id !== 'audit-form') return;
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;
  const status = form.querySelector('#form-status');
  status.hidden = false;
  status.textContent = 'Sending your audit request…';
  status.removeAttribute('data-error');
  button.disabled = true;
  button.textContent = 'Sending…';
  try {
    const response = await fetch('/api/audit', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your request was not sent. Please email rpdbusinessllc@gmail.com or call (330) 437-8842.');
    status.textContent = 'Your audit request has been sent. You’ll get a direct reply within 24 hours.';
    form.reset();
  } catch (error) {
    status.setAttribute('data-error', 'true');
    status.textContent = error.message === 'Failed to fetch' ? 'Your request was not sent. Please try again, email rpdbusinessllc@gmail.com, or call (330) 437-8842.' : error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'Request the Audit ↗';
  }
});
