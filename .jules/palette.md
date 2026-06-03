## 2025-05-15 - Vanilla JS ARIA Sync & Module Exposure
**Learning:** In Vanilla JS, dynamic UI state changes (like toggling host settings) require manual ARIA attribute synchronization to remain accessible. Additionally, when using ES modules, objects must be explicitly attached to `window` to be accessible from inline HTML `onclick` handlers.
**Action:** Use `Lobby.updateSubjectUI(this)` and ensure `window.Lobby` is assigned in the template. Synchronize `aria-pressed` in all toggle handlers.
