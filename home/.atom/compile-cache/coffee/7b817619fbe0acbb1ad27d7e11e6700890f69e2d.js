(function() {
  var $, $$, EditorView, FancyNewFileView, View, fs, mkdirp, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, EditorView = _ref.EditorView;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  module.exports = FancyNewFileView = (function(_super) {
    __extends(FancyNewFileView, _super);

    function FancyNewFileView() {
      return FancyNewFileView.__super__.constructor.apply(this, arguments);
    }

    FancyNewFileView.prototype.fancyNewFileView = null;

    FancyNewFileView.configDefaults = {
      suggestCurrentFilePath: false,
      showFilesInAutoComplete: false,
      caseSensitiveAutoCompletion: false
    };

    FancyNewFileView.activate = function(state) {
      return this.fancyNewFileView = new FancyNewFileView(state.fancyNewFileViewState);
    };

    FancyNewFileView.deactivate = function() {
      return this.fancyNewFileView.detach();
    };

    FancyNewFileView.content = function(params) {
      return this.div({
        "class": 'fancy-new-file overlay from-top'
      }, (function(_this) {
        return function() {
          _this.p({
            outlet: 'message',
            "class": 'icon icon-file-add'
          }, "Enter the path for the new file/directory. Directories end with a '" + path.sep + "'.");
          _this.subview('miniEditor', new EditorView({
            mini: true
          }));
          return _this.ul({
            "class": 'list-group',
            outlet: 'directoryList'
          });
        };
      })(this));
    };

    FancyNewFileView.detaching = false;

    FancyNewFileView.prototype.initialize = function(serializeState) {
      var consumeKeypress;
      atom.workspaceView.command("fancy-new-file:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      this.miniEditor.setPlaceholderText(path.join('path', 'to', 'file.txt'));
      this.on('core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      this.on('core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      this.miniEditor.hiddenInput.on('focusout', (function(_this) {
        return function() {
          if (!_this.detaching) {
            return _this.detach();
          }
        };
      })(this));
      consumeKeypress = (function(_this) {
        return function(ev) {
          ev.preventDefault();
          return ev.stopPropagation();
        };
      })(this);
      this.miniEditor.getEditor().getBuffer().on('changed', (function(_this) {
        return function(ev) {
          return _this.update();
        };
      })(this));
      this.miniEditor.on('keydown', (function(_this) {
        return function(ev) {
          if (ev.keyCode === 9) {
            return consumeKeypress(ev);
          }
        };
      })(this));
      return this.miniEditor.on('keyup', (function(_this) {
        return function(ev) {
          if (ev.keyCode === 9) {
            consumeKeypress(ev);
            return _this.autocomplete(_this.miniEditor.getEditor().getText());
          }
        };
      })(this));
    };

    FancyNewFileView.prototype.referenceDir = function() {
      var homeDir;
      homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      return atom.project.getPath() || homeDir;
    };

    FancyNewFileView.prototype.inputPath = function() {
      var input;
      input = this.miniEditor.getEditor().getText();
      return path.join(this.referenceDir(), input.substr(0, input.lastIndexOf(path.sep)));
    };

    FancyNewFileView.prototype.getFileList = function(callback) {
      var input;
      input = this.miniEditor.getEditor().getText();
      return fs.stat(this.inputPath(), (function(_this) {
        return function(err, stat) {
          if ((err != null ? err.code : void 0) === 'ENOENT') {
            return [];
          }
          return fs.readdir(_this.inputPath(), function(err, files) {
            var dirList, fileList;
            fileList = [];
            dirList = [];
            files.forEach(function(filename) {
              var caseSensitive, fragment, isDir, matches;
              fragment = input.substr(input.lastIndexOf(path.sep) + 1, input.length);
              caseSensitive = atom.config.get('fancy-new-file.caseSensitiveAutoCompletion');
              if (!caseSensitive) {
                fragment = fragment.toLowerCase();
              }
              matches = caseSensitive && filename.indexOf(fragment) === 0 || !caseSensitive && filename.toLowerCase().indexOf(fragment) === 0;
              if (matches) {
                isDir = fs.statSync(path.join(_this.inputPath(), filename)).isDirectory();
                return (isDir ? dirList : fileList).push({
                  name: filename,
                  isDir: isDir
                });
              }
            });
            if (atom.config.get('fancy-new-file.showFilesInAutoComplete')) {
              return callback.apply(_this, [dirList.concat(fileList)]);
            } else {
              return callback.apply(_this, [dirList]);
            }
          });
        };
      })(this));
    };

    FancyNewFileView.prototype.autocomplete = function(str) {
      return this.getFileList(function(files) {
        var newPath, relativePath, suffix;
        if ((files != null ? files.length : void 0) === 1) {
          newPath = path.join(this.inputPath(), files[0].name);
          suffix = files[0].isDir ? '/' : '';
          relativePath = atom.project.relativize(newPath) + suffix;
          return this.miniEditor.getEditor().setText(relativePath);
        } else {
          return atom.beep();
        }
      });
    };

    FancyNewFileView.prototype.update = function() {
      this.getFileList(function(files) {
        return this.renderAutocompleteList(files);
      });
      if (/\/$/.test(this.miniEditor.getEditor().getText())) {
        return this.setMessage('file-directory-create');
      } else {
        return this.setMessage('file-add');
      }
    };

    FancyNewFileView.prototype.setMessage = function(icon, str) {
      this.message.removeClass('icon' + ' icon-file-add' + ' icon-file-directory-create' + ' icon-alert');
      if (icon != null) {
        this.message.addClass('icon icon-' + icon);
      }
      return this.message.text(str || "Enter the path for the new file/directory. Directories end with a '" + path.sep + "'.");
    };

    FancyNewFileView.prototype.renderAutocompleteList = function(files) {
      this.directoryList.empty();
      return files != null ? files.forEach((function(_this) {
        return function(file) {
          var icon;
          icon = file.isDir ? 'icon-file-directory' : 'icon-file-text';
          return _this.directoryList.append($$(function() {
            return this.li({
              "class": 'list-item'
            }, (function(_this) {
              return function() {
                return _this.span({
                  "class": "icon " + icon
                }, file.name);
              };
            })(this));
          }));
        };
      })(this)) : void 0;
    };

    FancyNewFileView.prototype.confirm = function() {
      var error, pathToCreate, relativePath;
      relativePath = this.miniEditor.getEditor().getText();
      pathToCreate = path.join(this.referenceDir(), relativePath);
      try {
        if (/\/$/.test(relativePath)) {
          mkdirp(pathToCreate);
        } else {
          atom.open({
            pathsToOpen: [pathToCreate]
          });
        }
      } catch (_error) {
        error = _error;
        this.setMessage('alert', error.message);
      }
      return this.detach();
    };

    FancyNewFileView.prototype.detach = function() {
      var miniEditorFocused;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      this.miniEditor.getEditor().setText('');
      this.setMessage();
      this.directoryList.empty();
      miniEditorFocused = this.miniEditor.isFocused;
      FancyNewFileView.__super__.detach.apply(this, arguments);
      if (miniEditorFocused) {
        this.restoreFocus();
      }
      return this.detaching = false;
    };

    FancyNewFileView.prototype.attach = function() {
      this.suggestPath();
      this.previouslyFocusedElement = $(':focus');
      atom.workspaceView.append(this);
      this.miniEditor.focus();
      return this.getFileList(function(files) {
        return this.renderAutocompleteList(files);
      });
    };

    FancyNewFileView.prototype.suggestPath = function() {
      var activeDir, activePath, suggestedPath, _ref1;
      if (atom.config.get('fancy-new-file.suggestCurrentFilePath')) {
        activePath = (_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.getPath() : void 0;
        if (activePath) {
          activeDir = path.dirname(activePath) + '/';
          suggestedPath = path.relative(this.referenceDir(), activeDir);
          return this.miniEditor.getEditor().setText(suggestedPath + '/');
        }
      }
    };

    FancyNewFileView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    FancyNewFileView.prototype.restoreFocus = function() {
      var _ref1;
      if ((_ref1 = this.previouslyFocusedElement) != null ? _ref1.isOnDom() : void 0) {
        return this.previouslyFocusedElement.focus();
      } else {
        return atom.workspaceView.focus();
      }
    };

    return FancyNewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsTUFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixFQUFjLGtCQUFBLFVBQWQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsK0JBQUEsZ0JBQUEsR0FBa0IsSUFBbEIsQ0FBQTs7QUFBQSxJQUNBLGdCQUFDLENBQUEsY0FBRCxHQUNFO0FBQUEsTUFBQSxzQkFBQSxFQUF3QixLQUF4QjtBQUFBLE1BQ0EsdUJBQUEsRUFBeUIsS0FEekI7QUFBQSxNQUVBLDJCQUFBLEVBQTZCLEtBRjdCO0tBRkYsQ0FBQTs7QUFBQSxJQU1BLGdCQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsS0FBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLGdCQUFELEdBQXdCLElBQUEsZ0JBQUEsQ0FBaUIsS0FBSyxDQUFDLHFCQUF2QixFQURmO0lBQUEsQ0FOWCxDQUFBOztBQUFBLElBU0EsZ0JBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQSxHQUFBO2FBQ1gsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQWxCLENBQUEsRUFEVztJQUFBLENBVGIsQ0FBQTs7QUFBQSxJQVlBLGdCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztB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
//# sourceURL=/Users/bryce/.homesick/repos/bzdots/home/.atom/packages/fancy-new-file/lib/fancy-new-file-view.coffee