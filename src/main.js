// main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
			enableRemoteModule: false,
		}
	});

	mainWindow.setMenu(null);
	mainWindow.loadFile('src/index.html');

	mainWindow.on('maximize', () => {
		mainWindow.webContents.send('fullscreen-changed', true);
	});

	mainWindow.on('unmaximize', () => {
		mainWindow.webContents.send('fullscreen-changed', false);
	});
}

function createSettingsWindow() {
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 600,
        height: 400,
        title: "Preferences",
        parent: mainWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

	settingsWindow.setMenu(null);
    settingsWindow.loadFile('src/settings.html');

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('open-settings', () => {
        createSettingsWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


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

ipcMain.handle('load-theme-file', async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Select a CSS Theme',
		filters: [{ name: 'CSS Files', extensions: ['css'] }],
		properties: ['openFile']
	});
	if (!canceled && filePaths.length > 0) {
		const cssPath = filePaths[0];
		const cssContent = fs.readFileSync(cssPath, 'utf-8');
		return { success: true, cssContent };
	}
	return { success: false };
});