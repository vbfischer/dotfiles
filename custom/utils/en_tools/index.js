var Evernote = require('evernote').Evernote;

var developerToken = 'S=s13:U=175bca:E=14f28cbce3e:C=147d11aa0a8:P=1cd:A=en-devtoken:V=2:H=d6272ba51df7e8d2af33802f724d24c5';

var client = new Evernote.Client({
  token: developerToken,
  sandbox: false
});

var noteStore = client.getNoteStore();

var notebooks = noteStore.listNotebooks(function(err, notebooks) {
  console.log('found ' + notebooks.length + ' notebooks');

  for(var i in notebooks) {
    console.log('  * ' + notebooks[i].name);
  }
});
