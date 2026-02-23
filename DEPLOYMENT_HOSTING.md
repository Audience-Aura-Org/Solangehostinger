Vercel deployment

- Connect the GitHub repo `Solangevercel` to Vercel:
  1. Go to https://vercel.com and sign in.
  2. Choose "Import Project" → select your GitHub repo `Solangevercel`.
  3. Use the default Next.js settings. Set the root if repo root is correct.
  4. In the "Environment Variables" section add the variables listed below (for Production and Preview as needed).
  5. Deploy. If the project has already been imported, go to Project Settings → Environment Variables and add them, then trigger a redeploy.

Required Vercel env vars (keys only — do NOT commit secret values):
- `MONGODB_URI` = <your MongoDB connection string>
- `SMTP_HOST` = <smtp host, e.g. smtp.titan.email>
- `SMTP_PORT` = <smtp port, e.g. 465>
- `SMTP_USER` = <smtp username/email>
- `SMTP_PASS` = <smtp password>
- `NEXT_PUBLIC_BASE_URL` or `NEXT_PUBLIC_SITE_URL` = https://your-deployed-domain
- `NEXTAUTH_SECRET` = <random secret> (if using next-auth or similar)
- `ADMIN_FALLBACK_EMAIL` = info@solangesignaturehair.hair (or your admin email)

Notes for Vercel:
- Add the env vars in Project → Settings → Environment Variables, then click "Redeploy".
- Vercel builds in a clean environment; secrets are available at build-time and runtime for server code.
- If you use Incremental Static Regeneration or edge functions, verify that runtime secrets are accessible where needed.

Hostinger deployment (Node.js) — options and a packaging script

Option A — Hostinger Node.js app (recommended for full Next.js server/API support):
1. In Hostinger control panel, create a new "Node.js" application (or select the Node app manager).
2. Choose Node version >=16/18/20 as required by your project.
3. Pull or upload the project (Git, SFTP, or upload a ZIP). If using Git, point to your repo and branch.
4. In the app settings, set environment variables (same keys as Vercel above) in Hostinger's environment config.
5. Set the Start Command to run the Next.js production server. Example:

```
npm ci
npm run build
npm run start
```

Or set the single start command Hostinger expects, e.g. `npm run start` (make sure `start` in `package.json` runs `next start -p $PORT` or similar).
6. Restart the Node app from the control panel.

Option B — Static export (only if your app is fully static and has no server/API routes):
- Run `next export` locally and upload the output `/out` folder into Hostinger's static hosting. This app uses API routes and server behaviour, so static export is likely not suitable.

Packaging script (Windows PowerShell) — creates a zip suitable for uploading to Hostinger or extracting on the server:
- File: `scripts/package_for_hostinger.ps1`
- What it does: installs production dependencies, builds Next.js, and zips the minimal runtime files (`.next`, `package.json`, `node_modules` (production), `public`, `next.config.js`, and any server files).

Usage (locally):

```powershell
# from repo root
powershell -ExecutionPolicy Bypass -File scripts\package_for_hostinger.ps1 -Out deploy.zip
```

After uploading to Hostinger, extract the zip, run `npm ci --production` (if node_modules missing), and run the start command.

Hostinger env vars (keys):
- `MONGODB_URI`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `NEXT_PUBLIC_BASE_URL` or `NEXT_PUBLIC_SITE_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_FALLBACK_EMAIL`

Security note
- Never commit actual secret values to the repo. Use Vercel/Hostinger dashboards to set secrets.

Checklist (quick):
- [ ] Connect `Solangevercel` repo to Vercel.
- [ ] Add env vars to Vercel and trigger redeploy.
- [ ] For Hostinger: choose Node.js app, upload or pull repo, set env vars, and run start command.
- [ ] Verify by creating a booking and confirming an email Notification record shows `status: sent` in the admin UI.
