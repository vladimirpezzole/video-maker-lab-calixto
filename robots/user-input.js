content.searchTerm = askAndReturnSearchTerm()
content.prefix = askAndReturnPrefix()

function askAndReturnSearchTerm() {
	return readline.question('Escreva o termo wikipedia a ser procurado: ')
}

function askAndReturnPrefix(){
	const prefixes = ['Who is', 'What is', 'The history of']
	const selectedPrefixIndex = readline.keyInSelect(prefixes,'Choose one option: ')
	const selectedPrefixText = prefixes[selectedPrefixIndex]

	return selectedPrefixText
}