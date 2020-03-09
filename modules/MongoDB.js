const MongoClient = require('mongodb').MongoClient;

class MongoDB {

    constructor (dbUrl, dbName) {
        this.db = null;
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.connect();
    }

    connect () {
        return new Promise((resolve, reject) => {
            // 判断db对象存不存在，不存在则创建，存在则返回已有的，避免每次都进行重新连接
            if (!this.db) {
                MongoClient.connect(this.dbUrl, {useNewUrlParser:true, useUnifiedTopology: true}, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.db = client.db(this.dbName);
                        resolve(this.db);
                    }
                });
            } else {
                resolve(this.db);
            }
        }); 
    }

    bulkWrite (collectionName, operations, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).bulkWrite(operations, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    insertOne (collectionName, doc, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(doc, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    insertMany (collectionName, docs, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertMany(docs, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    deleteOne (collectionName, filter, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).deleteOne(filter, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    deleteMany (collectionName, filter, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).deleteMany(filter, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    updateOne (collectionName, filter, update, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(filter, update, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    updateMany (collectionName, filter, update, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateMany(filter, update, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }

    findOne (collectionName, filter, projection={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const cursor = db.collection(collectionName).find(filter).limit(1).project(projection);
                // 遍历结果
                cursor.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        });
    }

    findMany (collectionName, filter, projection={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const cursor = db.collection(collectionName).find(filter).project(projection);
                // 遍历结果
                cursor.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        });
    }

    aggregate (collectionName, pipeline, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).aggregate(pipeline, options, (err, cursor) => {
                    if (err) {
                        reject(err);
                    } else {
                        cursor.toArray(function (err, docs) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(docs);
                            }
                        });
                    }
                });
            });
        });
    }

    count (collectionName, query, options={}) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).count(query, options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        });
    }
}

module.exports = MongoDB;