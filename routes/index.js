// https://stackoverflow.com/questions/6059246/how-to-include-route-handlers-in-multiple-files-in-express

var fs = require("fs");

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf("."));
    require("./" + name)(app);
  });
};
