utils = {}
utils.__index = utils

utils.mods = {
    casc = {                     }, casC = {                       "ctrl"},
    caSc = {              "shift"}, caSC = {              "shift", "ctrl"},
    cAsc = {       "alt"         }, cAsC = {       "alt",          "ctrl"},
    cASc = {       "alt", "shift"}, cASC = {       "alt", "shift", "ctrl"},
    Casc = {"cmd"                }, CasC = {"cmd",                 "ctrl"},
    CaSc = {"cmd",        "shift"}, CaSC = {"cmd",        "shift", "ctrl"},
    CAsc = {"cmd", "alt"         }, CAsC = {"cmd", "alt",          "ctrl"},
    CASc = {"cmd", "alt", "shift"}, CASC = {"cmd", "alt", "shift", "ctrl"},
}

function utils.pushToScreen(win, screen)
  local screen = screen or win:screen()
  if screen == win:screen() then return end

  local fullscreenChange = win:isFullScreen()
  if fullscreenChange then
    id = win:id()
    win:toggleFullScreen()
    os.execute('sleep 3')
    win = hs.window.windowForID(id)
    if not win then return end
  end

  win:moveToScreen(screen)

  if fullscreenChange then win:toggleFullScreen() end
end

----------------------------------------------------------------------------------------------------

return utils
