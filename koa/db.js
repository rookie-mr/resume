const {
    MongoClient,
    ObjectId
} = require('mongodb');
const config = require('./config.js');
class Db {
    static instance() {
        // 单一实例模式
        if (!this._instance) {
            this._instance = new Db(); // new Db();
        }
        return this._instance;
    }
    constructor() {
        this.client = null;
        this.connect();
    }
    connect() {
        let self = this;
        let url = `mongodb://${config.db.path}:${config.db.port}/${config.db.name}`;
        return new Promise((resolve, reject) => {
            if (this.client) {
                resolve(this.client);
            } else {
                MongoClient.connect(url, {
                    useUnifiedTopology: true
                }, function (err, client) {
                    if (err) {
                        reject(err);
                        return;
                    };
                    let db = client.db(config.db.name);
                    self.client = db;
                    resolve(db);
                });
            }
        })
    }
    insert(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(name).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            })
        })
    }
    remove(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(name).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            })
        })
    }
    clear(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(name).removeMany(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            })
        })
    }
    update(name, json, set, config) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(name).updateOne(json, {
                    $set: set
                }, config, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            })
        })
    }
    modify(name, json, set, config) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(name).updateMany(json, {
                    $set: set
                }, config, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            })
        })
    }
    find(name, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(function (db) {
                let result = db.collection(name).find(json);
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })
            })
        })

    }
    ObjectId(id) {
        return ObjectId(id);
    }
    Find_id(query, key) { // 对查询参数中_id或其他指定的key变ObjectId的处理
        let _id = key || '_id';
        if (typeof query[_id] === 'string') {
            query[_id] = this.ObjectId(query[_id]);
        } 
        if (typeof query[_id] === 'object') {
            let keys = Object.keys(query[_id]);
            keys.forEach((v, i) => {
                query[_id][v] = this.ObjectId(query[_id][v]);
            })
        }
        return query || {};
    }
}
// console.time('find');
// new Db().find('user').then(docs => {
//     console.log(docs);
//     console.timeEnd('find');
// });
module.exports = Db;