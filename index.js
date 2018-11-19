const fs = require('fs');
const path = require('path');
let program = require('commander');

function getAllFiles(folderName, dest, cb){
    fs.readdir(folderName, (err, files) => {
        if (err) throw err;
        for (let file of files) {
            let filePath = path.join(folderName, file);

            fs.stat(filePath, (err, stat) => {
                if (err) throw err;

                if (!stat.isDirectory()) {
                    let firstLetter = file[0].toLowerCase(),
                        Dest = path.join(dest, firstLetter),
                        newFilePath = path.join(Dest, file);

                    fs.mkdir(Dest, { recursive: true }, (err) => {
                        if (err) throw err;
                        fs.rename(filePath, newFilePath, (err)=>{
                            if(err) throw err;
                            cb(folderName);
                        });
                    });
                } else {
                    getAllFiles(filePath, dest, cb);
                }
            });
        }
    });
}

function removeDir(folderName){
    fs.readdir(folderName, (err, files) => {
        if (err) {
            throw err;
            process.exit(1);
        }
        if(files.length == 0) {
            fs.rmdir(folderName, err=>{
                if(err) throw err;
            });
        }
    })
}

program
    .command('rmv')
    .arguments('<dir1> <dir2>')
    .action(function (dir1, dir2) {
        getAllFiles(dir1,dir2, removeDir);
    })

;
program.parse(process.argv);