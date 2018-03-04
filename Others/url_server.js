var http = require('http');

var url = require('url');

var urlParser = function(request, response)
{
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<h1>Dados da query string</h1>");
	var result = url.parse(request.url, true);
	for(var key in result.query)
	{
		response.write("<h2>"+key+" : "+result.query[key]+"</h2>");
	}
	response.end();
}

var server = http.createServer(urlParser);

var serverInit = function()
{
	console.log('Servidor http');
}

server.listen(3000, serverInit);