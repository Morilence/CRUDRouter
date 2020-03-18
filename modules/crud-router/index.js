const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');

class CRUDRouter {

    constructor (db, collectionName) {
        this.db = db;
        this.collectionName = collectionName;
        this.routes = new Router()
            .get('/:id', async ctx => {
                let returnData = null;
                try {
                    await this.db.findOne(
                        this.collectionName,
                        {_id: ObjectId(ctx.params.id)}
                    ).then(res => {
                        returnData = {
                            status: 200,
                            doc: (res.length==0)?undefined:res[0]
                        }
                    })
                } catch (err) {
                    switch (err.name) {
                        case "SyntaxError":
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
            .get('/', async ctx => {
                let returnData = null;
                const payload = ctx.request.query;
                try {
                    assert.ok(payload.pipeline!=undefined, "pipeline must be defined");
                    payload.pipeline = JSON.parse(payload.pipeline);
                    assert.equal(Object.prototype.toString.call(payload.pipeline), '[object Array]', "pipeline must be an array");
                    // 将_id字符串转换为ObjectId
                    let indexOfMatch = payload.pipeline.findIndex(opeItem => opeItem["$match"] != undefined);
                    if (indexOfMatch != -1) {
                        let $match = payload.pipeline[indexOfMatch]["$match"];
                        if ($match._id != undefined) {
                            if (typeof $match._id == "string") {
                                payload.pipeline[indexOfMatch]["$match"]._id = ObjectId($match._id);
                            } else if (typeof $match._id == "object") {
                                if ($match._id["$in"] != undefined) {
                                    let inArr = [];
                                    payload.pipeline[indexOfMatch]["$match"]._id["$in"].forEach(idItem => {
                                        inArr.push(ObjectId(idItem));
                                    });
                                    payload.pipeline[indexOfMatch]["$match"]._id["$in"] = inArr;
                                }
                            }
                        }
                    }
                    await this.db.aggregate(
                        this.collectionName,
                        payload.pipeline,
                        payload.options==undefined?{}:JSON.parse(payload.options)
                    ).then(docs => {
                        returnData = {
                            status: 200,
                            docs
                        }
                    });
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

module.exports = CRUDRouter;