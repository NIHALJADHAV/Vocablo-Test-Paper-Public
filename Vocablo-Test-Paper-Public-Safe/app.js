/**
 * Namecheap cPanel / Phusion Passenger Node.js Entry Point for Vocablo GPT AI
 * 
 * In cPanel -> "Setup Node.js App":
 * - Application Root: /home/username/vocablo (or your folder)
 * - Application Startup File: app.js
 * - Node.js version: 18.x or 20.x+
 */

const path = require('path');
const fs = require('fs');

const distServer = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  console.log('[Vocablo GPT AI] Launching compiled server from dist/server.cjs...');
  require(distServer);
} else {
  console.log('[Vocablo GPT AI] Compiled server not found, starting development server...');
  require('tsx/cli').main(['server.ts']);
}
