const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scribbleAPI', {
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  loadFile: () => ipcRenderer.invoke('load-file'),
  loadThemeFile: () => ipcRenderer.invoke('load-theme-file'),
  getTheme: () => localStorage.getItem('theme'),
  setTheme: (theme) => localStorage.setItem('theme', theme),
});

contextBridge.exposeInMainWorld('electronAPI', {
    onFullscreenChanged: (callback) => {
        ipcRenderer.on('fullscreen-changed', (event, isFullscreen) => {
            console.log('Renderer got maximize event:', isFullscreen);
            callback(isFullscreen);
        });
    }
});