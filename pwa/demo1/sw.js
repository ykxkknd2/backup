let cacheVersion = '1.0.0'; //缓存数据版本号

console.log(23)

let cacheList = [
    "./index.html",
    "./a.js",
    "./bg.png",
    "./test/b.js"
];

let _cache;

// 当浏览器解析完sw文件时，serviceworker内部触发install事件
self.addEventListener('install', function(e) {
    console.log('install event fire')
    // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
    e.waitUntil(
        caches.open(cacheVersion).then(function(cache) {
            _cache = cache;
            self.skipWaiting();  //不再等待其他页面还在使用旧版sw，立即激活当前版本
            //缓存数据
            return cache.addAll(cacheList)
        })
    )
});

self.addEventListener('activate', function(e) {
    console.log('activate event fire')
    e.waitUntil(
        Promise.all([
            // 通知所有客户端，使用新版的sw
            clients.claim(),
            // 清理旧版本缓存数据
            caches.keys().then(cacheList => Promise.all(
                cacheList.map(cacheName => {
                    if (cacheName !== cacheVersion) {
                        console.log('delete cache:',cacheName)
                        caches.delete(cacheName);
                    }
                })
            ))
        ])
    )
});


// 联网状态下执行
function onlineRequest(request) {
    console.log('fetch event, onlineRequest:',request.url)
    return fetch(request).then(response => {
        return response;
    }).catch(() => {
        // 获取失败，离线资源降级替换
        offlineRequest(request);
    });
}

// 离线状态下执行，降级替换
function offlineRequest(request) {
    console.log('fetch event, offlineRequest:',request.url)
    return _cache.match(request);
}

self.addEventListener('fetch', event => {
    event.respondWith(
        (function(){
            if(/a.js$/.test(event.request.url)){
                let res = new Response('console.log("我是假的a.js")',{status: 200})
                return res
            }

            if (navigator.onLine) {
                // 如果为联网状态
                return onlineRequest(event.request);
            } else {
                // 如果为离线状态
                return offlineRequest(event.request);
            }
        })()
    );
});
