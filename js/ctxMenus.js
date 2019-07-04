const { BuildContextMenu, menuTemplates } = require('@anujdatar/electron-context-menu')

const buildCtxMenus = function (editable, spellChecker) {
  let ctxMenu
  const selection = window.getSelection().toString()
  if (!editable && !selection) {
    // if right click in uneditable area and no text selected
    ctxMenu = BuildContextMenu(menuTemplates.reload)
  } else if (!editable && selection) {
    // if right click in uneditable area and text is selected
    ctxMenu = BuildContextMenu(menuTemplates.copy)
  } else if (editable && !selection) {
    // if right-click is in editable textarea, but no text selected
    ctxMenu = BuildContextMenu(menuTemplates.paste)
  } else {
    // right-click in editable textarea, and text is selected
    if (!spellChecker.isMisspelled(selection)) {
      // selected work spelled correctly
      ctxMenu = BuildContextMenu(menuTemplates.editor)
    } else {
      // selected word is misspelled
      const suggestions = spellChecker.getCorrectionsForMisspelling(selection).slice(0, 3)
      if (suggestions.length === 0) {
        // no corrections availabe in spellchecker
        ctxMenu = BuildContextMenu(menuTemplates.editor, menuTemplates.noSuggest)
      } else {
        // correction suggestions available
        const suggestedMenuItems = suggestions.map((suggestion) => {
          let menuItem = new menuTemplates.SuggestionMenuItem(suggestion)
          return menuItem.item
        })
        const suggestedMenu = new menuTemplates.MenuTemplate(suggestedMenuItems)
        ctxMenu = BuildContextMenu(menuTemplates.editor, suggestedMenu.menu)
      }
    }
  }

  return ctxMenu
}

module.exports = { buildCtxMenus }
