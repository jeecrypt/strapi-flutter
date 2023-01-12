'use strict';

const fs = require('fs');

const {generateModels} = require('./model');
const {dir} = require('./config')
const {clearFlutterFolder} = require('./utils');

function dartCreate(){
  
  // clear flutter folder
  clearFlutterFolder();
  
  // generate models
  var res = generateModels();

  // generate API classes
  res.forEach((file) => {

  });

  return res;
}

module.exports = {
  getShema(){
    return dartCreate();
  },
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
};