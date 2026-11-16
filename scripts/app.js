/**
 * ECOSTUDY MAIN APPLICATION ENTRY POINT (VERSION 2.0)
 * Initializes reactive modules, state store, UI router and global bindings.
 * Concept: Learn Smart. Rest Well. Grow Better.
 */

import { UI } from './ui.js';
import { store } from './state.js';
import { EcoAlgorithms } from './algorithms.js';

// Expose globally for browser console inspection & testing
window.EcoStudy = {
  UI,
  store,
  algorithms: EcoAlgorithms
};

document.addEventListener('DOMContentLoaded', () => {
  console.log("🌱 EcoStudy Platform 2.0 Initializing...");
  UI.init();
  console.log("✅ EcoStudy 2.0 Ready! Concept: Learn Smart. Rest Well. Grow Better.");
});
