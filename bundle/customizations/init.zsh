[[ -f ~/.zshrc_local_pre ]] && source ~/.zshrc_local_pre

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
export ZSH="$HOME/.zsh"
export ZSH_CACHE_DIR="$ZSH/cache"
export GISTY_DIR="$HOME/Code/gists"
export EDITOR="atom"

export PASSWORD_STORE_DIR=~/.pass
export GNUPGHOME=~/.gnupg

# Setup environment for development 
# @commit: this is not new...
PROJECT_PATHS=(~/Code ~/IDEXX)

export JAVA_HOME=$(/usr/libexec/java_home -v1.7)

export M2_HOME=$(brew --prefix maven)/libexec
export M2=$M2_HOME/bin

export MAVEN_OPTS='-Xms512m -Xmx1024m -XX:PermSize=64m -XX:MaxPermSize=172m'

export LC_ALL=en_US.UTF-8

[[ -f ~/.zshrc_local ]] && source ~/.zshrc_local

nvm use stable