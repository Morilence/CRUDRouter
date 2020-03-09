const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');

class Putter {

    constructor (db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
        this.routes = new Router()
            .put('/:id', async ctx => {
                let returnData = null;
                const payload = ctx.request.body;
                try {
                    assert.ok(payload.update!=undefined, "update must be defined");
                    assert.equal(Object.prototype.toString.call(payload.update), '[object Object]', "update must be an object");
                    await this.db.updateOne(
                        this.collectionName,
                        {_id: ObjectId(ctx.params.id)},
                        payload.update,
                        payload.options==undefined?{}:payload.options
                    ).then(res => {
                        returnData = {
                            status: 200,
                            result: res.result
                        }
                    })
                } catch (err) {
                    switch (err.name) {
                        case "AssertionError":
                            returnData = {
                                status: 400,
                                errMsg: err.message
                            }
                            break;
                        default:
                            returnData = {
                                status: 500,
                                errMsg: err.message
                            }
                    }
                }
                ctx.type = 'json';
                ctx.body = returnData;
            })
            .put('/', async ctx => {
                let returnData = null;
                const payload = ctx.request.body;
                try {
                    switch (payload.mode) {
                        case undefined:
                        case "one": {
                            assert.ok(payload.filter!=undefined, "filter must be defined");
                            assert.ok(payload.update!=undefined, "update must be defined");
                            assert.equal(Object.prototype.toString.call(payload.filter), '[object Object]', "filter must be an object");
                            assert.equal(Object.prototype.toString.call(payload.update), '[object Object]', "update must be an object");
                            await this.db.updateOne(
                                this.collectionName,
                                payload.filter,
                                payload.update,
                                payload.options==undefined?{}:payload.options
                            ).then(res => {
                                returnData = {
                                    status: 200,
                                    result: res.result
                                }
                            });
                        }
                        break;
                        case "many": {
                            assert.ok(payload.filter!=undefined, "filter must be defined");
                            assert.ok(payload.update!=undefined, "update must be defined");
                            assert.equal(Object.prototype.toString.call(payload.filter), '[object Object]', "filter must be an object");
                            assert.equal(Object.prototype.toString.call(payload.update), '[object Object]', "update must be an object");
                            await this.db.updateMany(
                                this.collectionName,
                                payload.filter,
                                payload.update,
                                payload.options==undefined?{}:payload.options
                            ).then(res => {
                                returnData = {
                                    status: 200,
                                    result: res.result
                                }
                            });
                        }
                        break;
                        case "bulk": {
                            assert.ok(payload.operations!=undefined, "operations must be defined");
                            assert.equal(Object.prototype.toString.call(payload.operations), '[object Array]', "operations must be an array");
                            await this.db.bulkWrite(
                                this.collectionName,
                                payload.operations,
                                payload.options==undefined?{}:payload.options
                            ).then(res => {
                                returnData = {
                                    status: 200,
                                    result: {
                                        ok: res.ok,
                                        nMatched: res.nMatched,
                                        nModified: res.nModified
                                    }
                                }
                            });
                        }
                        break;
                        default:
                            assert.fail("invalid val of mode");
                    }
                } catch (err) {
                    switch (err.name) {
                        case "AssertionError":
                            returnData = {
                                status: 400,
                                errMsg: err.message
                            }
                            break;
                        default:
                            returnData = {
                                status: 500,
                                errMsg: err.message
                            }
                    }
                }
                ctx.type = 'json';
                ctx.body = returnData;
            })
            .routes();
    }

    getRoutes () {
        return this.routes;
    }
}

module.exports = Putter;