'use strict'

const { app, BrowserWindow, shell } = require('electron')
const ElectronStore = require('electron-store')
const path = require('path')

// define main window object to avoid deconstruction during
//  automatic garbage collection
let mainWindow

// electron store object
const configStore = new ElectronStore()

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './images/logo.png'),
    title: 'Electron Context Menu - Example',
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: true,
      preload: path.join(__dirname, './js/preload.js')
    }
  })

  // set window bounds based on previous session
  if (typeof configStore.get('windowBounds') !== 'undefined') {
    mainWindow.setBounds(configStore.get('windowBounds'))
  }

  // load url or file in browser window
  mainWindow.loadFile(path.join(__dirname, './html/index.html'))

  // open dev tools
  mainWindow.webContents.openDevTools()

  // emitted when window close is issued, but before object is destroyed
  mainWindow.on('close', function () {
    // store window location and size in electron store object
    configStore.set('windowBounds', mainWindow.getBounds())
  })

  // emitted after window is closed
  mainWindow.on('closed', function () {
    // delete/destroy window object
    mainWindow = null
  })

  // emitted when window is resized
  mainWindow.on('resize', function () {
    // store window location and size in electron store object
    configStore.set('windowBounds', mainWindow.getBounds())
  })
}

// electron initialized and ready
app.on('ready', function () {
  createWindow()
})

// emitted when all app windows are closed
app.on('window-all-closed', function () {
  // ########### deprecated, to be removed soon ##############
  mainWindow.webContents.unregisterServiceWorker(() => {
    console.log('Goodbye!!')
  })
  // ########################################################

  // if window or linux, quit app. on mac, wait till explicit quit
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// emitted when app icon clicked on MacOS
app.on('activate', function () {
  // for mac, if no windows exist, create new browser window
  if (mainWindow === null) {
    createWindow()
  }
})

// emitted once window content is loaded
app.on('web-contents-created', (event, contents) => {
  // when link is clicked, block new electron window
  // launch link in system default browser instead
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
