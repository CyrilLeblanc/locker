document.addEventListener('DOMContentLoaded', () => {
  let lockersData = [];
  let lockerToDelete = null;

  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

  // Fetch and render lockers
  async function loadLockers(filters = {}) {
    const tbody = document.querySelector('#lockers-table tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Loading...</td></tr>';

    try {
      let url = '/api/lockers';
      if (filters.status) {
        url += `?status=${filters.status}`;
      }

      const res = await fetch(url);
      let lockers = await res.json();
      lockersData = lockers;

      // Client-side size filter
      if (filters.size) {
        lockers = lockers.filter(l => l.size === filters.size);
      }

      if (lockers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No lockers found</td></tr>';
        return;
      }

      tbody.innerHTML = lockers.map(locker => `
        <tr>
          <td><strong>${locker.number}</strong></td>
          <td><span class="badge bg-secondary">${locker.size}</span></td>
          <td>${getStatusBadge(locker.status)}</td>
          <td>€${locker.price.toFixed(2)}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <a href="/admin/lockers/${locker._id}/edit" class="btn btn-outline-primary">Edit</a>
              <button class="btn btn-outline-danger btn-delete" data-id="${locker._id}" data-number="${locker.number}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');

      // Add delete listeners
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          lockerToDelete = btn.dataset.id;
          document.getElementById('delete-locker-number').textContent = btn.dataset.number;
          deleteModal.show();
        });
      });

    } catch (err) {
      console.error('Failed to fetch lockers:', err);
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load lockers</td></tr>';
    }
  }

  function getStatusBadge(status) {
    const badges = {
      available: 'bg-success',
      reserved: 'bg-warning text-dark',
      maintenance: 'bg-secondary'
    };
    return `<span class="badge ${badges[status] || 'bg-secondary'}">${status}</span>`;
  }

  // Filter button
  document.getElementById('btn-filter').addEventListener('click', () => {
    const status = document.getElementById('filter-status').value;
    const size = document.getElementById('filter-size').value;
    loadLockers({ status, size });
  });

  // Confirm delete
  document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if (!lockerToDelete) return;

    try {
      const res = await fetch(`/api/lockers/${lockerToDelete}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        deleteModal.hide();
        loadLockers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete locker');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete locker');
    }
  });

  // Initial load
  loadLockers();
});
