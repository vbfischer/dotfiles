-- inspired by https://github.com/tstirrat/hammerspoon-config
local fnutils = require 'hs.fnutils'
local screen = require 'hs.screen'
local inspect = require 'hs.inspect'

local dimensions__proto = {}
local dimensions__mt = { __index = dimensions__proto }

local function get_screen_dimensions(screen)
  local dim = screen:frame()
  local frame = screen:fullFrame()

  local dimensions = {
    w = dim.w,
    h = dim.h,
    x = dim.x,
    y = dim.y,
    f = {
      w = frame.w,
      h = frame.h,
      x = frame.x,
      y = frame.y
    }
  }

  setmetatable(dimensions, dimensions__mt)

  return dimensions
end

local function autodiscover_monitors()
  local screens = screen.allScreens()

  local primary_screen = fnutils.find(screens, function(screen)
    local dim = screen:fullFrame()
    return dim.x == 0 and dim.y == 0
  end)

  local psFrame = primary_screen:fullFrame()

  table.sort(screens, function(a, b)
    if a:fullFrame().x == b:fullFrame().x then
      return a:fullFrame().y < b:fullFrame().y
    end

    return a:fullFrame().x < b:fullFrame().x
  end)

  return screens
end

local monitors = {
  configured_monitors = autodiscover_monitors()
}

return monitors
