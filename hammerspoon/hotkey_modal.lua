HotkeyModal = {}

function HotkeyModal.new(title, modifiers, key)
  local m = hs.hotkey.modal.new(modifiers, key)

  function m:entered() hs.alert.show('Entered ' .. title) end
  function m:exited() hs.alert.show('Exited ' .. title) end

  return m
end

----------------------------------------------------------------------------------------------------

return HotkeyModal
