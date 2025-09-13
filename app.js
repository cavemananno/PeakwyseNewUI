// Element References
const menu = document.getElementById('sideMenu');
const hoverZone = document.getElementById('hoverZone');
const customizationPanel = document.getElementById('customizationPanel');
const toggleCustomizerBtn = document.getElementById('toggleCustomizerBtn');
const bgColorPicker = document.getElementById('bgColorPicker');
const textColorPicker = document.getElementById('textColorPicker');
const darkModeToggle = document.getElementById('darkModeToggle');
const resetBtn = document.getElementById('resetBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const toggleSwitch = darkModeToggle.querySelector('.toggle-switch');
const menuLinks = document.getElementById('menuLinks'); // <-- NEW

const defaultColors = {
  bg: '#ffffff',
  text: '#1d1e20'
};

// Function: Update Toggle Thumb
function updateTogglePosition(isDark) {
  toggleSwitch.classList.toggle('active', isDark);
  darkModeToggle.setAttribute('aria-checked', isDark.toString());
}

// Function: Apply saved settings
function applyThemeSettings() {
  const savedBg = localStorage.getItem('bg-color') || defaultColors.bg;
  const savedText = localStorage.getItem('text-color') || defaultColors.text;
  const savedTheme = localStorage.getItem('theme');

  document.documentElement.style.setProperty('--bg-color', savedBg);
  document.documentElement.style.setProperty('--text-color', savedText);
  bgColorPicker.value = savedBg;
  textColorPicker.value = savedText;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

  document.body.classList.toggle('dark', isDark);
  updateTogglePosition(isDark);
}

// Function: Toggle Dark Mode
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateTogglePosition(isDark);
}

// Function: Toggle Mobile Menu
function toggleMobileMenu() {
  const isVisible = menu.classList.toggle('show');
  mobileMenuBtn.classList.toggle('active', isVisible);
  mobileMenuBtn.setAttribute('aria-expanded', isVisible.toString());
}

// Function: Close Mobile Menu on Resize
function handleResize() {
  if (window.innerWidth > 768) {
    menu.classList.remove('show');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
}

// Function: Reset Theme Settings
function resetTheme() {
  localStorage.clear();
  document.documentElement.style.setProperty('--bg-color', defaultColors.bg);
  document.documentElement.style.setProperty('--text-color', defaultColors.text);
  bgColorPicker.value = defaultColors.bg;
  textColorPicker.value = defaultColors.text;

  document.body.classList.remove('dark');
  updateTogglePosition(false);

  customizationPanel.classList.remove('active');
  customizationPanel.setAttribute('aria-hidden', 'true');
  menuLinks.classList.remove('hidden'); // Show menu links after reset
}

// Event: Load saved settings
window.addEventListener('DOMContentLoaded', () => {
  applyThemeSettings();

  // Ensure menu links are visible, and customization panel is hidden
  menuLinks.classList.remove('hidden');
  customizationPanel.classList.remove('active');
  customizationPanel.setAttribute('aria-hidden', 'true');
});

// Event: Background color change
bgColorPicker.addEventListener('input', e => {
  const color = e.target.value;
  document.documentElement.style.setProperty('--bg-color', color);
  localStorage.setItem('bg-color', color);
});

// Event: Text color change
textColorPicker.addEventListener('input', e => {
  const color = e.target.value;
  document.documentElement.style.setProperty('--text-color', color);
  localStorage.setItem('text-color', color);
});

// Event: Toggle dark mode (click & keyboard)
darkModeToggle.addEventListener('click', toggleDarkMode);
darkModeToggle.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleDarkMode();
  }
});

// ✅ Event: Toggle customizer panel and hide/show menu links
toggleCustomizerBtn.addEventListener('click', () => {
  const isCustomizationActive = customizationPanel.classList.toggle('active');
  customizationPanel.setAttribute('aria-hidden', (!isCustomizationActive).toString());

  // Show/hide menu links accordingly
  if (isCustomizationActive) {
    menuLinks.classList.add('hidden');
  } else {
    menuLinks.classList.remove('hidden');
  }
});

// Event: Reset button
resetBtn.addEventListener('click', resetTheme);

// Event: Show menu on hover (desktop only)
hoverZone.addEventListener('mouseenter', () => {
  if (window.innerWidth > 768) {
    menu.classList.add('show');
  }
});
menu.addEventListener('mouseleave', () => {
  if (window.innerWidth > 768) {
    menu.classList.remove('show');
  }
});

// Event: Mobile menu toggle button
mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Event: Close mobile menu on screen resize
window.addEventListener('resize', handleResize);

// Function: Toggle Menu visibility
function toggleMenuVisibility() {
  const isVisible = menu.classList.contains('show');

  // If the menu is hidden, hide the customization panel
  if (!isVisible) {
    customizationPanel.classList.remove('active');
    customizationPanel.setAttribute('aria-hidden', 'true');
    menuLinks.classList.remove('hidden');
  }
}

// Event: When the menu is toggled (show/hide)
menu.addEventListener('transitionend', toggleMenuVisibility);

// Event: Ensure customization panel closes when mobile menu closes
mobileMenuBtn.addEventListener('click', () => {
  const isVisible = menu.classList.contains('show');

  if (!isVisible) {
    customizationPanel.classList.remove('active');
    customizationPanel.setAttribute('aria-hidden', 'true');
    menuLinks.classList.remove('hidden');
  }
});

// Apply directional glow effect on hover
const buttons = document.querySelectorAll(
  '.menu button, .menu-link-btn, .reset-button, .customize-icon-btn, .delete-btn'
);


