path=(
	$(brew --prefix homebrew/php/php55)/bin
	$(brew --prefix homebrew/apache/httpd24)/bin
    /usr/local/{bin,sbin}
    ~/.rbenv/shims
    ~/bin
    /usr/local/opt/coreutils/libexec/gnubin
    $path
    $ZSH_CUSTOM/bin
    ~/bin/Sencha/Cmd/4.0.5.87
)