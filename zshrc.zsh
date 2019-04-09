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

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/bfischer/lib/google-cloud-sdk/path.zsh.inc' ]; then source '/Users/bfischer/lib/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/bfischer/lib/google-cloud-sdk/completion.zsh.inc' ]; then source '/Users/bfischer/lib/google-cloud-sdk/completion.zsh.inc'; fi

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

