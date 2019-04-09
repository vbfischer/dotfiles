function gitsubl() {
    git config --global core.editor "subl -n -w"
}

function gitvim() {
    git config --global core.editor "vim"
}

function gi() { curl -L -s https://www.gitignore.io/api/$@ ;}
