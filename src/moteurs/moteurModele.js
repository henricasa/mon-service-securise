const dot = require('dot');

/* eslint-disable no-useless-escape */
dot.templateSettings = {
  evaluate: /__([\s\S]+?)__/g,
  interpolate: /__=([\s\S]+?)__/g,
  encode: /__!([\s\S]+?)__/g,
  use: /__#([\s\S]+?)__/g,
  define: /__##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#__/g,
  conditional: /__\?(\?)?\s*([\s\S]*?)\s*__/g,
  iterate: /__~\s*(?:__|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*__)/g,
  varname: 'donnees',
  strip: false,
};
/* eslint-enable no-useless-escape */

const confectionne = (modele, donnees) => {
  const template = dot.template(modele);
  return template(donnees);
};

module.exports = { confectionne };
