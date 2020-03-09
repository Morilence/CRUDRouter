const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const koaBody = require('koa-body');
const static = require('koa-static');

const app = new Koa({
    proxy: true,
    proxyIpHeader: 'X-Real-IP'
});
const router = new Router();

const api = require('./routes/api');

app
    .use(cors())
    .use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 10*1024*1024,
            keepExtensions: true,
        }
    }))

// 配置路由
router
    .get('/', async ctx => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./public/index.html');
    })
    .use('/api', api);

// 应用路由
app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(static(path.join(__dirname, './public')))
    
    .on("error", err => {
        console.log(err.name ,err.message ,new Date());
    });

// 启动服务
app.listen(3000, () => {
    console.log("listening on port 3000 ...");
});

