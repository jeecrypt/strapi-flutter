const {upperFirst, writeModelFile} = require('./utils');
const {variables} = require('./variables');

function lateFinal(v){
  if( v.type == "String" ||
    v.type == "int" ||
    v.type == "bool" ||
    v.type == "double"
  ){
    return "late "
  } else {
    return "late "
  }
}

function repeatableType(v){
  if(v.repeatable == true){
    return `List<${v.type}>${v.required == true ? "" : "?"}`
  } else {
    return `${v.type}${v.required == true ? "" : "?"}`;
  }
}

function fromJson(v){
  if(v.relation != undefined || v.component != undefined){
    if(v.repeatable == true){
      return `\n    ${v.name}: json['${v.name}'] ${v.required == true ? "" : `!= null ? (json['${v.name}'] as List<Map<String, dynamic>>).map<${v.type}>((e) => ${v.type}.fromJson(e`})).toList() ${v.required == true ? "" : ": []"},`
    } else {
      return `\n    ${v.name}: json['${v.name}'] ${v.required == true ? "" : `!= null ? ${v.type}.fromJson(json['${v.name}']`}) ${v.required == true ? "" : ": null"},`
    }
  } else {
    return `\n    ${v.name}: json['${v.name}'] ${v.required == true ? "" : `!= null ? json['${v.name}'] `}as ${v.type} ${v.required == true ? "" : ": null"},`
  }
}

function toJson(v){
  if(v.relation != undefined || v.component != undefined){
    if(v.repeatable == true){
      return `\n    '${v.name}': ${v.name}${v.required == true ? "" : "?"}.map((e) => e.toJson()).toList(),`
    } else {
      return `\n    '${v.name}': ${v.name}${v.required == true ? "" : "?"}.toJson(),`
    }
  } else {
    return `\n    '${v.name}': ${v.name},`
  }
}

function model(obj){
  var res = {}
  res.singularName = obj.info.singularName != null ? obj.info.singularName : obj.info.displayName;
  res.variables = variables(obj, res.singularName)
  res.code = "\n";

  // create imports
  res.code += `import 'index.dart';\n`

  // generate Dart class
  res.code += `\nclass ${upperFirst(res.singularName)} {\n`

  // generate Dart variables
  res.variables.forEach((v) => {
    res.code += `  ${lateFinal(v)}${repeatableType(v)} ${v.name};\n`
  })

  // generate Dart constructor
  res.code += `\n  ${upperFirst(res.singularName)}({`
  res.variables.forEach((v) => {
    res.code += `\n    ${v.required == true ? "required " : ""}this.${v.name},`
  })
  res.code = res.code.substring(0, res.code.length - 1)
  res.code += `\n  });\n`

  // generate Dart fromJson
  res.code += `\n  factory ${upperFirst(res.singularName)}.fromJson(Map<String, dynamic> json) => ${upperFirst(res.singularName)}(`
  res.variables.forEach((v) => {
    res.code += fromJson(v)
  })
  res.code = res.code.substring(0, res.code.length - 1)
  res.code += `\n  );\n`

  // generate Dart toJson
  res.code += `\n  Map<String, dynamic> toJson() => {`
  res.variables.forEach((v) => {
    res.code += toJson(v);
  })
  res.code = res.code.substring(0, res.code.length - 1)
  res.code += `\n  };\n`

  res.code += `}\n`
  writeModelFile(res.singularName, res.code);
  return res;
}

// generate index.dart file
function modelsIndexFile(models){
  var indexFile = ""
  models.forEach((file) => {
    indexFile += `export '${file.singularName}.dart';\n`
  })
  writeModelFile("index", indexFile);
}

function generateModels(){
  var res = [];
  // foreach content types
  for(var key in strapi.contentTypes) {
    console.log(key)
    if(key.startsWith("api::")){
      console.log(strapi.contentTypes[key].__schema__)
      var r = model(strapi.contentTypes[key].__schema__);
      res.push(r)
      console.log(`\x1b[33m${r.code}\x1b[0m`)
    }
  }

  for(var key in strapi.components) {
    console.log(key)
    console.log(strapi.components[key].__schema__)
    var r = model(strapi.components[key].__schema__);
    res.push(r)
    console.log(`\x1b[33m${r.code}\x1b[0m`)
  }
  // generate index.dart file
  modelsIndexFile(res)

  return res;
}

module.exports = {
  generateModels
};