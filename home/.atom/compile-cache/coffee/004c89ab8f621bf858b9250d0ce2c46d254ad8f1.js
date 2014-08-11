(function() {
  var $$, GotoView, SelectListView, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs');

  _ref = require('atom'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  utils = require('./symbol-utils');

  module.exports = GotoView = (function(_super) {
    __extends(GotoView, _super);

    function GotoView() {
      return GotoView.__super__.constructor.apply(this, arguments);
    }

    GotoView.prototype.initialize = function() {
      GotoView.__super__.initialize.apply(this, arguments);
      this.addClass('goto-view overlay from-top');
      this.currentView = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.destroy = function() {
      this.cancel();
      return this.detach();
    };

    GotoView.prototype.cancel = function() {
      GotoView.__super__.cancel.apply(this, arguments);
      this.restoreCancelPosition();
      this.currentView = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.attach = function() {
      this.storeFocusedElement();
      atom.workspaceView.appendToTop(this);
      return this.focusFilterEditor();
    };

    GotoView.prototype.populate = function(symbols, view) {
      this.rememberCancelPosition(view);
      this.setItems(symbols);
      return this.attach();
    };

    GotoView.prototype.rememberCancelPosition = function(view) {
      if (!view || !atom.config.get('goto.autoScroll')) {
        return;
      }
      this.currentView = view;
      return this.cancelPosition = {
        top: view.scrollTop(),
        selections: view.getEditor().getSelectedBufferRanges()
      };
    };

    GotoView.prototype.restoreCancelPosition = function() {
      if (this.currentView && this.cancelPosition) {
        this.currentView.getEditor().setSelectedBufferRanges(this.cancelPosition.selections);
        return this.currentView.scrollTop(this.cancelPosition.top);
      }
    };

    GotoView.prototype.forgetCancelPosition = function() {
      this.currentView = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.getFilterKey = function() {
      return 'name';
    };

    GotoView.prototype.scrollToItemView = function(view) {
      var symbol;
      GotoView.__super__.scrollToItemView.apply(this, arguments);
      symbol = this.getSelectedItem();
      return this.onItemSelected(view, symbol);
    };

    GotoView.prototype.onItemSelected = function(view, symbol) {
      var editor;
      if (this.currentView) {
        editor = this.currentView.getEditor();
        this.currentView.scrollToBufferPosition(symbol.position, {
          center: true
        });
        editor.setCursorBufferPosition(symbol.position);
        return editor.moveCursorToFirstCharacterOfLine();
      }
    };

    GotoView.prototype.viewForItem = function(symbol) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var dir, text;
            _this.div(symbol.name, {
              "class": 'primary-line'
            });
            dir = path.basename(symbol.path);
            text = "" + dir + " " + (symbol.position.row + 1);
            return _this.div(text, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    GotoView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No symbols found';
      } else {
        return GotoView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GotoView.prototype.confirmed = function(symbol) {
      this.forgetCancelPosition();
      if (!fs.existsSync(atom.project.resolve(symbol.path))) {
        this.setError('Selected file does not exist');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else {
        this.cancel();
        return utils.gotoSymbol(symbol);
      }
    };

    return GotoView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLG1EQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxNQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FGTCxDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLDRCQUFWLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUhmLENBQUE7YUFPQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQVJSO0lBQUEsQ0FBWixDQUFBOztBQUFBLHVCQWVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZPO0lBQUEsQ0FmVCxDQUFBOztBQUFBLHVCQW1CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxzQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FBQTthQUdBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBSlo7SUFB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
//# sourceURL=/Users/bryce/.homesick/repos/bzdots/home/.atom/packages/goto/lib/goto-view.coffee