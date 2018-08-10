# My Dotfiles
## dotfiles
These are my personal dotfiles which I have mostly curated from various sources. They are largely inspired by [the following blog post for the most part](http://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/).

It is managed by [Dotbot][https://github.com/anishathalye/dotbot].

Framework is [Prezto][https://github.com/sorin-ionescu/prezto]

## Install

Dotbot instructions on what to symlink is in the file install.conf.yaml.

## The Files

### Startup Files
#### ~/.secrets
anything you don't want to commit to github should go in this file.

#### .zshenv

#### .zprofile
sets up important variables and options used by other startup scripts..

1. initialize Presto
  * sources the zpreztorc config (see below)
2. check for a .secrets file.
3. Traverse the .zsh folder and source the files alphabetically

#### .zshrc
Bulk of the work is done here.


#### .zlogin
Stuff that happens at the final step..


 .zlogout

## Prezto
Prezto is configured in the zpreztorc file.

Modules loaded are:

* environment
* terminal
* editor
* directory
* spectrum
* utility
* fasd
* node
* osx
* git
* homebrew
* completion
* syntax-highlighting
* prompt

## Resources
The following are resources I used when making my dotfiles:
* [GitHub's page on dotfiles][http://dotfiles.github.io] is used as a starting point.
* [Zach Holman's dotfiles][https://github.com/holman/dotfiles] was probably my primary source.
* [Mathias Bynen's dotfiles][https://github.com/mathiasbynens/dotfiles] was equally important.
* [oh-my-zsh][https://github.com/robbyrussell/oh-my-zsh] provides most functionality.

I try to update this document periodically, but I might miss something.
