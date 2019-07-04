// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// only runs after the DOM elements are loaded, can't be loaded before that.
window.addEventListener('DOMContentLoaded', () => {
  const electron = require('electron')
  const remote = electron.remote
  const spellChecker = require('spellchecker')
  const webFrame = electron.webFrame

  const { buildCtxMenus } = require('./ctxMenus')

  // run spell check to underline all misspelled words
  webFrame.setSpellCheckProvider('en-US', {
    spellCheck (words, callback) {
      const misspelled = words.filter(word => spellChecker.isMisspelled(word))
      callback(misspelled)
    }
  })

  // generate context menu
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    // check if right-click area is an editable textarea
    const editable = e.target.closest('textarea, input, [contenteditable="true"]')

    // build and show right-click context menus using custom function
    let ctxMenu = buildCtxMenus(editable, spellChecker)
    ctxMenu.popup(remote.getCurrentWindow())
  })
})
