export ANTIGEN_HOME=$HOME/.homesick/repos/bzdots/antigen

source $ANTIGEN_HOME/antigen.zsh

# Path to your oh-my-zsh installation.
#
# export ZSH=$HOME/.oh-my-zsh

# ZSH_THEME="ys"

ZSH_CUSTOM=$HOME/.homesick/repos/bzdots/custom

plugins=(jsontools svn sublime fasd)

antigen use oh-my-zsh

antigen bundles <<EOBUNDLES
    command-not-found
    svn

    git
    voronkovich/gitignore.plugin.zsh
    git-extras


    fasd
    brew
    nvm
    heroku
    sublime
    rbenv

    djui/alias-tips
    sindresorhus/pure
    chriskempson/base16-iterm2
    chriskempson/base16-shell base16-colors.dark.sh
    common-aliases

    zsh-users/zsh-completions src
    zsh-users/zsh-syntax-highlighting
    zsh-users/zsh-history-substring-search ./zsh-history-substring-search.zsh
EOBUNDLES

ZSH_HIGHLIGHT_HIGHLIGHTERS=(main brackets pattern)

# antigen theme robbyrussell
antigen apply

source $ZSH_CUSTOM/paths.zsh

