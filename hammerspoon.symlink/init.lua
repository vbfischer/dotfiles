require 'hotkey_modal'
require 'action'
require 'utils'
hs.window.animationDuration = 0     -- Disable window animations (janky for iTerm)

function screensChangedCallback()
    print("screens changed")
end

----------------------------------------------------------------------------------------------------
-- Layouts
----------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------
-- Hotkey Bindings
----------------------------------------------------------------------------------------------------
local mash_modifiers = utils.mods.CASC
local splitModifiers = mash_modifiers;
local app_modifiers = utils.mods.cAsC
local modalModifiers = mash_modifiers;

hs.hotkey.bind(mash_modifiers, '=', function() hs.pasteboard.setContents(hs.window.focusedWindow():id()) end)

hs.hotkey.bind(splitModifiers, 'UP', function() Action.Maximize.new():perform() end)
hs.hotkey.bind(splitModifiers, 'DOWN', function() Action.MoveToNextScreen.new():perform() end)
hs.hotkey.bind(splitModifiers, 'LEFT', function() Action.MoveToUnit.new(0.0, 0.0, 0.5, 1.0):perform() end)
hs.hotkey.bind(splitModifiers, 'RIGHT', function() Action.MoveToUnit.new(0.5, 0.0, 0.5, 1.0):perform() end)
hs.hotkey.bind(splitModifiers, 'H', function() hs.hints.windowHints() end)


local position = HotkeyModal.new('Position', mash_modifiers, '1')
position:bind({}, 'UP', function() hs.grid.pushWindowUp() end)
position:bind({}, 'DOWN', function() hs.grid.pushWindowDown() end)
position:bind({}, 'LEFT', function() hs.grid.pushWindowLeft() end)
position:bind({}, 'RIGHT', function() hs.grid.pushWindowRight() end)
position:bind({}, 'RETURN', function() position:exit() end)

local resize = HotkeyModal.new('Resize', mash_modifiers, '2')
resize:bind({}, 'UP', function() hs.grid:resizeWindowShorter() end)
resize:bind({}, 'DOWN', function() hs.grid:resizeWindowTaller() end)
resize:bind({}, 'LEFT', function() hs.grid:resizeWindowThinner() end)
resize:bind({}, 'RIGHT', function() hs.grid:resizeWindowWider() end)
resize:bind({}, 'RETURN', function() resize:exit() end)

local move = HotkeyModal.new('Move', mash_modifiers, '3')
move:bind({}, 'UP', function() hs.grid:pushWindowUp() end)
move:bind({}, 'DOWN', function() hs.grid:pushWindowDown() end)
move:bind({}, 'LEFT', function() hs.grid:pushWindowLeft() end)
move:bind({}, 'RIGHT', function() hs.grid:pushWindowRight() end)
move:bind({}, 'RETURN', function() move:exit() end)

local appShortcuts = {
    ['d'] = 'Dash',
    ['t'] = 'iTerm',
    ['c'] = 'Google Chrome',
    ['s'] = 'Safari',
    ['e'] = 'Sublime Text'
}

for shortcut, appName in pairs(appShortcuts) do
    hs.hotkey.bind(modalModifiers, shortcut, function() hs.application.launchOrFocus(appName) end)
end

local appWatcher = hs.screen.watcher.new(screensChangedCallback)


hs.pathwatcher.new(hs.configdir, function(files) hs.reload() end):start()
hs.alert("Hammerspoon loaded", 1)
