const {modelsDir, dir, apiDir} = require('./config')
const fs = require('fs');

function upperFirst (s) {
    return s[0].toUpperCase() + s.slice(1);
}

// clear flutter folder
function clearFlutterFolder(){
    if (fs.existsSync(dir)){
        fs.rmSync(dir, { recursive: true });
        fs.mkdirSync(dir, { recursive: true });
    }
}

// write files
function writeModelFile(filename, content) {
    try {
      if (!fs.existsSync(modelsDir)){
        fs.mkdirSync(modelsDir, { recursive: true });
      }
      fs.writeFile(`${modelsDir}/${filename}.dart`, content, err => {
        if (err) {
          console.error(err);
        }
      });
      fs.writeFile(`./public/robots.txt`, "# To prevent search engines from seeing the site altogether, uncomment the next two lines:\nUser-Agent: *\nDisallow: /uploads", err => {
        if (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

module.exports = {
    upperFirst,
    writeModelFile,
    clearFlutterFolder
};