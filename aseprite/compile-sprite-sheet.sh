#!/bin/bash 

# needs `.env` file in the repo root with `ASEPRITE_EXE_PATH` variable set to the path of the aseprite executable

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd $DIR

source ../.env

for f in *.aseprite; do
    if [ "${f##*.}" == "aseprite" ]; then
        mystr="$f $mystr"
    fi
done

"$ASEPRITE_EXE_PATH" --batch $mystr --sheet spriteSheet.png --data spriteSheetData.json --sheet-pack

node ../scripts/map-spritesheet-data.cjs

mv spriteSheet.png ../src/assets/spriteSheet.png
mv spriteSheetData.json ../src/assets/spriteSheetData.json
