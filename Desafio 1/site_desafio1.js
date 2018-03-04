//Desafio 1 NodeJS
//Autor: Yuri Goncalves Rocha <yurirocha15@gmail.com>

var http = require('http');
var url = require('url');
var fs = require('fs');

var urlParser = function(request, response)
{
	response.writeHeader(200, {'Content-Type': 'text/html'});
	var path = url.parse(request.url).pathname;
	try
	{
		if (path == "/" || path == "/artigos")
		{
			fs.readFile(__dirname + "/artigos.html", function(erro, html)
			{
				response.writeHeader(200, {'Content-Type': 'text/html'});
				response.end(html);
			});
		}
		else if(path == "/contato")
		{
			fs.readFile(__dirname + "/contato.html", function(erro, html)
			{
				response.end(html);
			});
		}
		else
		{
			fs.readFile(__dirname + "/erro.html", function(erro, html)
			{
				response.end(html);
			});
		}
	}
	catch(erro)
	{
		console.log(erro);
	}
}

var server = http.createServer(urlParser);

server.listen(3000, function()
{
	console.log("Iniciado!")
});