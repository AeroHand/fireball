var Path = require('path');
var Fs = require('fs');
var Chalk = require('chalk');
var SpawnSync = require('child_process').spawnSync;

var exePath = '';
if ( process.platform === 'darwin' ) {
    exePath = './bin/electron/Electron.app/Contents/MacOS/Electron';
}
else {
    exePath = './bin/electron/Electron.exe';
}

var files;
var indexFile = './test/index.js';
var testDirs = [
    './test/',
    './editor-framework/test/',
];
var singleTestFile = process.argv[2];

// accept
if (singleTestFile) {
    singleTestFile = ('./test/' + process.argv[2] + '.js').replace('.js.js', '.js');
    SpawnSync(exePath, ['./', '--test', singleTestFile], {stdio: 'inherit'});
}
else {
    testDirs.forEach( function ( path ) {
        var indexFile = Path.join( path, 'index.js' );
        if ( Fs.existsSync(indexFile) ) {
            files = require('./' + indexFile);
            files.forEach(function ( file ) {
                console.log( Chalk.magenta( 'Start test (' + file + ')') );
                SpawnSync(exePath, ['./', '--test', file], {stdio: 'inherit'});
            });
        }
        else {
            Globby ( Path.join(path, '**/*.js'), function ( err, files ) {
                files.forEach(function (file) {
                    console.log( Chalk.magenta( 'Start test (' + file + ')') );
                    SpawnSync(exePath, ['./', '--test', file], {stdio: 'inherit'});
                });
            });
        }
    });
}
