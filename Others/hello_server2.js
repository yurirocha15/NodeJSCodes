var http = require('http');

var paginaPrincipal = function(request, response)
{
	response.writeHead(200, {"Content-Type": "text/html"});
	if(request.url == "/")
	{
		response.write("<h1>Página Principal</h1>");]
	}
	else if(request.url == "/bemvindo")
	{
		response.write("<h1>Benvindo :) </h1>");
	}
	else
	{
		response.write("<h1>Página não encontrada :( </h1>");
	}
	response.end();
}

var server = http.createServer(paginaPrincipal);

var servidorRodando = function()
{
	console.log('Servidor rodando!');
}

server.listen(3000, servidorRodando);