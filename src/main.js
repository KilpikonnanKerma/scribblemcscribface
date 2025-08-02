// main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

// IPC handlers
ipcMain.handle('save-file', async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save your legendary scribbles',
    defaultPath: 'scribble.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  }

  return { success: false };
});

ipcMain.handle('load-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Summon Ancient Scribbles',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    properties: ['openFile']
  });

  if (!canceled && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { success: true, content };
  }
  return { success: false };
});
