## 2026-05-17 - [Accessible Modal Focus & Keyboard Support]
**Learning:** In a Vanilla JS app where modals are toggled by adding/removing CSS classes (e.g., '.visible'), manual focus management and global keyboard listeners are necessary since the 'dialog' element's native behaviors aren't used.
**Action:** Always save the 'document.activeElement' before opening a modal and restore it upon closure. Use 'setTimeout' or direct '.focus()' on the close button to ensure keyboard users are not lost in the background DOM.

## 2025-05-24 - [Accessible Live Notifications]
**Learning:** In a dynamic Vanilla JS environment, toast notifications are often missed by screen readers if the container isn't pre-configured with ARIA live regions.
**Action:** Ensure the toast container has `aria-live="polite"` and `aria-atomic="true"`. Dynamically created toasts should be assigned `role="status"` (for info/success) or `role="alert"` (for errors) to trigger immediate announcement.

## 2025-05-24 - [Interactive Badge Accessibility]
**Learning:** Elements styled as "badges" that trigger actions (like copying text) are invisible to keyboard and screen reader users unless explicitly marked as interactive.
**Action:** Apply `role="button"`, `tabindex="0"`, and `aria-label` to badges intended for interaction. Implement `onkeydown` listeners to support 'Enter' and 'Space' keys alongside `onclick`.

## 2025-05-24 - [Programmatic Focus for Dynamic Content]
**Learning:** When content is dynamically replaced (e.g., transitioning to a new question), screen readers may stay focused on the previous location or lose context. Programmatic focus is required to guide the user.
**Action:** Use `tabindex="-1"` on the main content container and call `.focus()` whenever the content is updated to ensure screen readers announce the new state immediately.

## 2025-05-24 - [Manual ARIA Synchronization & Focus States]
**Learning:** In a Vanilla JS app where UI state is toggled via CSS classes (e.g., `.selected-mode`), ARIA attributes (like `aria-checked` or `aria-pressed`) must be manually updated in the same event handlers to maintain screen reader accuracy.
**Action:** Always pair class toggles with `.setAttribute('aria-checked', ...)` calls. For interactive `div`s, use `:focus-visible` to provide clear keyboard focus indicators without affecting mouse users.

## 2025-05-24 - [Modal Backdrop Interaction]
**Learning:** For modals implemented as full-screen fixed overlays, users intuitively expect to close the modal by clicking the backdrop. In Vanilla JS, this requires a click listener on the overlay itself that checks if the event target is the overlay and not its children.
**Action:** Add a click listener to the modal overlay. Use `if (e.target === modalElement) closeModal();` to ensure clicks on the content card don't accidentally close the modal.

## 2025-05-24 - [Form Submission Shortcuts]
**Learning:** Power users find clicking "Submit" on repetitive forms (like theory answers) tedious. Standardizing `Ctrl + Enter` as a submission shortcut significantly improves the UX "flow".
**Action:** Implement a global keydown listener for `(e.ctrlKey || e.metaKey) && e.key === 'Enter'`. Ensure it bypasses general "isTyping" blocks to remain active while the user is focused on the input field.
