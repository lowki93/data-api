module.exports = {

    saveData: function (req, res) {
        console.log(JSON.parse(req.body.data).latitude);
        console.log(req.body.data.latitude);
    }
};