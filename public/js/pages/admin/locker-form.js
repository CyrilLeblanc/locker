document.addEventListener('DOMContentLoaded', async () => {
  const isEdit = window.LOCKER_FORM_CONFIG.isEdit;
  const lockerId = window.LOCKER_FORM_CONFIG.lockerId;
  const form = document.getElementById('locker-form');
  const alertContainer = document.getElementById('alert-container');

  // If editing, load existing locker data
  if (isEdit && lockerId) {
    try {
      const res = await fetch(`/api/lockers/${lockerId}`);
      if (res.ok) {
        const locker = await res.json();
        form.elements['number'].value = locker.number;
        form.elements['size'].value = locker.size;
        form.elements['status'].value = locker.status;
        form.elements['price'].value = locker.price;
      } else {
        alert('Failed to load locker data');
      }
    } catch (err) {
      console.error('Failed to fetch locker data:', err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(isEdit ? `/api/lockers/${lockerId}` : '/api/lockers', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Locker saved successfully');
        window.location.href = '/admin/lockers';
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to save locker');
      }
    } catch (err) {
      console.error('Failed to save locker:', err);
      alert('Failed to save locker');
    }
  });
});
