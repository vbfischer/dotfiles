  tell application id "com.evernote.Evernote"
        set _sel to selection
        if _sel is {} then error "Please select a note."

        repeat with i from 1 to the count of _sel
          set _title to title of item i of _sel

          return _title
        end repeat
  end tell
