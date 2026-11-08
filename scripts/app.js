/**
 * ECOSTUDY MAIN APPLICATION ENTRY POINT
 * Initializes modules and global listeners
 */

import { UI } from './ui.js';
import { store } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("🌱 EcoStudy Platform Initializing...");
  UI.init();
  console.log("✅ EcoStudy Ready. Slogan: Learn Smart. Rest Well. Grow Better.");
});

