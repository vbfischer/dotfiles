(function() {
  var GotoView, SymbolIndex;

  SymbolIndex = require('./symbol-index');

  GotoView = require('./goto-view');

  module.exports = {
    configDefaults: {
      logToConsole: false,
      moreIgnoredNames: '',
      autoScroll: true
    },
    index: null,
    gotoView: null,
    activate: function(state) {
      this.index = new SymbolIndex(state != null ? state.entries : void 0);
      this.gotoView = new GotoView();
      atom.workspaceView.command("goto:project-symbol", (function(_this) {
        return function() {
          return _this.gotoProjectSymbol();
        };
      })(this));
      atom.workspaceView.command("goto:file-symbol", (function(_this) {
        return function() {
          return _this.gotoFileSymbol();
        };
      })(this));
      atom.workspaceView.command("goto:declaration", (function(_this) {
        return function() {
          return _this.gotoDeclaration();
        };
      })(this));
      atom.workspaceView.command("goto:rebuild-index", (function(_this) {
        return function() {
          return _this.index.rebuild();
        };
      })(this));
      return atom.workspaceView.command("goto:invalidate-index", (function(_this) {
        return function() {
          return _this.index.invalidate();
        };
      })(this));
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.index) != null) {
        _ref.destroy();
      }
      this.index = null;
      if ((_ref1 = this.gotoView) != null) {
        _ref1.destroy();
      }
      return this.gotoView = null;
    },
    serialize: function() {
      return {
        'entries': this.index.entries
      };
    },
    gotoDeclaration: function() {
      var symbols;
      symbols = this.index.gotoDeclaration();
      if (symbols) {
        return this.gotoView.populate(symbols);
      }
    },
    gotoProjectSymbol: function() {
      var symbols;
      symbols = this.index.getAllSymbols();
      return this.gotoView.populate(symbols);
    },
    gotoFileSymbol: function() {
      var e, filePath, symbols, v;
      v = atom.workspaceView.getActiveView();
      e = v != null ? v.getEditor() : void 0;
      filePath = e != null ? e.getPath() : void 0;
      if (filePath) {
        symbols = this.index.getEditorSymbols(e);
        return this.gotoView.populate(symbols, v);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsS0FBZDtBQUFBLE1BQ0EsZ0JBQUEsRUFBa0IsRUFEbEI7QUFBQSxNQUVBLFVBQUEsRUFBWSxJQUZaO0tBREY7QUFBQSxJQUtBLEtBQUEsRUFBTyxJQUxQO0FBQUEsSUFNQSxRQUFBLEVBQVUsSUFOVjtBQUFBLElBUUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsV0FBQSxpQkFBWSxLQUFLLENBQUUsZ0JBQW5CLENBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxRQUFBLENBQUEsQ0FEaEIsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixxQkFBM0IsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGtCQUEzQixFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFB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
//# sourceURL=/Users/bryce/.homesick/repos/bzdots/home/.atom/packages/goto/lib/index.coffee