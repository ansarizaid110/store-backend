class ProductRepository {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    get pool() {
        return this.connectionPool.getPool();
    }

    save(product, callback){
        return new Promise((resolve, reject) => {
            this.pool.query("insert into products set ?", product, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    get(id, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("select products.*, categories.name as category_name from products join categories on products.category_id = categories.id where products.id = ?", id, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    getAll(offset, limit, filters = {}) {
        return new Promise((resolve, reject) => {
          const { whereSql, params } = this.buildFilters(filters);
          const sortBy = this.allowedSort(filters.sortBy);
          const sortOrder = filters.sortOrder?.toLowerCase() === "desc" ? "DESC" : "ASC";
          const sql = `
            SELECT products.*, categories.name AS category_name
            FROM products
            JOIN categories ON products.category_id = categories.id
            ${whereSql}
            ORDER BY ${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?
          `;
          console.log(sql);
          console.log([...params, limit, offset]);
          this.pool.query(sql, [...params, limit, offset], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
    }

    buildFilters(filters) {
        const conditions = [];
        const params = [];
        if (filters.name) {
          conditions.push("products.name LIKE ?");
          params.push(`%${filters.name}%`);
        }
        if (filters.category_name) {
          conditions.push("categories.name LIKE ?");
          params.push(`%${filters.category_name}%`);
        }
        const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        return { whereSql, params };
    }

    allowedSort(sortBy) {
    const map = {
        price: "products.price",
        name: "products.name",
        id: "products.id",
        category_name: "categories.name",
    };
    return map[sortBy] || "products.id";
    }

    update(id, product, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("update products set ? where id = ?", [product, id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    delete(id, callback) {
        return new Promise((resolve, reject) => {
            this.pool.query("delete from products where id = ?", id, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    bulkInsert(products, callback) {
        return new Promise((resolve, reject) => {
            const values = products.map((p) => [p.category_id, p.name, p.image, p.price]);
            this.pool.query("insert into products (category_id, name, image, price) values ?", [values], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    count(filters = {}) {
        return new Promise((resolve, reject) => {
          const { whereSql, params } = this.buildFilters(filters);
          const sql = `
            SELECT COUNT(*) AS total
            FROM products
            JOIN categories ON products.category_id = categories.id
            ${whereSql}
          `;
          this.pool.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results[0].total);
          });
        });
    }
}

module.exports = ProductRepository;