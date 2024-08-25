#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $DIR/..

rm ./dist.zip
rm -R ./dist

npx tsc
npx vite build

cd ./dist

npx html-minifier-terser --collapse-whitespace --remove-comments --minify-js true --minify-css true --collapse-inline-tag-whitespace --collapse-boolean-attributes --no-newlines-before-tag-close --remove-attribute-quotes --remove-empty-attributes --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --remove-tag-whitespace --use-short-doctype ./index.html > ./index.min.html
cp ./index.min.html ./index.html
rm ./index.min.html

cd ../scripts

node ./config-roadroller.cjs 5
ROADROLLER_ARGS=$(./roadroller-args.sh)

cd ../dist/assets

echo "Running roadroller with: ${ROADROLLER_ARGS}"
npx roadroller ${ROADROLLER_ARGS} ./index.js > ./index.min.js
cp ./index.min.js ./index.js
rm ./index.min.js

cd ..

zip ../dist.zip index.html assets/*

cd ..

advzip -z -4 ./dist.zip

echo `stat --printf="%s" ./dist.zip` / 13312
