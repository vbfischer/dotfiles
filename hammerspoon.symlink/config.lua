require 'action'
require 'profile'
local config = {}

local home = Profile.new('Home', {2077752445}, {
    ['Google Chrome'] = {Action.MoveToScreen.new(1)}
})

local work = Profile.new('Work', {69731202, 722483023, 722492052}, {
    ['Google Chrome'] = {Action.MoveToScreen.new(3), Action.MoveToUnit.new(0.0, 0.0, 1.0, 1.0)},
    ['Dash'] = {Action.MoveToScreen.new(3), Action.MoveToUnit.new(0.0, 0.0, 0.5, 1.0)},
    ['Safari'] = {Action.MoveToScreen.new(3), Action.MoveToUnit.new(0.0, 0.0, 1.0, 1.0)},
    ['iTerm'] = {Action.MoveToScreen.new(1), Action.MoveToUnit.new(0.5, 0.0, 0.5, 1.0)},
    ['Sublime Text'] = {Action.MoveToScreen.new(2), Action.MoveToUnit.new(0.0, 0.0, 1.0, 1.0)}
})

config.profiles = {
    home, work
}

Profile.checkKnownProfile()

return config