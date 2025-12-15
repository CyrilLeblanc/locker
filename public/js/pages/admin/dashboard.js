document.addEventListener('DOMContentLoaded', async () => {
  // Fetch locker stats
  try {
    const res = await fetch('/api/lockers');
    const lockers = await res.json();

    document.getElementById('total-lockers').textContent = lockers.length;
    document.getElementById('available-lockers').textContent = lockers.filter(l => l.status === 'available').length;
    document.getElementById('reserved-lockers').textContent = lockers.filter(l => l.status === 'reserved').length;
  } catch (err) {
    console.error('Failed to fetch locker stats:', err);
  }

  // Fetch recent reservations
  try {
    const res = await fetch('/api/reservations/all');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const reservations = await res.json();
    
    const tbody = document.querySelector('#recent-reservations tbody');
    
    if (reservations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No reservations found</td></tr>';
      return;
    }

    // Show only the 5 most recent
    const recentReservations = reservations.slice(0, 5);
    
    tbody.innerHTML = recentReservations.map(reservation => {
      const startDate = new Date(reservation.startDate).toLocaleDateString();
      const endDate = new Date(reservation.endDate).toLocaleDateString();
      const lockerNumber = reservation.locker?.number || 'N/A';
      const username = reservation.user?.username || 'Unknown';
      
      let statusBadge = '';
      if (reservation.status === 'active') {
        statusBadge = '<span class="badge bg-success">Active</span>';
      } else if (reservation.status === 'returned') {
        statusBadge = '<span class="badge bg-secondary">Returned</span>';
      } else if (reservation.status === 'expired') {
        statusBadge = '<span class="badge bg-danger">Expired</span>';
      }
      
      return `
        <tr>
          <td>${lockerNumber}</td>
          <td>${username}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to fetch recent reservations:', err);
    const tbody = document.querySelector('#recent-reservations tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load reservations</td></tr>';
  }
});
