export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
export ZSH="$HOME/.zsh"
export ZSH_CACHE_DIR="$ZSH/cache"
export GISTY_DIR="$HOME/Code/gists"

# Setup environment for development
PROJECT_PATHS=(~/Code ~/IDEXX)

export JAVA_HOME=$(/usr/libexec/java_home -v1.8)
export MAVEN_OPTS='-Xms128m -Xmx796m -XX:PermSize=64m -XX:MaxPermSize=172m'

export LC_ALL=en_US.UTF-8
export HOMEBREW_GITHUB_API_TOKEN=b4d88696f0ad82c8aff4712ede54178df813cddf
