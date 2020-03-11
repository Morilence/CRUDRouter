const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');

class Deleter {

    constructor (db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
        this.routes = new Router()
            .delete('/:id', async ctx => {
                let returnData = null;
                try {
                    await this.db.deleteOne(
                        this.collectionName,
                        {_id: ObjectId(ctx.params.id)}
                    ).then(res => {
                        returnData = {
                            status: 200,
                            result: res.result
                        }
                    });
                } catch (err) {
                    returnData = {
                        status: 500,
                        errMsg: err.message
                    }
                }
                ctx.type = 'json';
                ctx.body = returnData;
            })
            .delete('/', async ctx => {
                let returnData = null;
                const payload = ctx.request.query;
                try {
                    switch(payload.mode) {
                        case undefined:
                        case "one": {
                            assert.ok(payload.filter!=undefined, "filter must be defined");
                            payload.filter = JSON.parse(payload.filter);
                            assert.equal(Object.prototype.toString.call(payload.filter), '[object Object]', "filter must be an object");
                            await this.db.deleteOne(
                                this.collectionName,
                                payload.filter,
                                payload.options==undefined?{}:JSON.parse(payload.options)
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
                            payload.filter = JSON.parse(payload.filter);
                            assert.equal(Object.prototype.toString.call(payload.filter), '[object Object]', "filter must be an object");
                            await this.db.deleteMany(
                                this.collectionName,
                                payload.filter,
                                payload.options==undefined?{}:JSON.parse(payload.options)
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
                            payload.operations = JSON.parse(payload.operations);
                            assert.equal(Object.prototype.toString.call(payload.operations), '[object Array]', "operations must be an array");
                            await this.db.bulkWrite(
                                this.collectionName,
                                payload.operations,
                                payload.options==undefined?{}:JSON.parse(payload.options)
                            ).then(res => {
                                returnData = {
                                    status: 200,
                                    result: {
                                        ok: res.ok,
                                        nRemoved: res.nRemoved
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
                        case "SyntaxError":
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

module.exports = Deleter;