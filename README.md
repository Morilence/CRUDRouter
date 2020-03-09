# CRUDRouter API v3.0

## 增

- METHOD : POST

- 参数详细 :

  - **mode** (String) : `one` (default) | `many`
  - **doc** (Object) : 文档（`one` 模式下）
  - **docs** (Array) : 文档组（`many` 模式下）
  - **options** (Object) : 配置，可选

- 请求示例（jqAjax） :

    ```js
    $.ajax({
        type: 'post',
        url: rootUrl+'/api',
        data: {
            mode: 'one',
            doc: {
                name: 'morilence'
            }
        },
        /*
        data: {
            mode: 'many',
            docs: [
                {name: garlicgo},
                {name: morilence}
            ]
        },
        */
        dataType: 'json',
        /* other */
    });
    ```

## 删

- METHOD : DELETE

- 参数详细 :

  - **mode** (String) : `one` (default) | `many` | `bulk`
  - **filter** (Object) : 过滤器（`one` | `many` 模式下）
  - **operations** (Array) : 操作组（`bulk` 模式下）
  - **options** (Object) : 配置，可选

- 请求示例（jqAjax） :

    ```js
    $.ajax({
        type: 'delete',
        url: rootUrl+'/api',
        data: {
            // 删除匹配的第一项
            mode: 'one',
            filter: JSON.stringify({
                name: 'morilence'
            })
        },
        /*
        * 删除所有匹配项
        data: {
            mode: 'many',
            filter: JSON.stringify({
                name: { $regex: 'fuck', $options: 'g' }
            })
        },
        */
        /*
        * 批量执行
        data: {
            mode: 'bulk',
            operations: JSON.stringify([
                {
                    deleteOne: {
                        filter: {name: 'morilence'}
                    }
                },
                {
                    deleteOne: {
                        filter: {name: 'garlicgo'}
                    }
                },
                {
                    deleteMany: {
                        name: { $regex: 'fuck', $options: 'g' }
                    }
                }
            ])
        },
        */
        dataType: 'json',
        /* other */
    });
    ```

## 改

- METHOD : PUT

- 参数详细 :

  - **mode** (String) : `one` (default) | `many` | `bulk`
  - **filter** (Object) : 过滤器（`one` | `many` 模式下）
  - **update** (Object) : 更新信息（`one` | `many` 模式下）
  - **operations** (Array) : 操作组（`bulk` 模式下）
  - **options** (Object) : 配置，可选

- 请求示例（jqAjax） :

    ```js
    $.ajax({
        type: 'put',
        url: rootUrl+'/api',
        data: {
            // 更新匹配的第一项
            mode: 'one',
            filter: {
                name: 'morilence'
            },
            update: {
                $set: {height: 177}
            }
        },
        /*
        * 更新所有匹配项
        data: {
            mode: 'many',
            filter: {
                name: { $regex: 'fuck', $options: 'g' }
            },
            update: {
                $set: {name: '该名称含有违禁字词'}
            }
        },
        */
        /*
        * 批量执行
        data: {
            mode: 'bulk',
            operations: [
                {
                    updateOne: {
                        filter: {name: 'morilence'},
                        update: {$set: {height: 177}}
                    }
                },
                {
                    updateOne: {
                        filter: {name: 'garlicgo'},
                        update: {$set: {height: 152}}
                    }
                },
                {
                    updateMany: {
                        filter: {name: { $regex: 'fuck', $options: 'g' }},
                        update: {$set: {name: '该名称含有违禁字词'}}
                    }
                }
            ]
        },
        */
        dataType: 'json',
        /* other */
    });
    ```

## 查

- METHOD : GET

- 参数详细 :

  - **pipeline** (Array) : 操作管道
  - **options** (Object) : 配置，可选

- 请求示例（jqAjax） :

    ```js
    $.ajax({
        type: 'get',
        url: rootUrl+'/api',
        data: {
            pipeline: JSON.stringify([
                {$match: {age: {$lt: 18}}},
                {$sort: 1},
                {$skip: 0},
                {$limit: 100}
                {$project: {name: 1, age: 1}}
            ])
        },
        dataType: 'json',
        /* other */
    });
    ```
