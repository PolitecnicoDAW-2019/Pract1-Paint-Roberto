const { app, BrowserWindow } = require('electron');

function createWindow() {
    let window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: { nodeIntegration: true }
    });

    window.setMenuBarVisibility(false); // For now
    window.loadFile('index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});