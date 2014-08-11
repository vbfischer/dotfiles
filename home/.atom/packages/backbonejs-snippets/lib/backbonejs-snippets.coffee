BackbonejsSnippetsView = require './backbonejs-snippets-view'

module.exports =
  backbonejsSnippetsView: null

  activate: (state) ->
    @backbonejsSnippetsView = new BackbonejsSnippetsView(state.backbonejsSnippetsViewState)

  deactivate: ->
    @backbonejsSnippetsView.destroy()

  serialize: ->
    backbonejsSnippetsViewState: @backbonejsSnippetsView.serialize()
