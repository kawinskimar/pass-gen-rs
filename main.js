const electron = require('electron')
const {app, BrowserWindow, Menu, MenuItem} = electron
const ipc = electron.ipcMain

const path = require('path')
const url = require('url')
const fs = require('fs')
const titleCase = require('title-case')
  
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const words = JSON.parse(fs.readFileSync('./assets/words.json'))
  
function createWindow() {
// Create the browser window.
mainWindow = new BrowserWindow({width: 850, height: 500})
mainWindow.setResizable(false)
mainWindow.setMenu(null)
  
// and load the index.html of the app.
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
}))

const ctxMenu = new Menu()
ctxMenu.append(new MenuItem({ role: 'copy' }))

mainWindow.webContents.on('context-menu', function(e, params) {
  ctxMenu.popup(mainWindow, params.x, params.y)
})
  
// Open the DevTools
//mainWindow.webContents.openDevTools()

// Emitted when the window is closed.
mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
  
  // Quit when all windows are closed.
app.on('window-all-closed', () => {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') {
    app.quit()
}
})
  
app.on('activate', () => {
// On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('click:gen', function(event, args) {
  var length = args[0]
  var delim = args[1]
  var numWords = args[2]
  var addNum = args[3]

  var pass = ""
  var randWord = ""

  if(addNum) {
    pass = Math.floor(Math.random() * 100 + 1) + delim
  }
  
  for (var i = 0; i < numWords; i++) {
    randWord = words[length][Math.floor(Math.random() * words[length].length + 1)]
    pass += titleCase(randWord) + delim
  }

  event.sender.send('genWord', pass.slice(0, -1))
})