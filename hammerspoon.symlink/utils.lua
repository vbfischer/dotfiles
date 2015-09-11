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



----------------------------------------------------------------------------------------------------

return utils
