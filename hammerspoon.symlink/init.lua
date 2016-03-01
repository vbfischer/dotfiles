local action = require('action')
local monitors = require 'monitors'

hs.window.animationDuration = 0     -- Disable window animations (janky for iTerm)

local hotkeyShortcuts = {
  ['a'] = action.leftThird,
  ['z'] = action.rightThird,
  ['Right'] = action.rightHalfMove,
  ['Left'] = action.leftHalfMove,
  ['Up'] = action.topHalfMove,
  ['Down'] = action.bottomHalfMove,
  ['f'] = action.fullScreen,
  [']'] = action.topRightMove,
  ['['] = action.topLeftMove,
  ['\''] = action.bottomRightMove,
  [';'] = action.bottomLeftMove,
  ['6'] = action.appsRunning,
  ['u'] = action.undoMove,
  ['n'] = action.moveScreenLeft
}

local urlActions = {
  ['leftthird'] = action.leftThird
}

--
-- Set the default grid size and configuration.
--
hs.grid.GRIDWIDTH = 4
hs.grid.GRIDHEIGHT = 4
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


for url, funName in pairs(urlActions) do
  hs.urlevent.bind(url, funName);
end

local appShortcuts = {
    ['d'] = 'Dash',
    ['t'] = 'iTerm2',
    ['c'] = 'Google Chrome',
    ['s'] = 'Safari',
    ['e'] = 'Atom',
    ['w'] = 'Textwell',
    ['i'] = 'IntelliJ IDEA-EAP'

}

for shortcut, appName in pairs(appShortcuts) do
    hs.hotkey.bind(modalModifiers, shortcut, function() hs.application.launchOrFocus(appName) end)
end

-- bind numbers to screens
for id, monitor in pairs(monitors.configured_monitors) do
  hs.hotkey.bind(mash_modifiers, "" .. id, function()
    action.moveToScreen(monitor)
  end)
end

hs.pathwatcher.new(hs.configdir, function(files) hs.reload() end):start()
hs.alert("Hammerspoon loaded", 1)
