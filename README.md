# electron-context-menu-example

![npm](https://img.shields.io/npm/v/@anujdatar/electron-context-menu.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/anujdatar/electron-context-menu-example/badge)](https://www.codefactor.io/repository/github/anujdatar/electron-context-menu-example)
![Issues](https://img.shields.io/github/issues/anujdatar/electron-context-menu-example.svg)
![GitHub](https://img.shields.io/github/license/anujdatar/electron-context-menu-example.svg)

Right-click context menus for Electron.
Detects context if click area is editable or not.

Basic menu for uneditable areas:

![copy_menu](/docs/copy_menu.png)

More complex menu for editable areas with spellcheck options:

![spellcheck_menu](/docs/spellcheck_menu.png)

Module exports a function to build electron context menus and a set of templates and classes to help build/customize said menus. Module exports:

Menu templates:

- copy: just "copy" option in menu
- paste: "paste" and "selectAll"
- reload: just "page reload"
- editor: "cut/copy/paste" and "selectAll"
- noSuggest: disabled option for when spell checker cannot find any suggested corrections

Classes:

- SuggestionMenuItem: constructor for single menu item for one spelling correction at a time, accepts string
- MenuTemplate: constructor for menu prefix or suffix object

Function:

- BuildContextMenu(): builds context menus based on arguments

```js
BuildContextMenu(menuTemplate, prefix, suffix)
  /*
    function generates context menu inside a browserwindow of an electron app

    Args:
      menuTemplate (optional): Array - contains a list of menu objects. defaults to editor menu template if no argument is passed
      prefix (optional): Object - contains any prefix options required in the ctx menu
      suffix (optional): Object - contains and suffix options required in the ctx menu
    Returns:
      Menu: Electron Menu
  */

// Usage

buildContextMenu() or buildContextMenu(menuTemplates.editor) // editor_menu for editable textareas
buildContextMenu(menuTemplates.paste) // paste_menu
// for menus with prefixs and or suffixes
buildContextMenu(menuTemplates.editor, prefix, suffix) // editor_menu - prefix and suffix
buildContextMenu(menuTemplates.copy, prefix) // copy_menu and prefix only
buildContextMenu(menuTemplates.editor, {}, suffix) // editor_menu w/ only suffix, no prefix
```

## Installation and testing

### Installing and using package with your project

```bash
npm install @anujdatar/electron-context-menu
```

### testing the included example electron app

```bash
git clone https://github.com/anujdatar/electron-context-menu-example.git
cd electron-context-menu-example
npm install

npm run start
```

installing node modules for example also rebuilds node-spellchecker using electron-rebuild.

## Usage example

```js
// in renderer or preload script
const electron = require('electron')
const remote = electron.remote
const { BuildContextMenu, menuTemplates } = require('@anujdatar/electron-context-menu')

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    let ctxMenu
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
      // if click in uneditable area
      if (window.getSelection().toString() === '') {
        // if no text selected
        ctxMenu = new BuildContextMenu(menuTemplates.reload)
      } else {
        // if text is selected
        ctxMenu = new BuildContextMenu(menuTemplates.copy)
      }
    } else {
      // if click in editable text area
      if (window.getSelection().toString() === '') {
        // if no text is selected
        ctxMenu = new BuildContextMenu(menuTemplates.paste)
      } else {
        ctxMenu = new BuildContextMenu()
      }
    }
    // popup menu
    ctxMenu.popup(remote.getCurrentWindow())
  })
```

### Menu Customization

  passing custom template
  menuTemplate: Array containing Electron.MenuItem(s)

  adding *prefix* or *suffix* menu items to the context menu
  prefix and suffix: objects
    @param: exists - boolean - *true* when you need to add menu prefix
    @param menuItems - array - containing objects
      menuItem = {
        label - string - displayed in the menu,
        click -function - activated when label clicked in ctxMenu
      }

  ```js
  // examples of function params for customization
  menuTemplate = [
    {
      label: 'Copy',
      role: 'copy'
    },
    {
      role: 'paste'
    },
    {
      label: 'Some function',
      click: function () {
        //do something
        console.log('Did something')
      }
    }
  ]

  prefix = {
    exists: true,
    menuItems: []
  }
  ```

## Thanks

[Jeff Wear](https://github.com/wearhere) and MixMax's [electron-editor-context-menu](https://github.com/mixmaxhq/electron-editor-context-menu)

## Copyright and License

Copyright 2019 Anuj Datar, licensed under MIT License

## TODO

1. Add contexts for other type of elements, eg. images, etc.
2. Any ideas?
