#!/bin/bash

npx tsc 
npx vite build

cd dist
zip ../dist.zip * assets/*
cd ..
advzip -z -4 dist.zip

echo `stat --printf="%s" dist.zip` / 13312



