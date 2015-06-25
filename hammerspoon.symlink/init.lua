local action = require 'action'
require 'utils'
hs.window.animationDuration = 0     -- Disable window animations (janky for iTerm)

local hotkeyShortcuts = {
  ['a'] = action.leftThird,
  ['z'] = action.rightThird,
  ['Right'] = action.rightHalfMove,
  ['Left'] = action.leftHalfMove,
  ['Up'] = action.topHalfMove,
  ['Down'] = action.bottomHalfMove,
  ['f'] = action.fullScreen
}

--
-- Set the default grid size and configuration.
--
hs.grid.GRIDWIDTH = 3
hs.grid.GRIDHEIGHT = 3
hs.grid.MARGINX = 0
hs.grid.MARGINY = 0

----------------------------------------------------------------------------------------------------
-- Hotkey Bindings
----------------------------------------------------------------------------------------------------
local mash_modifiers = utils.mods.CASC
local splitModifiers = mash_modifiers;
local app_modifiers = utils.mods.cAsC
local modalModifiers = mash_modifiers;

for hk, funName in pairs(hotkeyShortcuts) do
  hs.hotkey.bind(mash_modifiers, hk, funName);
end

local appShortcuts = {
    ['d'] = 'Dash',
    ['t'] = 'iTerm',
    ['c'] = 'Google Chrome',
    ['s'] = 'Safari',
    ['e'] = 'Sublime Text',
    ['w'] = 'Textwell'
}

for shortcut, appName in pairs(appShortcuts) do
    hs.hotkey.bind(modalModifiers, shortcut, function() hs.application.launchOrFocus(appName) end)
end

hs.pathwatcher.new(hs.configdir, function(files) hs.reload() end):start()
hs.alert("Hammerspoon loaded", 1)
