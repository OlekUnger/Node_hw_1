const fs = require('fs');
const path = require('path');
let program = require('commander');


function getAllFiles(folderName) {
    let files = fs.readdirSync(folderName);

    for (let file of files) {
        let filePath = path.join(folderName, file);
        let stat = fs.statSync(filePath);

        if (!stat.isDirectory()) {
            let firstLetter = file[0].toLowerCase(),
                fileDest = path.join('dest', firstLetter, file);

            if (!fs.existsSync(path.join('dest', firstLetter))) {
                fs.mkdirSync(path.join('dest', firstLetter));
            }

            fs.renameSync(filePath, fileDest);

        } else {
            getAllFiles(filePath);
        }
    }
};

function removeDir(folderName) {
    let files = fs.readdirSync(folderName);

    for (let file of files) {
        let filePath = path.join(folderName, file);
        removeDir(filePath);
    }

    fs.rmdirSync(folderName);
}

program
    .command('rmv')
    .arguments('<dir1> <dir2>')
    .option('-r, --recursive', 'Remove recursively')
    .action(function (dir1, dir2, cmd) {
        if (!fs.existsSync(dir2)) {
            fs.mkdirSync(dir2);
        }
        getAllFiles(dir1, dir2);

        if (cmd.recursive) {
            removeDir(dir1);
        }
    });

program.parse(process.argv);
