self.addEventListener('install', function() {
    console.log('install event fire')
})

self.addEventListener('activate', function() {
    console.log('activate event fire')
});


self.addEventListener('push', function(event) {
    // 读取 event.data 获取传递过来的数据，根据该数据做进一步的逻辑处理
    let obj;
    try{
        obj = event.data.json();
    }catch (e) {
        obj = '来自FCM的信息' + new Date().getTime();
    }
    console.log('push data: ',obj)

    // 逻辑处理示例
    if(Notification.permission === 'granted') {
        console.log(123)
        //event.waitUntil很重要，否则notificationclick 可能触发不起来
        event.waitUntil(
            self.registration.showNotification("新消息", {
            body: `这是消息内容 : ${obj}`,
            icon: 'icon.png'
        }))
    }
});

//监听通知点击事件
self.addEventListener("notificationclick", function (event) {
    console.log('notificationclick event fire')
    event.notification.close();
    let url = "https://www.vipcode.com";
    event.waitUntil(
        //获取window端 https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
        clients.matchAll({
            type: "window"
        })
        .then(function () {
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// let ws;
//
// self.addEventListener("sync", function (event) {
//     if (event.tag == "workOrderSync") {
//         connectWS()
//     }
// });

// function connectWS(){
//     if(ws) return;
//
//     ws = new WebSocket("ws://localhost:8001");
//
//     ws.onopen = function() {
//         // Web Socket 已连接上，使用 send() 方法发送数据
//         ws.send("发送数据");
//     };
//
//     ws.onmessage = function (evt) {
//         self.registration.showNotification("新消息", {
//             body: `这是消息内容 : ${evt.data}`,
//             icon: 'icon.png'
//         })
//     };
//
//     ws.onclose = function(){
//         ws = null;
//     }
// }
//
// connectWS();

