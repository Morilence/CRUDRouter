const Router = require('koa-router');
const router = new Router();

const Getter = require('../modules/crud-router/Getter');
const Poster = require('../modules/crud-router/Poster');
const Putter = require('../modules/crud-router/Putter');
const Deleter = require('../modules/crud-router/Deleter');

const testDb = require('../db/testDb');

router
    .use(new Getter(testDb, 'test_for_crud-api').getRoutes())
    .use(new Poster(testDb, 'test_for_crud-api').getRoutes())
    .use(new Putter(testDb, 'test_for_crud-api').getRoutes())
    .use(new Deleter(testDb, 'test_for_crud-api').getRoutes());
    /*
        其他自定义路由
    */

module.exports = router.routes();