
'use strict';

const critical = require('critical');

const generateCritical = async (url) => {
  const startTime = Math.round(+new Date()/1000);
  console.log('generating critical css for', url);
  const {css, html, uncritical} = await critical.generate({
    strict: false,
    rebase: false,
    minify: false,
    base: 'dist',
    src: url,
    penthouse: {
      timeout: 40000,
      pageLoadSkipTimeout: 30000,
    },
    dimensions: [
      {
        height: 375,
        width: 812
      },
      {
        height: 768,
        width: 1024
      },
      {
        height: 1280,
        width: 800
      },
      {
        height: 1980,
        width: 1280
      },
    ]
  });

  const endTime = Math.round(+new Date()/1000);
  const totalTime = endTime - startTime;
  console.log(`done in ${totalTime}s`);
  return css;
}

// const generateCritical = (url) => {
//   return new Promise((resolve, reject) => {
//     const startTime = Math.round(+new Date()/1000);
//     console.log('generating critical css...', url);
//     critical.generate({
//       strict: false,
//       rebase: false,
//       minify: false,
//       base: 'dist',
//       src: url,
//       dimensions: [
//         {
//           height: 375,
//           width: 812
//         },
//         {
//           height: 768,
//           width: 1024
//         },
//         {
//           height: 1280,
//           width: 800
//         },
//         {
//           height: 1980,
//           width: 1280
//         },
//       ]
//     }).then(({css, html, uncritical}) => {
//       const endTime = Math.round(+new Date()/1000);
//       const totalTime = endTime - startTime;
//       console.log(`done in ${totalTime}s`)
//       resolve(css);
//     }).error(error => {
//       console.log('err:', error);
//       reject(error);
//     });
//   });
// }

module.exports = {
  generateCritical
};
