window.addEventListener('DOMContentLoaded', () => {
    const theme = window.scribbleAPI.getTheme() || 'light';
    document.documentElement.setAttribute('data-theme', theme);
})

function toggleMode() {
    const root = document.documentElement;
    const modeToggle = document.getElementById('mode-toggle');

    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    root.setAttribute('data-theme', next);
    modeToggle.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';

    window.scribbleAPI.setTheme(next);
}

function toggleMenu(id) {   
  const dropdown = document.getElementById(id);
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.menu')) {
    document.querySelectorAll('.dropdown').forEach(drop => drop.style.display = 'none');
  }
});

function toggleLines() {
  const editor = document.getElementById('editor');
  editor.classList.toggle('lined');
}

const editor = document.getElementById('editor');
const noteTitle = document.getElementById('noteTitle');
const leftBtn = document.getElementById('left-arrow');
const rightBtn = document.getElementById('right-arrow');
const removeBtn = document.getElementById('remove-tab');
const addBtn = document.getElementById('add-tab');

let tabs = [{ title: '', content: ''}];
let currentTab = 0;

function updateEditor() {
    editor.value = tabs[currentTab].content;
    noteTitle.value = tabs[currentTab].title;
    updateButtons();
}

function updateButtons() {
    leftBtn.disabled = currentTab === 0;
    rightBtn.disabled = currentTab === tabs.length - 1;
    removeBtn.disabled = tabs.length === 1;
}

function saveCurrentTabContent() {
    tabs[currentTab].content = editor.value;
    tabs[currentTab].title = noteTitle.value;
}

function setTheme(themeName) {
    const themeLink = document.getElementById('theme-style');
    themeLink.href = `themes/style-${themeName}.css`;
    document.getElementById('theme').style.display = 'none';
}

function setFontSize(size) {
    editor.style.fontSize = size + "px";
    document.getElementById('font-size').textContent = size;
    document.getElementById('font-size-dropdown').style.display = 'none';
}

async function loadCustomTheme() {
    const result = await window.scribbleAPI.loadThemeFile();
    if (result.success) {
        let customStyle = document.getElementById('custom-theme-style');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'custom-theme-style';
            document.head.appendChild(customStyle);
        }
        document.getElementById('theme-style').disabled = true;
        customStyle.textContent = result.cssContent;
    } else {
        alert('Theme load cancelled or failed.');
    }
}

leftBtn.addEventListener('click', () => {
    saveCurrentTabContent();
    if (currentTab > 0) {
        currentTab--;
        updateEditor();
    }
});

rightBtn.addEventListener('click', () => {
    saveCurrentTabContent();
    if (currentTab < tabs.length - 1) {
        currentTab++;
        updateEditor();
    }
});

addBtn.addEventListener('click', () => {
    saveCurrentTabContent();
    tabs.push({ title: '', content: '' });
    currentTab = tabs.length - 1;
    updateEditor();
});

removeBtn.addEventListener('click', () => {
    tabs.splice(currentTab, 1);
    currentTab = Math.max(0, currentTab - 1);
    updateEditor();
});

editor.addEventListener('input', () => {
    tabs[currentTab].content = editor.value;
});

noteTitle.addEventListener('input', () => {
    tabs[currentTab].title = noteTitle.value;
});

async function saveNote() {
    saveCurrentTabContent();
    const tab = tabs[currentTab];
    const content = `${tab.title}\n${tab.content}`;
    const result = await window.scribbleAPI.saveFile(content);
    if (result.success) {
        alert('Saved like a boss!');
    } else {
        alert('Save cancelled or failed.');
    }
}

async function loadNote() {
    const result = await window.scribbleAPI.loadFile();
    if (result.success) {
        const lines = result.content.split('\n');
        const title = lines.shift() || '';
        const content = lines.join('\n');
        tabs[currentTab] = { title, content };
        updateEditor();
    } else {
        alert('Load cancelled or failed.');
    }
}

editor.addEventListener("scroll", () => {
  editor.scrollTop = 0; // Force vertical scroll back to top
});

updateEditor();
