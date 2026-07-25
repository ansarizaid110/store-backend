class CustomerRepository {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    get pool() {
        return this.connectionPool.getPool();
    }

    save(user, callback){
        return new Promise((resolve, reject) => {
            this.pool.query("insert into users set ?", user, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    getByEmail(email) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                "select * from users where email = ?",
                [email],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0]);
                }
            );
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.pool.query(
                "select id, email from users where id = ?",
                [id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results[0]);
                }
            );
        });
    }

    getAll(callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("select * from users", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    update(id, customer, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("update users set ? where id = ?", [customer, id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    delete(id, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("delete from users where id = ?", id, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = CustomerRepository;