// Add glow class to target buttons
buttons.forEach(btn => {
  btn.classList.add('button-glow');

  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--glow-x', `${x}px`);
    btn.style.setProperty('--glow-y', `${y}px`);

    btn.style.setProperty(
      '--glow-gradient',
      `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15), transparent 60%)`
    );
    btn.querySelector('::after');
  });

  btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--glow-gradient', 'transparent');
    });
});

// ==========================
// Add Dynamic Items with Drag Support
// ==========================

const mainContainer = document.getElementById('mainContainer');
const addItemBtn = document.getElementById('addItemBtn');
let dragSrcEl = null;

// Utility to update serial numbers
function updateSerials() {
  const items = mainContainer.querySelectorAll('.dynamic-item');
  items.forEach((item, index) => {
    const serial = item.querySelector('.dynamic-serial');
    serial.textContent = index + 1;
  });
}

// Get modal and buttons references
const confirmModal = document.getElementById('confirmModal');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');


/**
 * Show the confirmation modal and return a Promise
 * that resolves to true if user confirms, false otherwise.
 */
function showDeleteConfirmation() {
  return new Promise((resolve) => {
    // Show the modal
    confirmModal.setAttribute('aria-hidden', 'false');
    confirmModal.style.display = 'flex';

    // Handler for Yes button
    function onYes() {
      cleanup();
      resolve(true);
    }

    // Handler for No button or modal close
    function onNo() {
      cleanup();
      resolve(false);
    }

    // Cleanup event listeners and hide modal
    function cleanup() {
      confirmModal.setAttribute('aria-hidden', 'true');
      confirmModal.style.display = 'none';

      confirmYesBtn.removeEventListener('click', onYes);
      confirmNoBtn.removeEventListener('click', onNo);
    }

    confirmYesBtn.addEventListener('click', onYes);
    confirmNoBtn.addEventListener('click', onNo);
  });
}


function createItem() 
{
  const item = document.createElement('div');
  item.className = 'dynamic-item button-glow';
  item.setAttribute('draggable', true);

  item.innerHTML = `
    <div class="dynamic-serial">0</div>
    <input type="text" placeholder="Name">
    <select>
      <option value="">Select</option>
      <option value="text">Text</option>
      <option value="date">Date</option>
      <option value="integer">Number (Integer)</option>
      <option value="decimal">Number (Decimal)</option>
      <option value="image">Image</option>
    </select>
    <button class="delete-btn button-glow" aria-label="Delete Item">&times;</button>
  `;

  // Delete button logic
  const deleteBtn = item.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', async () => {
  const confirmed = await showDeleteConfirmation();
  if (confirmed) {
    item.remove();
    updateSerials();
  }
});


  // Drag events (unchanged)
  item.addEventListener('dragstart', function (e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    this.classList.add('dragging');
  });

  item.addEventListener('dragover', function (e) {
    e.preventDefault();
    this.style.border = '2px dashed var(--text-color)';
  });

  item.addEventListener('dragleave', function () {
    this.style.border = '';
  });

  item.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.border = '';

    if (dragSrcEl !== this) {
      const draggedIndex = Array.from(mainContainer.children).indexOf(dragSrcEl);
      const targetIndex = Array.from(mainContainer.children).indexOf(this);

      if (draggedIndex < targetIndex) {
        this.after(dragSrcEl);
      } else {
        this.before(dragSrcEl);
      }

      updateSerials();
    }
  });

  item.addEventListener('dragend', function () {
    this.classList.remove('dragging');
    const items = mainContainer.querySelectorAll('.dynamic-item');
    items.forEach(i => i.style.border = '');
  });

  return item;
}




// Add drag handlers to all items (needed after re-drop)
function addDragHandlers() 
{
  const items = mainContainer.querySelectorAll('.dynamic-item');
  items.forEach(item => {
    // Delete button logic for existing items
    const deleteBtn = item.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
      const confirmed = await showDeleteConfirmation();
      if (confirmed) {
        item.remove();
        updateSerials();
      }
    });

    }

    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', function (e) {
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
      this.classList.add('dragging');
    });

    item.addEventListener('dragover', function (e) {
      e.preventDefault();
      this.style.border = '2px dashed var(--text-color)';
    });

    item.addEventListener('dragleave', function () {
      this.style.border = '';
    });

    item.addEventListener('drop', function (e) {
    e.preventDefault();
    this.style.border = '';

    if (dragSrcEl !== this) {
      const draggedIndex = Array.from(mainContainer.children).indexOf(dragSrcEl);
      const targetIndex = Array.from(mainContainer.children).indexOf(this);

      if (draggedIndex < targetIndex) {
        this.after(dragSrcEl);
      } else {
        this.before(dragSrcEl);
      }

      updateSerials();
    }
  });

    item.addEventListener('dragend', function () {
      this.classList.remove('dragging');
      const items = mainContainer.querySelectorAll('.dynamic-item');
      items.forEach(i => i.style.border = '');
    });
  });
}


// Button click to add item
addItemBtn.addEventListener('click', () => {
  const item = createItem();
  mainContainer.appendChild(item);
  updateSerials();
});


// Element references
const addMultipleInput = document.getElementById('addMultipleInput'); // Input for number of items

// Function to add multiple items based on input value
function addMultipleItems() {
  const numItems = parseInt(addMultipleInput.value) || 1; // Default to 1 if input is empty or invalid

  if (numItems <= 0) return; // Prevent adding 0 or negative items

  // Create and append items
  for (let i = 0; i < numItems; i++) {
    const item = createItem();
    mainContainer.appendChild(item);
  }

  updateSerials(); // Update serial numbers after adding the items
  addMultipleInput.value = ''; // Clear the input after adding items
}

// Event listener for pressing "Enter" in the input field (adds multiple items)
addMultipleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent the default behavior (e.g., form submission)
    addMultipleItems(); // Adds multiple items when Enter is pressed
  }
});

