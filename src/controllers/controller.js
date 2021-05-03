const getIndexFile = (req, res, next) => {
    res.sendFile("index.html");
}

module.exports = {
    getIndexFile
}