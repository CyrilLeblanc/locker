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
});
