#!/bin/bash

# Clean generated css
rm -rf public/css/*
# Launch command-line http server
# https://github.com/indexzero/http-server
node node_modules/http-server/bin/http-server ./ -p 8080 &
# Launch gem sass
# http://sass-lang.com/documentation/file.SASS_REFERENCE.html
sass --watch scss:public/css/min/ --style compressed
