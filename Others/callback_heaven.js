var fs = require('fs');
var path = require('path');
var lerDiretorio = function()
{
	fs.readdir(path.join(__dirname), function(erro, diretorio)
	{
		if (erro) return erro;
		diretorio.forEach(function(arquivo)
		{
			ler(arquivo);
		});
	});
};

var ler = function(arquivo)
{
	var path2 = './' + arquivo;
	fs.stat(path2, function(erro, stat)
	{
		if (erro) return erro;
		if (stat.isFile())
		{
			console.log('%s %d bytes', arquivo, stat.size);
		}
	});
};

lerDiretorio();