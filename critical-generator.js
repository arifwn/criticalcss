
'use strict';

const critical = require('critical');

const generateCritical = (url) => {
  return new Promise((resolve, reject) => {
    const startTime = Math.round(+new Date()/1000);
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
        const endTime = Math.round(+new Date()/1000);
        const totalTime = endTime - startTime;
        console.log(`done in ${totalTime}s`)
        resolve(val);
      }
    });
  });
}

module.exports = {
  generateCritical
};
