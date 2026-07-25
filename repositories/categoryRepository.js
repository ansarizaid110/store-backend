class CategoryRepository {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    get pool() {
        return this.connectionPool.getPool();
    }

    save(category, callback){
        return new Promise((resolve, reject) => {
            this.pool.query("insert into categories set ?", category, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    get(id, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("select * from categories where id = ?", id, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    getAll(callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("select * from categories", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    update(id, category, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("update categories set ? where id = ?", [category, id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    delete(id, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("delete from categories where id = ?", id, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = CategoryRepository;