let allLockers = [];

function getSizeLabel(size) {
  const labels = { 'small': 'Petit', 'medium': 'Moyen', 'large': 'Grand' };
  return labels[size] || size;
}

function getSizeBadgeClass(size) {
  const classes = { 'small': 'bg-info', 'medium': 'bg-warning text-dark', 'large': 'bg-primary' };
  return classes[size] || 'bg-secondary';
}

function getSizeIcon(size) {
  const icons = { 'small': 'bi-box', 'medium': 'bi-box-seam', 'large': 'bi-boxes' };
  return icons[size] || 'bi-box';
}

function getSizeOrder(size) {
  const order = { 'small': 1, 'medium': 2, 'large': 3 };
  return order[size] || 0;
}

function filterAndRender() {
  const sizeFilter = document.getElementById('filter-size').value;
  const priceFilter = parseFloat(document.getElementById('filter-price').value) || Infinity;
  const sortBy = document.getElementById('sort-by').value;

  let filtered = allLockers.filter(l => l.status === 'available');

  if (sizeFilter) {
    filtered = filtered.filter(l => l.size === sizeFilter);
  }

  if (priceFilter !== Infinity) {
    filtered = filtered.filter(l => l.price <= priceFilter);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'size': return getSizeOrder(a.size) - getSizeOrder(b.size);
      default: return a.number.localeCompare(b.number, undefined, { numeric: true });
    }
  });

  renderLockers(filtered);
}

function renderLockers(lockers) {
  const grid = document.getElementById('lockers-grid');
  document.getElementById('results-count').textContent = lockers.length;

  if (lockers.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5">
          <i class="bi bi-search fs-1 text-muted"></i>
          <p class="text-muted mt-3">Aucun casier disponible avec ces critères</p>
          <button class="btn btn-outline-primary" onclick="resetFilters()">
            Voir tous les casiers
          </button>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = lockers.map(locker => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100 border-0 shadow-sm locker-card">
        <div class="card-body text-center">
          <div class="mb-3">
            <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
              <i class="bi ${getSizeIcon(locker.size)} fs-1 text-primary"></i>
            </div>
          </div>
          <h5 class="card-title">Casier ${locker.number}</h5>
          <span class="badge ${getSizeBadgeClass(locker.size)} mb-2">${getSizeLabel(locker.size)}</span>
          <p class="card-text">
            <span class="fs-4 fw-bold text-primary">${locker.price.toFixed(2)} €</span>
          </p>
        </div>
        <div class="card-footer bg-transparent border-top-0 pb-3">
          <button class="btn btn-primary w-100" onclick="openReservationModal('${locker._id}', '${locker.number}', '${locker.size}', ${locker.price})">
            <i class="bi bi-calendar-plus me-1"></i>Réserver
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function resetFilters() {
  document.getElementById('filter-size').value = '';
  document.getElementById('filter-price').value = '';
  document.getElementById('sort-by').value = 'number';
  filterAndRender();
}

function openReservationModal(id, number, size, price) {
  document.getElementById('modal-locker-id').value = id;
  document.getElementById('modal-locker-number').textContent = number;
  document.getElementById('modal-locker-size').textContent = getSizeLabel(size);
  document.getElementById('modal-locker-price').textContent = price.toFixed(2);
  document.getElementById('modal-locker-price-value').value = price;
  document.getElementById('reservation-error').classList.add('d-none');
  document.getElementById('reservation-form').reset();
  document.getElementById('hours').value = 1;
  updateReservationPreview();
  
  new bootstrap.Modal(document.getElementById('reservationModal')).show();
}

function updateReservationPreview() {
  const hours = parseInt(document.getElementById('hours').value) || 1;
  const price = parseFloat(document.getElementById('modal-locker-price-value').value) || 0;
  
  // Update end time preview
  const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);
  document.getElementById('end-time-preview').textContent = endTime.toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Update total price preview
  const totalPrice = hours * price;
  document.getElementById('total-price-preview').textContent = totalPrice.toFixed(2);
}

async function confirmReservation() {
  const lockerId = document.getElementById('modal-locker-id').value;
  const hours = parseInt(document.getElementById('hours').value);
  const errorDiv = document.getElementById('reservation-error');

  if (!hours || hours < 1) {
    errorDiv.textContent = 'Veuillez sélectionner une durée valide';
    errorDiv.classList.remove('d-none');
    return;
  }

  if (hours > 72) {
    errorDiv.textContent = 'La durée maximale est de 72 heures';
    errorDiv.classList.remove('d-none');
    return;
  }

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lockerId, hours })
    });

    const data = await response.json();

    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById('reservationModal')).hide();
      // Redirect to dashboard with success message
      window.location.href = '/dashboard';
    } else {
      errorDiv.textContent = data.error || 'Erreur lors de la réservation';
      errorDiv.classList.remove('d-none');
    }
  } catch (err) {
    errorDiv.textContent = 'Erreur de connexion au serveur';
    errorDiv.classList.remove('d-none');
  }
}

async function loadLockers() {
  try {
    const response = await fetch('/api/lockers');
    allLockers = await response.json();
    filterAndRender();
  } catch (err) {
    console.error('Error loading lockers:', err);
    document.getElementById('lockers-grid').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Erreur lors du chargement des casiers
        </div>
      </div>
    `;
  }
}

// Event listeners
document.getElementById('filter-size').addEventListener('change', filterAndRender);
document.getElementById('filter-price').addEventListener('input', filterAndRender);
document.getElementById('sort-by').addEventListener('change', filterAndRender);
document.getElementById('confirm-reservation').addEventListener('click', confirmReservation);
document.getElementById('hours').addEventListener('input', updateReservationPreview);

loadLockers();
