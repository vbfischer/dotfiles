(function() {
  var $, $$$, ResultView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, $$$ = _ref.$$$, View = _ref.View;

  module.exports = ResultView = (function(_super) {
    __extends(ResultView, _super);

    function ResultView() {
      this.resizeView = __bind(this.resizeView, this);
      return ResultView.__super__.constructor.apply(this, arguments);
    }

    ResultView.content = function() {
      return this.div({
        "class": 'coffee-lint'
      }, (function(_this) {
        return function() {
          _this.div({
            outlet: 'resizeHandle',
            "class": 'resize-handle'
          });
          return _this.div({
            "class": "panel"
          }, function() {
            _this.div({
              "class": "panel-heading"
            }, function() {
              _this.div({
                "class": 'pull-right'
              }, function() {
                return _this.span({
                  outlet: 'closeButton',
                  "class": 'close-icon'
                });
              });
              return _this.span('Coffee Lint');
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              _this.ul({
                outlet: 'noProblemsMessage',
                "class": 'background-message'
              }, function() {
                return _this.li('No Problems ;)');
              });
              return _this.ul({
                outlet: 'errorList',
                "class": 'list-group'
              });
            });
          });
        };
      })(this));
    };

    ResultView.prototype.initialize = function(state) {
      this.height(state != null ? state.height : void 0);
      this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      return this.resizeHandle.on('mousedown', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
    };

    ResultView.prototype.serialize = function() {
      return {
        height: this.height()
      };
    };

    ResultView.prototype.resizeStarted = function(_arg) {
      var pageY;
      pageY = _arg.pageY;
      this.resizeData = {
        pageY: pageY,
        height: this.height()
      };
      $(document.body).on('mousemove', this.resizeView);
      return $(document.body).on('mouseup', this.resizeStopped);
    };

    ResultView.prototype.resizeStopped = function() {
      $(document.body).off('mousemove', this.resizeView);
      return $(document.body).off('mouseup', this.resizeStopped);
    };

    ResultView.prototype.resizeView = function(_arg) {
      var pageY;
      pageY = _arg.pageY;
      return this.height(this.resizeData.height + this.resizeData.pageY - pageY);
    };

    ResultView.prototype.render = function(errors, editorView) {
      var error, _i, _len;
      if (errors == null) {
        errors = [];
      }
      if (errors.length > 0) {
        this.noProblemsMessage.hide();
      } else {
        this.noProblemsMessage.show();
      }
      this.errorList.empty();
      for (_i = 0, _len = errors.length; _i < _len; _i++) {
        error = errors[_i];
        this.errorList.append($$$(function() {
          return this.li({
            "class": "list-item lint-" + error.level,
            l: error.lineNumber
          }, (function(_this) {
            return function() {
              var icon;
              icon = error.level === 'error' ? 'alert' : 'info';
              _this.span({
                "class": "icon icon-" + icon
              });
              return _this.span({
                "class": 'text-smaller'
              }, "Line: " + error.lineNumber + " - " + error.message);
            };
          })(this));
        }));
      }
      return this.on('click', '.list-item', function() {
        var row;
        row = $(this).attr('l');
        return editorView != null ? editorView.editor.setCursorBufferPosition([row - 1, 0]) : void 0;
      });
    };

    return ResultView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxTQUFBLENBQUQsRUFBSSxXQUFBLEdBQUosRUFBUyxZQUFBLElBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixpQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLFlBQXdCLE9BQUEsRUFBTyxlQUEvQjtXQUFMLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxZQUFQO2VBQUwsRUFBMEIsU0FBQSxHQUFBO3VCQUN4QixLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsa0JBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxrQkFBdUIsT0FBQSxFQUFPLFlBQTlCO2lCQUFOLEVBRHdCO2NBQUEsQ0FBMUIsQ0FBQSxDQUFBO3FCQUVBLEtBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixFQUgyQjtZ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
//# sourceURL=/Users/bryce/.homesick/repos/bzdots/home/.atom/packages/coffee-lint/lib/result-view.coffee