local function round(num) return math.floor(num + 0.5) end

Grid = {}
Grid.__index = Grid

function Grid.new(width, height)
  local m = setmetatable({}, Grid)
  m.width = width or 6
  m.height = height or 6
  return m
end

function Grid:_get(win)
  local winFrame = win:frame()
  local screenFrame = win:screen():frame()
  local ratioWidth = screenFrame.w / self.width
  local ratioHeight = screenFrame.h / self.height
  return {
    x = round((winFrame.x - screenFrame.x) / ratioWidth),
    y = round((winFrame.y - screenFrame.y) / ratioHeight),
    w = math.max(1, round(winFrame.w / ratioWidth)),
    h = math.max(1, round(winFrame.h / ratioHeight)),
  }
end

function Grid:_set(win, grid)
  local screenFrame = win:screen():frame()
  local ratioWidth = screenFrame.w / self.width
  local ratioHeight = screenFrame.h / self.height
  local newFrame = {
    x = (grid.x * ratioWidth) + screenFrame.x,
    y = (grid.y * ratioHeight) + screenFrame.y,
    w = grid.w * ratioWidth,
    h = grid.h * ratioHeight,
  }
  win:setFrame(newFrame)
  win:ensureIsInScreenBounds()
end

function Grid:_adjustWindow(win, fn)
  local win = win or hs.window.focusedWindow()
  local grid = self:_get(win)
  for k, v in pairs(fn(grid)) do grid[k] = v end
  self:_set(win, grid)
end

function Grid:snap(win)
  local win = win or hs.window.focusedWindow()
  if win:isStandard() then self:_set(win, self:_get(win), win:screen()) end
end

function Grid:snapAll()
  for _, win in pairs(hs.window.visibleWindows()) do self:snap(win) end
end

function Grid:resizeWider(win)
  self:_adjustWindow(win, function(g) return {w = math.min(g.w + 1.0, self.width - g.x)} end)
end

function Grid:resizeThinner(win)
  self:_adjustWindow(win, function(g) return {w = math.max(g.w - 1.0, 1.0)} end)
end

function Grid:resizeShorter(win)
  self:_adjustWindow(win, function(g) return {y = g.y, h = math.max(g.h - 1.0, 1.0)} end)
end

function Grid:resizeTaller(win)
  self:_adjustWindow(win, function(g) return {y = g.y, h = math.min(g.h + 1.0, self.height - g.y)} end)
end

function Grid:moveUp(win)
  self:_adjustWindow(win, function(g) return {y = math.max(0.0, g.y - 1.0)} end)
end

function Grid:moveDown(win)
  self:_adjustWindow(win, function(g) return {y = math.min(self.height - g.h, g.y + 1.0)} end)
end

function Grid:moveLeft(win)
  self:_adjustWindow(win, function(g) return {x = math.max(0.0, g.x - 1.0)} end)
end

function Grid:moveRight(win)
  self:_adjustWindow(win, function(g) return {x = math.min(self.width - g.w, g.x + 1.0)} end)
end

function Grid:positionTopLeft(win)
  self:_adjustWindow(win, function(g) return {x = 0.0, y = 0.0} end)
end

function Grid:positionBottomLeft(win)
  self:_adjustWindow(win, function(g) return {x = 0.0, y = self.height - g.h} end)
end

function Grid:positionTopRight(win)
  self:_adjustWindow(win, function(g) return {x = self.width - g.w, y = 0.0} end)
end

function Grid:positionBottomRight(win)
  self:_adjustWindow(win, function(g) return {x = self.width - g.w, y = self.height - g.h} end)
end

----------------------------------------------------------------------------------------------------

return Grid