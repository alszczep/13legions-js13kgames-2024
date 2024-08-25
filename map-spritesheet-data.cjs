const { readFileSync, writeFileSync } = require('fs');

const data = readFileSync(`${__dirname}/src/assets/spriteSheetData.json`);
const parsedData = JSON.parse(data);

const keysMap = {
    "player 0.aseprite": "ps", // player standing
    "player 1.aseprite": "pah", // player attack
    "player 2.aseprite": "pa", // player attack heavy
    "knight 0.aseprite": "ks", // knight standing
    "knight 1.aseprite": "ka", // knight attack
    "rock.aseprite": "r", // rock
};

const mappedData = {
    f: Object.entries(parsedData.frames)
        .reduce((acc, [key, frame]) => {
            acc[keysMap[key]] = {
                x: frame.frame.x,
                y: frame.frame.y,
                w: frame.frame.w,
                h: frame.frame.h,
            }
            return acc;
        }, {}),
    w: parsedData.meta.size.w,
    h: parsedData.meta.size.h,
}

writeFileSync(`${__dirname}/src/assets/spriteSheetData.json`, JSON.stringify(mappedData));
