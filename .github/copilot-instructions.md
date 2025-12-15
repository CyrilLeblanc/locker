# Locker - Copilot Instructions

## Project Overview

Locker Reservation System built with Express 5, MongoDB/Mongoose, EJS templating, and Bootstrap 5. The app provides both a REST API and server-rendered pages for reserving lockers with automatic expiration.

## Architecture

### Dual Route System
- **API routes** (`src/routes/api/`): JSON REST endpoints under `/api/*` - use `authenticate` middleware (Bearer token)
- **Page routes** (`src/routes/pages/`): EJS-rendered pages - use `authenticatePage` middleware (cookie-based)
- Both middlewares are in `src/middlewares/auth.js` - always use the appropriate one based on route type

### Directory Structure
```
src/
├── core/           # Database connection, seeding
├── middlewares/    # Auth middlewares (authenticate, authenticatePage, isAdmin, isAdminPage)
├── models/         # Mongoose schemas with static methods
└── routes/
    ├── api/        # REST endpoints (auth, lockers, reservations)
    └── pages/      # EJS page rendering (login, register, admin/)
views/
├── layouts/main.ejs    # Base layout with Bootstrap
├── pages/              # Page templates (pass title and user)
└── partials/           # nav.ejs, footer.ejs
public/
├── css/            # Shared stylesheets
└── js/
    └── pages/      # Client-side JavaScript (organized by page/feature)
        ├── admin/  # Admin-specific scripts
        └── user/   # User-specific scripts
```

## Key Conventions

### Frontend JavaScript
- **All client-side JavaScript is externalized** to `public/js/pages/`
- No inline `<script>` tags in EJS files (except for passing server-side data)
- Each page has its own dedicated JS file (e.g., `login.js`, `admin/dashboard.js`)
- Common styles in `public/css/pages.css`
- Example: `views/pages/login.ejs` → `public/js/pages/login.js`

When adding new pages:
1. Create the EJS template in `views/pages/`
2. Create corresponding JS file in `public/js/pages/`
3. Reference JS file: `<script src="/js/pages/your-page.js"></script>`
4. Pass dynamic data via `window.CONFIG` if needed

### Mongoose Models
Models use static methods for common queries instead of direct `find()` calls:
```javascript
// In models - define static methods
lockerSchema.statics.findAvailable = function() { return this.find({ status: 'available' }); };
userSchema.statics.findUserByEmail = function(email) { return this.findOne({ email }); };

// In routes - use the static methods
const user = await User.findUserByEmail(email);
const lockers = await Locker.findAvailable();
```

### Swagger Documentation
API routes use inline swagger-autogen comments. Regenerate docs after API changes:
```bash
npm run swagger
```
Example pattern in routes:
```javascript
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Get all lockers'
// #swagger.security = [{ "bearerAuth": [] }]
```

### Authentication
- JWT tokens stored in both response body (for API) and httpOnly cookie (for pages)
- Admin routes require chaining: `authenticate, isAdmin` (API) or `authenticatePage, isAdminPage` (pages)
- Default admin seeded on startup: `admin@admin.com` / `admin`

### EJS Views
- Always pass `title` and `user` to page renders
- Use Bootstrap 5 classes (served from `/vendor/bootstrap/`)
- Admin pages fetch data client-side from API endpoints

## Development Commands

```bash
docker compose up -d     # Start MongoDB + Mongo Express
npm run dev              # Dev server with nodemon (port 3000)
npm run swagger          # Regenerate swagger-output.json
```

**URLs:**
- App: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Mongo Express: http://localhost:8081

## Environment Variables

Required in `.env`:
- `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_HOST`, `MONGO_PORT`, `MONGO_DB_NAME`
- `JWT_SECRET` (defaults to 'supersecretkey' in dev - change in production)

## Adding New Features

### New API Endpoint
1. Create route file in `src/routes/api/`
2. Add swagger comments for documentation
3. Register in `src/routes/api/index.js`
4. Run `npm run swagger` to update docs

### New Admin Page
1. Add route in `src/routes/pages/admin.js` (inherits auth middleware)
2. Create view in `views/pages/admin/`
3. Fetch data from API using client-side JavaScript with stored token
