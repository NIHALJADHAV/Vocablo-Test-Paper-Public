# Deploying Vocablo GPT AI to Namecheap cPanel

This project is tailored for seamless deployment onto your Namecheap cPanel hosting account for your domain (`example.com` or a subdomain).

---

## Option 1: Quick Static / SPA Upload to `public_html` (Easiest & Fastest)

If your Namecheap hosting serves standard web traffic via Apache:

1. **Build the production assets**:
   ```bash
   npm run build
   ```
2. Open the generated `dist/` directory. It contains:
   - `index.html` (the primary SPA entry point)
   - `assets/` (bundled JS and CSS)
   - `.htaccess` (pre-configured for Apache SPA rewriting, Gzip compression, and caching)
3. **Upload to Namecheap File Manager**:
   - Log in to your Namecheap cPanel account.
   - Click **File Manager**.
   - Navigate to `public_html/` (or your addon domain/subdomain directory for Vocablo).
   - Click **Upload** in the top menu and upload the files inside `dist/` (or zip the `dist` folder contents and extract inside `public_html/`).
   - Ensure `.htaccess` is uploaded (in File Manager Settings, make sure "Show Hidden Files (dotfiles)" is checked).
4. **Done!** Visit `https://example.com` (or `example.com`). The interface and client-side test generator will load instantly.

---

## Option 2: Full-Stack with cPanel "Setup Node.js App"

If your Namecheap cPanel package includes CloudLinux **Setup Node.js App**:

1. In cPanel, search for and click **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: Choose `18.x` or `20.x` (or latest available).
   - **Application mode**: `Production`
   - **Application root**: `vocablo` (or your preferred app directory)
   - **Application URL**: Select your domain (`example.com`)
   - **Application startup file**: `app.js`
3. Click **Create**.
4. Upload all project files into the application root directory using File Manager or FTP.
5. In the cPanel Node.js App screen, click **Run NPM Install** (or install dependencies via SSH terminal).
6. Build the app using:
   ```bash
   npm run build
   ```
7. Click **Restart** on the Node.js application in cPanel.
8. Your full-stack Vocablo GPT AI server is now live with persistent backend storage and Gemini integration!

---

## Key Files for cPanel Alignment:

- `dist/`: Ready-to-deploy static assets with root-relative paths.
- `public/.htaccess`: Pre-configured Apache URL rewrite rule to prevent 404s when refreshing any sub-route.
- `app.js`: Compatible Passenger bootstrap entry point for cPanel Node.js application manager.
