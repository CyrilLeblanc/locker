document.addEventListener('DOMContentLoaded', () => {
  let reservationToCancel = null;

  const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));

  // Fetch and render reservations
  async function loadReservations(filters = {}) {
    const tbody = document.querySelector('#reservations-table tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Loading...</td></tr>';

    try {
      const res = await fetch('/api/reservations');

      if (!res.ok) {
        throw new Error('Failed to fetch reservations');
      }

      let reservations = await res.json();

      // Client-side status filter
      if (filters.status) {
        reservations = reservations.filter(r => r.status === filters.status);
      }

      if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No reservations found</td></tr>';
        return;
      }

      tbody.innerHTML = reservations.map(reservation => `
        <tr>
          <td><code>${reservation._id.slice(-6)}</code></td>
          <td><strong>${reservation.locker?.number || 'N/A'}</strong></td>
          <td>${reservation.user?.username || reservation.user || 'N/A'}</td>
          <td>${formatDate(reservation.startDate)}</td>
          <td>${formatDate(reservation.endDate)}</td>
          <td>${getStatusBadge(reservation.status)}</td>
          <td>
            ${reservation.status === 'active' ? `
              <button class="btn btn-sm btn-outline-danger btn-cancel" data-id="${reservation._id}">Cancel</button>
            ` : '-'}
          </td>
        </tr>
      `).join('');

      // Add cancel listeners
      document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
          reservationToCancel = btn.dataset.id;
          cancelModal.show();
        });
      });

    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load reservations. Make sure you are logged in as admin.</td></tr>';
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  function getStatusBadge(status) {
    const badges = {
      active: 'bg-success',
      expired: 'bg-secondary',
      cancelled: 'bg-danger'
    };
    return `<span class="badge ${badges[status] || 'bg-secondary'}">${status}</span>`;
  }

  // Filter button
  document.getElementById('btn-filter').addEventListener('click', () => {
    const status = document.getElementById('filter-status').value;
    loadReservations({ status });
  });

  // Confirm cancel
  document.getElementById('btn-confirm-cancel').addEventListener('click', async () => {
    if (!reservationToCancel) return;

    try {
      const res = await fetch(`/api/reservations/${reservationToCancel}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        cancelModal.hide();
        loadReservations();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel reservation');
      }
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel reservation');
    }
  });

  // Initial load
  loadReservations();
});
