export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
export ZSH="$HOME/.zsh"
export ZSH_CACHE_DIR="$ZSH/cache"
export GISTY_DIR="$HOME/Code/gists"
export EDITOR="atom"

# Setup environment for development
PROJECT_PATHS=(~/Code ~/IDEXX)

export JAVA_HOME=$(/usr/libexec/java_home -v1.7)

export M2_HOME=$(brew --prefix maven)/libexec
export M2=$M2_HOME/bin

export MAVEN_OPTS='-Xms512m -Xmx1024m -XX:PermSize=64m -XX:MaxPermSize=172m'

export LC_ALL=en_US.UTF-8
export HOMEBREW_GITHUB_API_TOKEN=a9928028045301c16d840afc9beb055842fbeb3f

nvm use stable
