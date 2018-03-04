module.exports = function(app)
{
	var Usuarios = app.models.usuario;
	var HomeController = 
	{
		index: function(req, res)
		{
			res.render('home/index');
		},
		login: function(req, res)
		{
			var query = {email: req.body.usuario.email};
			Usuarios.findOne(query).select('nome email').exec(function(erro, usuario)
			{
				if(erro)
					throw erro;
				else
				{
					if(usuario)
					{
						req.session.usuario = usuario;
						res.redirect('/contatos');
					}
					else
					{
						var usuario = req.body.usuario;
						Usuarios.create(usuario, function(erro, usuario)
						{
							if(erro)
							{
								res.redirect('/');
							}
							else
							{
								req.session.usuario = usuario;
								res.redirect('/contatos');
							}
						});
					}
				}
			});
		},
		logout: function(req, res)
		{
			req.session.destroy();
			res.redirect('/');
		}
	};
	return HomeController;
};