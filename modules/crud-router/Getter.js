const assert = require('assert');
const ObjectId = require('mongodb').ObjectId;
const Router = require('koa-router');

class Getter {

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
                                    payload.pipeline[indexOfMatch]["$match"]._id["$in"].forEach(idItem => {
                                        idItem = ObjectId(idItem);
                                    });
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
            .routes();
    }

    getRoutes () {
        return this.routes;
    }
}

module.exports = Getter;