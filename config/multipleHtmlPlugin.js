let fs = require('fs');
let join = require('path').join;
HtmlWebpackPlugin = require('html-webpack-plugin');

function MultipleHtmlPlugin (options) {}

MultipleHtmlPlugin.prototype.apply = function(compiler) {
    let startPath = './src/';
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile() && val.match(/\.html$/i)) result.push(val);
        });

    }
    finder(startPath);

    result.forEach((v) => {
        new HtmlWebpackPlugin({
            template: startPath + v,
            filename: v
        }).apply(compiler)
    });

};

module.exports = MultipleHtmlPlugin;
