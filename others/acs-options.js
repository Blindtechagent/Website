  // Store and apply theme
  function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.getElementById('theme-select').value = theme;
    localStorage.setItem('theme', theme);
}

// Store and apply text size
function applyTextSize(fontSize) {
    document.body.style.fontSize = fontSize + 'em';
    localStorage.setItem('textSize', fontSize);
}

// Store and apply underline state for links
function applyUnderlineLinks(underline) {
    document.querySelectorAll('a').forEach(link => {
        link.style.textDecoration = underline ? 'underline' : 'none';
    });
    document.getElementById('underline-toggle').checked = underline;
    localStorage.setItem('underlineLinks', underline);
}

// Initialize settings from localStorage
function initializeSettings() {
    // Apply theme
    const savedTheme = localStorage.getItem('theme') || 'default';
    applyTheme(savedTheme);

    // Apply text size
    const savedTextSize = parseFloat(localStorage.getItem('textSize')) || 1;
    applyTextSize(savedTextSize);

    // Apply underline links
    const savedUnderline = localStorage.getItem('underlineLinks') === 'true';
    applyUnderlineLinks(savedUnderline);
}

// Event listeners for accessibility panel
document.getElementById('theme-select').addEventListener('change', function () {
    applyTheme(this.value);
});

document.getElementById('increase-text').addEventListener('click', function () {
    let currentFontSize = parseFloat(document.body.style.fontSize) || 1;
    applyTextSize(currentFontSize + 0.1);
});

document.getElementById('decrease-text').addEventListener('click', function () {
    let currentFontSize = parseFloat(document.body.style.fontSize) || 1;
    if (currentFontSize > 0.6) {
        applyTextSize(currentFontSize - 0.1);
    }
});

document.getElementById('reset-text').addEventListener('click', function () {
    applyTextSize(1);
});

document.getElementById('underline-toggle').addEventListener('change', function () {
    applyUnderlineLinks(this.checked);
});

// Apply settings on page load
initializeSettings();
