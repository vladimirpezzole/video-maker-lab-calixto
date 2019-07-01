const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const myWatsonApiKey = 'pySL-FQoMVjDLXSFvO-5iZzP9UMd_5QMuIg8PadsSWnZ'
const urlApi='https://gateway.watsonplatform.net/natural-language-understanding/api'

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: myWatsonApiKey,
  url: urlApi
});

/*
const analyzeParams = {
  text='Bruce Banner is the Hulk and Bruce Wayne is BATMAN! '
    'Superman fears not Banner, but Wayne.',
  'features': {
    concepts: {},
    keywords: {}
  }
};
*/

const analyzeParams = {
  'text':'Hi I am Michael Jackson and I like doing the moonwalk dance move.',
  'features': {
    concepts: {},
    keywords: {}
  }
};

/*
const analyzeParams = {
  'url': 'https://nodejs.org/en/',
  'features': {
    concepts: {},
    keywords: {}
  }
};
*/
/*
const analyzeParams = {
  'url': 'https://nodejs.org/en/',
  'features': {
    'categories': {
      'limit': 3
    }
  }
};
*/

nlu.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2))
    process.exit(0);;
  })
  .catch(err => {
    console.log('error:', err)
    process.exit(0);
  });
  
/*
nlu.analyse({
  'text': `Hi I am Michael Jackson and I like doing the moonwalk dance move.`,
  'features': {
    keywords:{}
  }
}, (error, response) => {
  if (error){
    throw error
  }

  console.log(JSON.stringify(response, null, 4))
  process.exit(0)
})
*/