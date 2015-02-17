Profile = {}
Profile.__index = Profile

local profiles = {}

function Profile.new(title, screens, config)
    local m = setmetatable({}, Profile)
    m.title = title
    m.config = config
    m.screens = screens
    table.insert(profiles, m)
    return m
end

function Profile:_actionsFor(appName)
  local actions = self.config[appName]
  if actions then return actions else return self.config["_"] end
end

function Profile:activateFor(app)
  local actions = self:_actionsFor(app:title())
  if actions then
    for _, action in pairs(actions) do
      for _, win in pairs(app:allWindows()) do action:perform(win) end
  end
end
end

function Profile:isActive()
    for _, screen in pairs(hs.screen.allScreens()) do
        if hs.fnutils.contains(self.screens, screen:id()) then return true end
    end

    return false
end

function Profile:activate()
  hs.alert("Arranging " .. self.title, 1)
  for _, app in pairs(hs.application.runningApplications()) do self:activateFor(app) end
end

----------------------------------------------------------------------------------------------------

function Profile.activeProfile()
    for _, profile in pairs(profiles) do
        for _, profile in pairs(profiles) do
            if profile:isActive() then return profile end
        end

        return nil
    end
end

function Profile.checkKnownProfile()
    local activeProfile = Profile.activeProfile()
    if activeProfile == nil then
        hs.alert("unknown profile, see console for screen information", 3)
        for _, screen in pairs(hs.screen.allScreens()) do print("unknown screen: " .. screen:id()) end
    else
        hs.alert('Loaded profile: ' .. activeProfile.title)
    end
end

function Profile.activateActiveProfile()
  local profile = Profile.activeProfile()
  if profile then profile:activate() end
end

----------------------------------------------------------------------------------------------------

return Profile