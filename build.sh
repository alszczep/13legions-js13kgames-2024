#!/bin/bash

npx tsc 
npx vite build

cd dist

npx html-minifier-terser --collapse-whitespace --remove-comments --minify-js true --minify-css true --collapse-inline-tag-whitespace --collapse-boolean-attributes --no-newlines-before-tag-close --remove-attribute-quotes --remove-empty-attributes --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-style-link-type-attributes --remove-tag-whitespace --use-short-doctype ./index.html > ./index.min.html
ls
cp ./index.min.html ./index.html
ls
rm ./index.min.html
ls

zip ../dist.zip index.html assets/*

cd ..
advzip -z -4 dist.zip

echo `stat --printf="%s" dist.zip` / 13312



