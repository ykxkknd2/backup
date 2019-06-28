const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8001 });

wss.on('open', function() {
    console.log('ws opened');
});

wss.on('connection', function connection(ws) {
    console.log('ws connection');
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });

    ws.on('close',function(){
        console.log('connect close');
    });

    setInterval(()=>{
        ws.send(new Date().toString())
    },10000)
});
