fis3-receiver
========

FIS3 receiver on node.js

### use

```bash
$ npm install -g fis3-receiver
$ fisrcv # default port 8999, use `fisrcv <port>` change port
```

_fis-conf.js_

```javascript
fis.match( '*', {
    deploy: fis.plugin( 'http-push', {
        receiver: 'http://127.0.0.1:6776/receiver',
        // 注意这个是指的是测试机器的路径，而非本地机器
        to: '/home/xxx/forprojects/output'
    } )
} )
```
