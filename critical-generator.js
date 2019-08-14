
'use strict';

const critical = require('critical');

const generateCritical = (url) => {
  return new Promise((resolve, reject) => {
    critical.generate({
      src: url,
      inline: false,
      extract: false,
      inlineImages: false,
    }, (error, val) => {
      if (error) {
        console.log('err:', error)
        reject(error);
      } else {
        console.log('done')
        resolve(val);
      }
    });
  });
}

module.exports = {
  generateCritical
};
