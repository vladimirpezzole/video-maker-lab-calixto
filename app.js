var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Olá Mundo!');
});

app.listen(5000, function() {
  console.log('App de Exemplo escutando na porta 5000!');
});