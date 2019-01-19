const http = require('http');
const routes = require('./modules/routes') ;
const url = require('url');

const server = http.createServer(function(req,res){
    if(req.url === '/favicon.ico'){
        res.end();
        return;
    }

    const pathName = url.parse(req.url).pathname.substr(1);
   
    try {
        routes[pathName](req,res)
    } catch (error) {
        routes['home'](req,res);
        console.log(error.message);
    }
})
server.listen(3000);
console.log("服务启动成功");