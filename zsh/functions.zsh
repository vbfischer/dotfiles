function gitsubl() {
    git config --global core.editor "subl -n -w"
}

function gitvim() {
    git config --global core.editor "vim"
}

function cra() {
  create-react-app $1
  cd $1
  rm src/App.* src/serviceWorker.js src/logo.svg src/index.css
  > src/index.js
}

function gi() { curl -L -s https://www.gitignore.io/api/$@ ;}
