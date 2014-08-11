# Backbone.js Snippets

Speed up your javascript coding time with Backbone.js snippets. Use
the following to autocomplete Model, View, Collection and Router
method and function snippets.

* `bbm- + tab` - Backbone Model
* `bbc- + tab` - Backbone Collection
* `bbv- + tab` - Backbone Views
* `bbr- + tab` - Backbone Router

## Reference
 * [Backbone Docs](http://backbonejs.org)
 * [Backbone Repository](https://github.com/jashkenas/backbone)

## How To Install

```
apm install backbonejs-snippets
```

### Backbone
```
[ bb. ] Backbone.
[ .v ] Backbone.View.
[ .c ] Backbone.Collection.
[ .r ] Backbone.Router.
[ .m ] Backbone.Model.
```

### Models
```
[ bbm-extend ] Backbone.Model.extend({})
[ bbm_sync ] model.sync(method, model, [options])
[ bbm_fetch ] model.fetch([options])
[ bbm_save ] model.save([attributes], [options])
[ bbm_destroy ] model.destroy([options])
[ bbm_set ] model.set(attributes, [options])
[ bbm_get ] model.get(attribute)
[ bbm_escape ] model.escape(model)
[ bbm_has ] model.has(attribute)
[ bbm_unset ] model.unset(attributes, [options])
[ bbm_clear ] model.clear( [options] )
```

### Collections
```
[ bbc-extend ] Backbone.Collection.extend({})
[ bbc-models ] collection.models
[ bbc-toJSON ] collection.toJSON([options])
[ bbc-sync ] collection.sync(method, collection, [options])
[ bbc-add ] collection.add([], [options])
[ bbc-remove ] collection.remove([], [options])
[ bbc-reset ] collection.reset(([], [options])
[ bbc-set ] collection.set([], [options]);
[ bbc-get ] collection.get(id)
[ bbc-at ] collection.at(index)
[ bbc-put ] collection.push(model, [options])
[ bbc-unshift ] collection.unshift(model, [options])
[ bbc-shift ] collection.shift([options])
[ bbc-pop ] collection.pop([options])
[ bbc-slice ] collection.slice(begin, end)
[ bbc-length ] collection}.length
[ bbc-comparator ] collection.comparator = "key"
[ bbc-sort ] collection.sort([options])
[ bbc-pluck ] collection.pluck(attribute)
[ bbc-where ] collection}.where(attribute)
[ bbc-findwhere ] collection.findWhere(attribute)
[ bbc-url ] collection.url = ""
[ bbc-parse ] collection.parse( response, options)
[ bbc-clone ] collection.clone()
[ bbc-fetch ] collection.fetch([options])
[ bbc-create ] collection.create(attributes}, [options])
```

### Views
```
[ bbv-extend ] Backbone.View.extend({})
[ bbv-setElement ] view.setElement(element)
```

### Router
```
[ bbr-extend ] Backbone.Router.extend({})
[ bbr-route ] router.route(path, name, [callback])
[ bbr-navigate ] router.navigate(fragment, [options])
[ bbr-exe ] router.execute = function(callback, args) { ... }
```

## License

Copyright (c) 2014 Stephan L. Smith

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
