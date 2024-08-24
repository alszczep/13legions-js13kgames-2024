const { exec } = require('node:child_process');
const { writeFileSync } = require('fs');

const timeout = 60 * 1000;

const logProgress = () => {
    let t = timeout;
    setInterval(() => {
        t -= 5000;
        console.log(`${t / 1000} seconds left`);
    }, 5000);
};
logProgress();

exec(
    `node ${__dirname}/node_modules/roadroller/cli.mjs -OO -t js -M 512 ${__dirname}/dist/assets/index.js`,
    { timeout, killSignal: 'SIGINT', maxBuffer: 1024 * 1024 * 32, shell: "/bin/bash" },
    (_, __, stderr) => {
        console.log(stderr);
        const foundArgs = stderr.split('\n').filter(l => l.includes('<-')).map(a => ({
            args: a.split(') ')[1].split(':')[0],
            size: a.split(': ')[1].split(' <')[0]
        }))
        const bestArgs = foundArgs.reduce((acc, curr) => {
            if (acc.size < curr.size) {
                return acc;
            }
            return curr;
        })

        console.log(`${bestArgs.args}   -   ${bestArgs.size}`);
        writeFileSync(
            `${__dirname}/roadroller-args.sh`,
            `#!/bin/bash \necho "${bestArgs.args}"
            `);
        process.exit(0);
    });

