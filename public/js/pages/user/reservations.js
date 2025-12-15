function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getStatusBadge(status) {
  const badges = {
    'active': '<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i>Active</span>',
    'expired': '<span class="badge bg-secondary"><i class="bi bi-clock me-1"></i>Expirée</span>',
    'cancelled': '<span class="badge bg-danger"><i class="bi bi-x-circle me-1"></i>Annulée</span>'
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

function getDaysRemaining(endDate) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  
  if (diff < 0) return null;
  if (diff === 0) return '<span class="text-danger fw-bold">Expire aujourd\'hui</span>';
  if (diff === 1) return '<span class="text-warning">1 jour restant</span>';
  if (diff <= 7) return `<span class="text-warning">${diff} jours restants</span>`;
  return `<span class="text-muted">${diff} jours restants</span>`;
}

async function cancelReservation(id) {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
  
  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadReservations();
    } else {
      const data = await response.json();
      alert(data.error || 'Erreur lors de l\'annulation');
    }
  } catch (err) {
    alert('Erreur lors de l\'annulation');
  }
}

function renderReservationsList(reservations, containerId, showCancelButton = false) {
  const container = document.getElementById(containerId);
  
  if (reservations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <p class="text-muted mt-3">Aucune réservation dans cette catégorie</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      ${reservations.map(r => {
        const daysRemaining = r.status === 'active' ? getDaysRemaining(r.endDate) : null;
        return `
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm ${r.status === 'active' ? 'border-start border-success border-4' : ''}">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 class="card-title mb-1">
                      <i class="bi bi-box me-1"></i>Casier ${r.locker?.number || 'N/A'}
                    </h5>
                    ${getSizeBadge(r.locker?.size)}
                  </div>
                  ${getStatusBadge(r.status)}
                </div>
                
                <div class="mb-3">
                  <div class="d-flex align-items-center text-muted mb-1">
                    <i class="bi bi-calendar-event me-2"></i>
                    <small>Début: ${formatDate(r.startDate)}</small>
                  </div>
                  <div class="d-flex align-items-center text-muted">
                    <i class="bi bi-calendar-check me-2"></i>
                    <small>Fin: ${formatDate(r.endDate)}</small>
                  </div>
                </div>
                
                ${daysRemaining ? `<p class="mb-2">${daysRemaining}</p>` : ''}
                
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-primary">${r.locker?.price?.toFixed(2) || '0.00'} €</span>
                  ${r.status === 'active' ? `
                    <button class="btn btn-outline-danger btn-sm" onclick="cancelReservation('${r._id}')">
                      <i class="bi bi-x-lg me-1"></i>Annuler
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

async function loadReservations() {
  try {
    const response = await fetch('/api/reservations');
    const reservations = await response.json();

    const active = reservations.filter(r => r.status === 'active');
    const expired = reservations.filter(r => r.status === 'expired');
    const cancelled = reservations.filter(r => r.status === 'cancelled');

    // Update counts
    document.getElementById('count-all').textContent = reservations.length;
    document.getElementById('count-active').textContent = active.length;
    document.getElementById('count-expired').textContent = expired.length;
    document.getElementById('count-cancelled').textContent = cancelled.length;

    // Render lists
    renderReservationsList(reservations, 'all-reservations');
    renderReservationsList(active, 'active-reservations');
    renderReservationsList(expired, 'expired-reservations');
    renderReservationsList(cancelled, 'cancelled-reservations');

  } catch (err) {
    console.error('Error loading reservations:', err);
    document.getElementById('all-reservations').innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Erreur lors du chargement des réservations
      </div>
    `;
  }
}

loadReservations();
