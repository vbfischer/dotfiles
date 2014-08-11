(function() {
  var ResultView, activate, coffeelinter, deactivate, fs, handleBufferEvents, lint, path, resultView, serialize, _;

  ResultView = require('./result-view');

  coffeelinter = require('./vendor/linter');

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  resultView = null;

  activate = function(state) {
    resultView = new ResultView(state);
    atom.workspaceView.command("coffee-lint:lint-current-file", function() {
      return lint();
    });
    atom.workspaceView.command("coffee-lint:toggle-results-panel", function() {
      if (!resultView) {
        return;
      }
      if (resultView.hasParent()) {
        return resultView.detach();
      } else {
        atom.workspaceView.prependToBottom(resultView);
        return lint();
      }
    });
    atom.workspaceView.on('pane-container:active-pane-item-changed', function() {
      if (resultView.hasParent()) {
        return lint();
      }
    });
    return atom.workspaceView.eachEditorView(function(editorView) {
      return handleBufferEvents(editorView);
    });
  };

  deactivate = function() {
    atom.workspaceView.off('core:cancel core:close');
    atom.workspaceView.off('pane-container:active-pane-item-changed');
    atom.workspaceView.command("coffee-lint:lint-current-file", function() {});
    atom.workspaceView.command("coffee-lint:toggle-results-panel", function() {});
    resultView.detach();
    return resultView = null;
  };

  serialize = function() {
    return resultView.serialize();
  };

  handleBufferEvents = function(editorView) {
    var buffer;
    buffer = editorView.editor.getBuffer();
    lint(editorView);
    buffer.on('saved', function(buffer) {
      var e, lintOnSave;
      lintOnSave = atom.config.get('coffee-lint.lintOnSave');
      if (buffer.previousModifiedStatus && lintOnSave) {
        try {
          return lint(editorView);
        } catch (_error) {
          e = _error;
          return console.log(e);
        }
      }
    });
    buffer.on('destroyed', function() {
      buffer.off('saved');
      return buffer.off('destroyed');
    });
    return editorView.editor.on('contents-modified', function() {
      var e;
      if (atom.config.get('coffee-lint.continuousLint')) {
        try {
          return lint(editorView);
        } catch (_error) {
          e = _error;
          return console.log(e);
        }
      }
    });
  };

  lint = function(editorView) {
    var config, configObject, e, editor, error, errors, gutter, isCoffeeFile, localFile, row, source, _i, _len;
    if (editorView == null) {
      editorView = atom.workspaceView.getActiveView();
    }
    if (editorView != null ? editorView.coffeeLintPending : void 0) {
      return;
    }
    editor = editorView.editor, gutter = editorView.gutter;
    if (!editor) {
      return;
    }
    isCoffeeFile = editor.getGrammar().scopeName === "source.coffee";
    if (!isCoffeeFile) {
      return resultView.render();
    }
    editorView.coffeeLintPending = true;
    gutter.removeClassFromAllLines('coffee-error');
    gutter.removeClassFromAllLines('coffee-warn');
    gutter.find('.line-number .icon-right').attr('title', '');
    source = editor.getText();
    try {
      localFile = path.join(atom.project.path, 'coffeelint.json');
      configObject = {};
      if (fs.existsSync(localFile)) {
        configObject = fs.readFileSync(localFile, 'UTF8');
        config = JSON.parse(configObject);
      }
    } catch (_error) {
      e = _error;
      console.log(e);
    }
    errors = coffeelinter.lint(source, config);
    errors = _.sortBy(errors, 'level');
    for (_i = 0, _len = errors.length; _i < _len; _i++) {
      error = errors[_i];
      row = gutter.find(gutter.getLineNumberElement(error.lineNumber - 1));
      row.find('.icon-right').attr('title', error.message);
      row.addClass("coffee-" + error.level);
    }
    resultView.render(errors, editorView);
    return editorView.coffeeLintPending = false;
  };

  module.exports = {
    configDefaults: {
      lintOnSave: true,
      continuousLint: true
    },
    activate: activate,
    deactivate: deactivate,
    serialize: serialize
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRHQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxJQU5iLENBQUE7O0FBQUEsRUFRQSxRQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxJQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsS0FBWCxDQUFqQixDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLCtCQUEzQixFQUE0RCxTQUFBLEdBQUE7YUFDMUQsSUFBQSxDQUFBLEVBRDBEO0lBQUEsQ0FBNUQsQ0FGQSxDQUFBO0FBQUEsSUFLQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGtDQUEzQixFQUErRCxTQUFBLEdBQUE7QUFDN0QsTUFBQSxJQUFBLENBQUEsVUFBQTtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFHLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBSDtlQUNFLFVBQVUsQ0FBQyxNQUFYLENBQUEsRUFERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBbkIsQ0FBbUMsVUFBbkMsQ0FBQSxDQUFBO2VBQ0EsSUFBQSxDQUFBLEVBSkY7T0FGNkQ7SUFBQSxDQUEvRCxDQUxBLENBQUE7QUFBQSxJQWFBLElBQUks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
//# sourceURL=/Users/bryce/.homesick/repos/bzdots/home/.atom/packages/coffee-lint/lib/main.coffee