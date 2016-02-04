var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

app.get('/', function(req, res){
  //res.sendFile(path.join(__dirname, '../public', 'test.html'));
  res.sendFile(__dirname+'/test.html');
});

/* io.on('connection', function(socket){
  console.log('a user connected');
});
*/

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('chatmessage', function(data){
	  msg = JSON.parse(JSON.stringify(data));
	  var is_chrome = msg.brw.toLowerCase().indexOf('chrome') > -1;
	  var is_firefox = msg.brw.toLowerCase().indexOf('firefox') > -1;
	  
	  // http://servicedesk.au-syd.mybluemix.net/api/translat
	  if(is_chrome) {
		request.post({url:'http://localhost:3000/api/translate', form: {model_id:'ar-en', text:msg.msg}}, function(err,response,body){
		var translatedMsg = JSON.parse(body).translations[0].translation;
		console.log(translatedMsg);
		socket.broadcast.emit('chatmessage', translatedMsg);
	  });
	  }
	  else if(is_firefox) {
		request.post({url:'http://localhost:3000/api/translate', form: {model_id:'en-ar', text:msg.msg}}, function(err,response,body){
		var translatedMsg = JSON.parse(body).translations[0].translation;
		console.log(translatedMsg);
		socket.broadcast.emit('chatmessage', translatedMsg);
	  }); 
	  }
  });
});


http.listen(3100, function(){
  console.log('listening on *:3100');
});