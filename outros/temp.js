nlu.analyze({
	  'text':'Hi I am Michael Jackson and I like doing the moonwalk dance move.',
	  'features': {
	    keywords: {}
	   }
	})
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2))
    process.exit(0);
  })
  .catch(err => {
    console.log('error:', err)
    process.exit(0);
  });
---

nlu.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2))
    process.exit(0);
  })
  .catch(err => {
    console.log('error:', err)
    process.exit(0);
  });