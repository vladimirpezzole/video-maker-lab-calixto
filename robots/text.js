const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
//lang do Algorithmia
const algorithmiaLang = require('../credentials/algorithmia.json').lang
const sentenceBoundaryDetection = require('sbd')

const watsonApiKey = require('../credentials/watson-nlu.json').apikey

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

const urlApi='https://gateway.watsonplatform.net/natural-language-understanding/api'
 
const nlu = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: watsonApiKey,
  url: urlApi
});

const state = require('./state.js')

async function robot() {
  console.log('> [text-robot] Inicializando...')
	const content = state.load()

	await fetchContentFromWikipedia(content)
	sanitizeContent(content)
	breakContentIntoSentences(content)
	limitMaximumSentences(content)
	await fetchKeywordsOfAllSentences(content)

	state.save(content)

	async function fetchContentFromWikipedia(content) {
		console.log('> [text-robot] Buscando conteúdo da Wikipedia')
		const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
		const term = {
		    "articleName": content.searchTerm,
		    "lang": algorithmiaLang
	    }
	    const wikipediaResponse = await wikipediaAlgorithm.pipe(term)
		// const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm) //versão anterior
		const wikipediaContent = wikipediaResponse.get()
		
		content.sourceContentOriginal  = wikipediaContent.content
		console.log('> [text-robot] Busca comcluída!')

	}

	function sanitizeContent(content) {
		const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
		console.log(withoutDatesInParentheses)

		content.sourceContentSanitized = withoutDatesInParentheses

		function removeBlankLinesAndMarkdown(text) {
			const allLines = text.split('\n')
			
			const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
				if (line.trim().length === 0 || line.trim().startsWith('=')){
					return false
				}

				return true
			})

			return withoutBlankLinesAndMarkdown.join(' ')

		}
	}

	function removeDatesInParentheses(text) {
		return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
	}

	function breakContentIntoSentences(content) {
		content.sentences = []

		const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
		sentences.forEach((sentence) => {
	      content.sentences.push({
	        text: sentence,
	        keywords: [],
	        images: []
	      })
	    })
	}

	function limitMaximumSentences(content) {
		content.sentences = content.sentences.slice(0, content.maximumSentences)
	}

	async function fetchKeywordsOfAllSentences(content) {
    console.log('> [text-robot] Começando a buscar palavras-chave do Watson')

		for (const sentence of content.sentences) {
      console.log(`> [text-robot] Sentença: "${sentence.text}"`)

			sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)

      console.log(`> [text-robot] Palavras-chave: ${sentence.keywords.join(', ')}\n`)
		}
	}

	async function fetchWatsonAndReturnKeywords(sentence) {
		return new Promise((resolve, reject) => {
			nlu.analyze({
				  'text': sentence,
				  'features': {
				    keywords: {}
				   }
      }, (error, response) => {
        if (error) {
          reject(error)
          return
        }

        const keywords = response.keywords.map((keyword) => {
          return keyword.text
        })

        resolve(keywords)
			})
		})
	}
}

module.exports = robot