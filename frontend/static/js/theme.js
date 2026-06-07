import Storage from './storage.js';

const ThemeManager = {
  init() {
    const theme = Storage.getTheme();
    this.applyTheme(theme);
    this.setupEventListeners();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
  },

  toggleTheme() {
    const currentTheme = Storage.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  },

  setupEventListeners() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
};

// Initialize theme as soon as possible to avoid flash of unstyled content
const initialTheme = Storage.getTheme();
document.documentElement.setAttribute('data-theme', initialTheme);

// Initialize the rest when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

export default ThemeManager;
