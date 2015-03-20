var fs = require('fs');

module.exports = {

    upload: function (req, res) {
        fs.readFile(req.files.image.path, function (err, data) {
            if (!err) {
                var newPath = "./uploads/" +   req.files.image.name;
                fs.writeFile(newPath, data, function (err) {
                    if (err) {
                        res.status(400).json({
                            'error': err
                        });
                    } else {
                        res.status(201).json({
                            'response': "Saved"
                        });
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