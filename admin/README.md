
  # Admin Dashboard Creation

  This is a code bundle for Admin Dashboard Creation. The original project is available at https://www.figma.com/design/aLhDGlXoHw2RmhZltn2S9l/Admin-Dashboard-Creation.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## Admin login setup

    The admin app now requires login before opening the dashboard.

      Default fixed credentials for web admin login:

      - Email: `admin@eduride.com`
      - Password: `Admin@123`

    1. Backend must expose `POST /api/auth/admin/login` (already added in this repo).
      2. Fixed login can be overridden in `backend/.env`:
        - `ADMIN_PANEL_EMAIL`
        - `ADMIN_PANEL_PASSWORD`
        - Optional: `ADMIN_PANEL_NAME`
        - Optional: `ADMIN_PANEL_TOKEN_SECRET`
      3. Set `FIREBASE_WEB_API_KEY` in `backend/.env` only if you also want Firebase-based admin login fallback.
    4. Ensure the admin user exists in both Firebase Auth and MongoDB with:
      - `role: "admin"`
      - `status: "active"`

    After successful login, the app stores the Firebase ID token and opens the admin panel.
  