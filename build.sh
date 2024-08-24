#!/bin/bash

rm ./dist.zip
rm -R ./dist

ROADROLLER_ARGS=$(./roadroller-args.sh)

npx tsc 
npx vite build

cd dist

npx html-minifier-terser --collapse-whitespace --remove-comments --minify-js true --minify-css true --collapse-inline-tag-whitespace --collapse-boolean-attributes --no-newlines-before-tag-close --remove-attribute-quotes --remove-empty-attributes --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --remove-tag-whitespace --use-short-doctype ./index.html > ./index.min.html
cp ./index.min.html ./index.html
rm ./index.min.html

echo "Running roadroller with: ${ROADROLLER_ARGS}"
npx roadroller ${ROADROLLER_ARGS} ./assets/index.js > ./assets/index.min.js
cp ./assets/index.min.js ./assets/index.js
rm ./assets/index.min.js

zip ../dist.zip index.html assets/*

cd ..
advzip -z -4 dist.zip

echo `stat --printf="%s" dist.zip` / 13312
