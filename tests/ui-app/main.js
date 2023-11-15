const { app, BrowserWindow } = require("electron")
const path = require("node:path")

app.whenReady().then(() => {
    const win = new BrowserWindow({
        height: 10000,
        width: 1000,
        show: false,
        webPreferences: {
            // webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.webContents.once('did-finish-load', () => {
        win.show()
        win.webContents.openDevTools()
    })
    
    win.loadURL("http://localhost:4321")
})