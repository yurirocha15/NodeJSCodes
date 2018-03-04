module.exports = function(io)
{
	var crypto = require('crypto');
	var redis = require('redis').createClient();
	var sockets = io.sockets;
	var onlines = {};
	sockets.on('connection', function(client)
	{
		/*console.log(client);
		console.log(client.handshake);
		console.log(client.handshake.session);*/
		var session = client.handshake.session;
		var usuario = session.usuario;
		redis.sadd('onlines', usuario.email, function(erro)
		{
			redis.smembers('onlines', function(erro, emails)
			{
				emails.forEach(function(email)
				{
					client.emit('notify-onlines', email);
					client.broadcast.emit('notify-onlines', email);
				});
			});
		});

		client.on('join', function(sala)
		{
			if(!sala)
			{
				var timestamp = new Date().toString();
				var md5 = crypto.createHash('md5');
				sala = md5.update(timestamp).digest('hex');
				var data = {email: usuario.email, sala: sala};
				client.broadcast.emit('new-chat', data);
			}
			session.sala = sala;
			client.join(sala);
			
			redis.lrange(sala, 0, -1, function(erro, msgs)
			{
				msgs.forEach(function(msg)
				{
					client.emit('send-client', msg);
				});
				var msg = "<b>" + usuario.nome + "</b> entrou no chat.<br>";
				redis.rpush(sala, msg);
				sockets.in(sala).emit('send-client', msg);	
			});
				
		});
		client.on('disconnect', function()
		{
			var sala = session.sala;
			var msg = "<b>" + usuario.nome + "</b> saiu do chat.<br>";
			redis.rpush(sala, msg);
			client.broadcast.emit('notify-offlines', usuario.email);
			sockets.in(sala).emit('send-client', msg);
			redis.srem('onlines', usuario.email);
			client.leave(sala);
		});
		client.on('send-server', function(msg)
		{
			var sala = session.sala;
			var data = {email: usuario.email, sala: sala};
			msg = "<b>" + usuario.nome + ":</b> " + msg + "<br>";
			redis.rpush(sala, msg);
			client.broadcast.emit('new-message', data);
			sockets.in(sala).emit('send-client', msg);
		});
	});
}