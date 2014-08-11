{View} = require 'atom'

module.exports =
class BackbonejsSnippetsView extends View
  @content: ->
    @div class: 'backbonejs-snippets overlay from-top', =>
      @div "The BackbonejsSnippets package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "backbonejs-snippets:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "BackbonejsSnippetsView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
