const enclose = require('enclose');
enclose.compile({
    input: 'dist/bundle.js',
    output: 'executables/hemyrender.exe',
    target: 'win32-x64',
    compression: true
});