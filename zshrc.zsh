# Bootstrap prezto!
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
fi

# Check for secrets we didn't want to check into repository
if [ -e ~/.secrets ]; then
  source ~/.secrets
fi

# Load zsh files (alphabetically...)
if [ -d $HOME/.zsh/ ]; then
  if [ "$(ls -A $HOME/.zsh/)" ]; then
    for config_file ($HOME/.zsh/*.zsh) source $config_file
  fi
fi
