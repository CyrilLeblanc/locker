async function fetchJson(url) {
  const response = await fetch(url);
  return response.json();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const hours = Math.round((end - start) / (1000 * 60 * 60));
  return hours === 1 ? '1 heure' : `${hours} heures`;
}

function getRemainingTime(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const remaining = end - now;
  if (remaining <= 0) return 'Expirée';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min restantes`;
  return `${minutes} min restantes`;
}

function getStatusBadge(status) {
  const badges = {
    'active': '<span class="badge bg-success">Active</span>',
    'expired': '<span class="badge bg-secondary">Expirée</span>',
    'cancelled': '<span class="badge bg-danger">Annulée</span>'
  };
  return badges[status] || status;
}

function getSizeBadge(size) {
  const badges = {
    'small': '<span class="badge bg-info">Petit</span>',
    'medium': '<span class="badge bg-warning text-dark">Moyen</span>',
    'large': '<span class="badge bg-primary">Grand</span>'
  };
  return badges[size] || size;
}

async function cancelReservation(id) {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
  
  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadData();
    } else {
      const data = await response.json();
      alert(data.error || 'Erreur lors de l\'annulation');
    }
  } catch (err) {
    alert('Erreur lors de l\'annulation');
  }
}

async function loadData() {
  try {
    const [reservations, lockers] = await Promise.all([
      fetchJson('/api/reservations'),
      fetchJson('/api/lockers')
    ]);

    const activeReservations = reservations.filter(r => r.status === 'active');
    const pastReservations = reservations.filter(r => r.status !== 'active');
    const availableLockers = lockers.filter(l => l.status === 'available');

    // Update stats
    document.getElementById('active-reservations').textContent = activeReservations.length;
    document.getElementById('available-lockers').textContent = availableLockers.length;
    document.getElementById('total-reservations').textContent = reservations.length;

    // Render active reservations
    const activeList = document.getElementById('active-reservations-list');
    if (activeReservations.length === 0) {
      activeList.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-calendar-x fs-1 text-muted"></i>
          <p class="text-muted mt-2 mb-3">Aucune réservation active</p>
          <a href="/lockers" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i>Réserver un casier
          </a>
        </div>
      `;
    } else {
      activeList.innerHTML = `
        <div class="row g-3">
          ${activeReservations.map(r => `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 border-primary border-2">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">
                      <i class="bi bi-box me-1"></i>Casier ${r.locker?.number || 'N/A'}
                    </h5>
                    ${getSizeBadge(r.locker?.size)}
                  </div>
                  <p class="card-text text-muted small mb-1">
                    <i class="bi bi-hourglass-split me-1"></i>
                    ${formatDuration(r.startDate, r.endDate)}
                  </p>
                  <p class="card-text small mb-2">
                    <i class="bi bi-clock me-1"></i>
                    <span class="text-primary fw-bold">${getRemainingTime(r.endDate)}</span>
                  </p>
                  <p class="card-text text-muted small mb-2">
                    <i class="bi bi-calendar-range me-1"></i>
                    Fin: ${formatDate(r.endDate)}
                  </p>
                  <p class="card-text">
                    <strong>${r.locker?.price?.toFixed(2) || '0.00'} €</strong>
                  </p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                  <button class="btn btn-outline-danger btn-sm w-100" onclick="cancelReservation('${r._id}')">
                    <i class="bi bi-x-lg me-1"></i>Annuler
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render history
    const historyList = document.getElementById('reservation-history');
    if (pastReservations.length === 0) {
      historyList.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-1"></i>
          <p class="mt-2">Aucun historique de réservation</p>
        </div>
      `;
    } else {
      historyList.innerHTML = `
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Casier</th>
                <th>Taille</th>
                <th>Durée</th>
                <th>Fin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${pastReservations.map(r => `
                <tr>
                  <td><i class="bi bi-box me-1"></i>${r.locker?.number || 'N/A'}</td>
                  <td>${getSizeBadge(r.locker?.size)}</td>
                  <td>${formatDuration(r.startDate, r.endDate)}</td>
                  <td>${formatDate(r.endDate)}</td>
                  <td>${getStatusBadge(r.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

loadData();
