const {upperFirst} = require('./utils');

function variables(obj, singularName){
    var res = [];
    
    for(var key in obj.attributes){
      var variable = obj.attributes[key]
      switch (variable.type) {
        case "string":
          res.push({
            type: "String",
            name: key,
            required: variable.required
          })
          break;
        case "integer":
          res.push({
            type: "int",
            name: key,
            required: variable.required
          })
          break;
        case "richtext":
          res.push({
            type: "String",
            name: key,
            required: variable.required
          })
          break;
        case "boolean":
          res.push({
            type: "bool",
            name: key,
            required: variable.required
          })
          break;
        case "biginteger":
          res.push({
            type: "int",
            name: key,
            required: variable.required
          })
          break;
        case "decimal":
          res.push({
            type: "double",
            name: key,
            required: variable.required
          })
          break;
        case "float":
          res.push({
            type: "double",
            name: key,
            required: variable.required
          })
          break;
        case "relation":
          var repeatable;
          if(variable.relation == 'oneToMany'){
            repeatable = true
          } else if(variable.relation == 'manyToOne'){
            repeatable = false
          }
          res.push({
            relation: strapi.contentTypes[variable.target].info.singularName,
            type: upperFirst(strapi.contentTypes[variable.target].info.singularName),
            name: key,
            required:  variable.required,
            repeatable: repeatable
          })
          break;
        case "component":
          console.log(strapi.components)
          var repeatable;
          repeatable = variable.repeatable
          res.push({
            component: strapi.components[variable.component].info.displayName,
            type: upperFirst(strapi.components[variable.component].info.displayName),
            name: key,
            required:  variable.required,
            repeatable: repeatable
          })
          break;
      
        default:
          break;
      }
    }
    return res;
  }

module.exports = {
    variables
};