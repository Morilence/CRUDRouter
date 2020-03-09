const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');

class Poster {

    constructor (db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
        this.routes = new Router()
            .post('/', async ctx => {
                let returnData = null;
                const payload = ctx.request.body;
                try {
                    switch (payload.mode) {
                        case undefined:
                        case "one": {
                            assert.ok(payload.doc!=undefined, "doc must be defined");
                            assert.equal(Object.prototype.toString.call(payload.doc), '[object Object]', "doc must be an object");
                            await this.db.insertOne(
                                this.collectionName,
                                payload.doc,
                                payload.options==undefined?{}:payload.options
                            ).then(res => {
                                returnData = {
                                    status: 201,
                                    result: res.result,
                                    target: res.ops[0]
                                }
                            })
                        }
                        break;
                        case "many": {
                            assert.ok(payload.docs!=undefined, "docs must be defined");
                            assert.equal(Object.prototype.toString.call(payload.docs), '[object Array]', "docs must be an array");
                            await this.db.insertMany(
                                this.collectionName,
                                payload.docs,
                                payload.options==undefined?{}:payload.options
                            ).then(res => {
                                returnData = {
                                    status: 201,
                                    result: res.result,
                                    targets: res.ops
                                }
                            })
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

module.exports = Poster;