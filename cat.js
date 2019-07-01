const myWatsonApiKey = 'eSjVWYiNv1K_lMtrrUTCKxSFSCOipodnSS7Rg6foIQYp'
const urlApi='https://gateway.watsonplatform.net/visual-recognition/api'

var VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-11-16',
  iam_apikey: myWatsonApiKey,
  url: urlApi
});

var params = {
  images_file: fs.createReadStream('car1.jpg')
};

visualRecognition.classify(params)
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.log(err);
  });