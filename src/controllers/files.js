var fs = require('fs');
var unzip = require('unzip');
var fsExtra = require('fs-extra');

module.exports = {

    upload: function (req, res) {
        fs.readFile(req.files.zip.path, function (err, data) {
            if (!err) {
                var name = req.files.zip.name;
                var newPath = "./uploads/" + name;
                var unzipPath = "./uploads/" + name.split('.')[0];
                fs.writeFile(newPath, data, function (err) {
                    if (err) {
                        res.status(400).json({
                            'error': err
                        });
                    } else {
                        res.status(201).json({
                            'response': "Saved"
                        });
                        fs.createReadStream(newPath).pipe(unzip.Extract({ path: unzipPath }));
                        // function for remove files
                        setTimeout(function () {
                            fs.unlink(newPath);
                            if (fsExtra.existsSync(unzipPath)) {
                                fsExtra.readdirSync(unzipPath).forEach(function (file, index) {
                                    var curPath = unzipPath + "/" + file;
                                    if (fsExtra.lstatSync(curPath).isDirectory()) { // recurse
                                        deleteFolderRecursive(curPath);
                                    } else { // delete file
                                        fsExtra.unlinkSync(curPath);
                                    }
                                });
                                fs.rmdir(unzipPath);
                            }
                        }, 3000);
                    }
                });
            } else {
                res.status(500).json({
                    'error': err
                });
            }
        });
    }
};