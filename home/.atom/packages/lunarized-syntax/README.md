Lunarized
=========
A fork of the Atom version of the famous [Solarized] theme—with a moonlit aura.

Design Decisions
----------------

I love the harmonious blend of Solarized's accent colors and how well they all fit together.
After all, the most important facet of a syntax theme is to be able to easily differentiate
the different tokens in source code. And Solarized manages to achieve this while still
looking beautiful.

However, the dark blue "in the shade of a tree" background (as well as the yellow
morning-sun variant) break this neutrality. Lunarized fixes it by completely
desaturating the base colors as well as lowering each of their brightnesses by 15%.
Plain text has also been bumped from the base0 to base1 color to compensate.

Screenshots
-----------

![](https://dl.dropboxusercontent.com/u/82187473/Screenshots/Lunarized-Zsh.png)

![](https://dl.dropboxusercontent.com/u/82187473/Screenshots/Lunarized-CSS.png)

![](https://dl.dropboxusercontent.com/u/82187473/Screenshots/Lunarized-Vim.png)

Installation
------------

### To get the Atom package:

* Bring up Settings via `cmd-,`
* Go to the Themes page
* Search for Lunarized and install

### To get the Vim colorsheme:

With [pathogen]:

    cd ~/.vim/bundle
    git clone https://github.com/aclissold/lunarized-syntax

Without pathogen:

    mkdir -p ~/.vim/colors
    cd ~/.vim/colors
    curl -O https://raw.githubusercontent.com/aclissold/lunarized-syntax/master/lunarized.vim


[Solarized]: http://ethanschoonover.com/solarized
[pathogen]: https://github.com/tpope/vim-pathogen
