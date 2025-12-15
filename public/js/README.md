# Frontend JavaScript Files

This directory contains all client-side JavaScript for the Locker Reservation System.

## Structure

```
pages/
├── login.js           # Handles login form submission
├── register.js        # Handles registration form submission
├── forgot-password.js # Password reset request
├── reset-password.js  # Password reset confirmation
├── admin/            # Admin-only pages
│   ├── dashboard.js  # Fetches and displays locker statistics
│   ├── lockers.js    # CRUD operations for lockers with filtering
│   ├── locker-form.js # Create/edit locker form handler
│   └── reservations.js # Admin reservation management
└── user/             # User pages
    ├── dashboard.js  # User stats and active reservations
    ├── lockers.js    # Browse, filter, and reserve lockers
    └── reservations.js # View and manage user reservations
```

## Conventions

### API Calls
All scripts make fetch requests to `/api/*` endpoints with proper error handling:

```javascript
try {
  const response = await fetch('/api/endpoint');
  const data = await response.json();
  // Handle success
} catch (err) {
  console.error('Error:', err);
  // Handle error
}
```

### DOM Manipulation
- Use `document.getElementById()` for single elements
- Use `document.querySelector()` / `querySelectorAll()` for complex selectors
- Generate HTML strings for dynamic content rendering

### Bootstrap Integration
- Modal management: `new bootstrap.Modal(element)`
- All scripts rely on Bootstrap 5 classes and components

### Global Functions
Some pages expose global functions for inline event handlers in EJS:
- `openReservationModal()` - Opens reservation modal with locker data
- `cancelReservation(id)` - Cancels a reservation
- `resetFilters()` - Resets filter form

## Page-Specific Notes

### Admin Locker Form
Receives configuration from EJS via `window.LOCKER_FORM_CONFIG`:
```javascript
{
  isEdit: boolean,
  lockerId: string
}
```

### User Lockers
Includes real-time price calculation and end-time preview for reservations.

### User Dashboard
Displays remaining time for active reservations with auto-formatting.

## Development Guidelines

1. **Error Handling**: Always wrap fetch calls in try-catch
2. **Loading States**: Show spinners/loading text while fetching data
3. **User Feedback**: Display success/error messages appropriately
4. **Validation**: Validate form inputs before submission
5. **Accessibility**: Ensure keyboard navigation and screen reader support

## Future Improvements

- [ ] Extract shared utilities to a common file
- [ ] Add client-side form validation library
- [ ] Implement proper state management
- [ ] Add real-time updates with WebSockets
- [ ] Create reusable components/modules
