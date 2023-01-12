'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-flutter')
      .service('myService')
      .getShema();
  },
});


// module.exports = {
  
//   count(ctx) {
//     ctx.body = strapi.contentTypes;
//   },
// };