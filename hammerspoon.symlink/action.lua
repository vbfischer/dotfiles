local action = {}
local utils = require 'utils'
--
-- Global Variables
--
--		saved.win 		The window last moved.
--		saved.winframe The frame for the window before moving.
--
saved = {}
saved.win = {}
saved.winframe = {}

--
-- Function:		returnLast
--
-- Description:	Will return the last window moved to it's
--						original position.
--
function returnLast()
	if(saved.win ~= {}) then
		saved.win:setFrame(saved.winframe)
	end
end

function action.leftThird()
  saved.win = hs.window.frontmostWindow()
  saved.winframe = saved.win:frame()

  hs.grid.set(saved.win, {x = 0, y = 0, w = 1, h = 3}, hs.screen.mainScreen())
end

function action.rightThird()
  saved.win = hs.window.focusedWindow()
  saved.winframe = saved.win:frame()
  hs.grid.set(hs.window.focusedWindow(), {x = 1, y = 0, w = 2, h = 3}, hs.screen.mainScreen())
end

function action.undoMove()
		saved.win:setFrame(saved.winframe)
end

function action.moveToScreen(screen)
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()

	saved.win:moveToScreen(screen)
end


function action.moveScreenLeft()
	saved.win = hs.window.focusedWindow()
  saved.winframe = saved.win:frame()
	local screen = saved.win:screen()

	-- saved.win.moveToScreen(saved.win.screen:next())
	saved.win:moveToScreen(screen:next())
end

--
-- Function:         cafftoggle
--
-- Description:      Toggle system caffeinate. If the
--                              AppBar workflow for Alfred is
-- 			  installed, then it will change the
--                             indicator to black for caff off,
--                             and red if caff is on.
--
function action.cafftoggle ()
	hs.caffeinate.toggle("system")
	if hs.caffeinate.get("system") then
		hs.caffeinate.set("displayIdle", true, true)
		hs.caffeinate.set("systemIdle", true, true)
		hs.alert.show("Caff is enabled!", 3)
		hs.applescript.applescript("tell application \"Alfred 2\" to run trigger \"SetGraphic\" in workflow \"com.customct.AnyBar\" with argument \"sleep_red|9595\" ")
	else
		hs.caffeinate.set("displayIdle", false, true)
		hs.caffeinate.set("systemIdle", false, true)
		hs.alert.show("Caff is disabled!", 3)
		hs.applescript.applescript("tell application \"Alfred 2\" to run trigger \"SetGraphic\" in workflow \"com.customct.AnyBar\" with argument \"sleep_black|9595\" ")
	end
end

--
-- Function:		setgrid
--
-- Description:	This function sets the current window to
--						the specified grid location.
--
function setgrid( sx, sy, sw, sh)
   saved.win = hs.window.focusedWindow()
   saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), {x = sx, y = sy, w = sw, h = sh}, hs.screen.mainScreen())
end


--
-- Function:		leftHalfMove
--
-- Description:	This function moves the current window
-- 					to the left half of the screen.
--
function action.leftHalfMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=0, y=0, w=2, h=4}, hs.screen.mainScreen())
end

function action.topRightMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=2, y=0, w=2, h=2}, hs.screen.mainScreen())
end

function action.topLeftMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=0, y=0, w=2, h=2}, hs.screen.mainScreen())
end

function action.bottomRightMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=2, y=2, w=2, h=2}, hs.screen.mainScreen())
end

function action.bottomLeftMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=0, y=2, w=2, h=2}, hs.screen.mainScreen())
end


--
-- Function:		rightHalfMove
--
-- Description:	This function moves the current window
-- 					to the right half of the screen.
--
function action.rightHalfMove()
	saved.win = hs.window.focusedWindow()
	-- saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=2, y=0, w=2, h=4}, hs.screen.mainScreen())
end

--
-- Function:		topHalfMove
--
-- Description:	This function moves the current window
-- 			to the top half of the screen.
--
function action.topHalfMove()
   saved.win = hs.window.focusedWindow()
   saved.winframe = saved.win:frame()
	 hs.grid.set(hs.window.focusedWindow(), { x=0, y=0, w=4, h=2}, hs.screen.mainScreen())
end

--
-- Function:		bottomHalfMove
--
-- Description:	This function moves the current window
-- 			to the bottom half of the screen.
--
function action.bottomHalfMove()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.grid.set(hs.window.focusedWindow(), { x=0, y=2, w=4, h=2}, hs.screen.mainScreen())
end

--
-- Function:	fullScreen
--
-- Description:	This function moves the current window
-- 			to cover the full screen.
--
function action.fullScreen()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.window.focusedWindow():maximize()
end

--
-- Function:	minimize
--
-- Description:	This function moves the current window
-- 			to be minimized.
--
function action.minimize()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.window.focusedWindow():minimize()
end

--
-- Function:        appsRunning
--
-- Description:     This function lists all applications running.
--
function action.appsRunning( )
	apps = hs.application.runningApplications()
	for index, app in pairs( apps ) do
		if app:kind() == 1 then
			print( app:title() )
		end
	end
end

--
-- Function:	focus
--
-- Description:	This function will unminimize the given app.
--
function action.focus( app )
	hs.appfinder.appFromName( app ):activate()
end

--
-- Function:	kill
--
-- Description:	This function will kill the given app.
--
function action.kill( app )
	hs.appfinder.appFromName( app ):kill()
end


--
-- Function:	hide
--
-- Description:	This function will hide the given app.
--
function action.hide( app )
	hs.appfinder.appFromName( app ):hide()
end

--
-- Function:	unhide
--
-- Description:	This function will unhide the given app.
--
function action.unhide( app )
	app = hs.appfinder.appFromName( app )
	app:unhide()
	app:activate()
end

--
-- Function:	zoom
--
-- Description:	This function moves the current window
-- 			to cover the full screen.
--
function zoom()
	saved.win = hs.window.focusedWindow()
	saved.winframe = saved.win:frame()
	hs.window.focusedWindow():toggleFullScreen()
end

return action
