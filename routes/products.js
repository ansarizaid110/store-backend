const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');
const connectionPool = require('../database/connectionPool');
const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const repository = new productRepository(connectionPool);
const catRepository = new categoryRepository(connectionPool);

router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log(req.body);
        const {name, price, category_id} = req.body;
        const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;
        const product = await repository.save({name, image, price, category_id}).then(product => product).catch(err => {
            console.log("Product creation error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(201).json({message: "Product created Succesfully.", product: product, status: "success"});
    } catch (error) {
        console.log("Product creation error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            name: req.query.name || null,
            category_name: req.query.category_name || null,
            sortBy: req.query.sortBy || "id",
            sortOrder: req.query.sortOrder || "asc",
        };

        const totalProducts = await repository.count(filters);
        const products = await repository.getAll(offset, limit, filters);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
          products,
          totalPages,
          currentPage: page,
          status: "success",
        });
      } catch (error) {
        console.log("Product retrieval error: ", error);
        res.status(500).json({ message: "Server Error", status: "error" });
      }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const product = await repository.get(id).then(product => product).catch(err => {
            console.log("Product retrieval error: ", err); 
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({product: product, status: "success"});
    } catch (error) {
        console.log("Product retrieval error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const {id} = req.params;
        const { name, price, category_id } = req.body;

        const data = { name, price, category_id };
        if (req.file) {
            data.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const product = await repository.update(id, data).then(product => product).catch(err => {
            console.log("Product update error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({message: "Product updated Succesfully.", product: product, status: "success"});
    } catch (error) {
        console.log("Product update error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const product = await repository.delete(id).then(product => product).catch(err => {
            console.log("Product deletion error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({message: "Product deleted Succesfully.", product: product, status: "success"});
    } catch (error) {
        console.log("Product deletion error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.post("/bulk", upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(500).json({message: "No file uploaded.", status: "error"})
        }
        const categories = await catRepository.getAll().then(categories => categories).catch(err => {
            res.status(500).json({message: "Category retrieval error: ", status: "error"})
        });

        const results = [];
        const filePath = req.file.path;

        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const matched = categories.find(
                (category) => category.name === data.category?.trim()
            );
            if (matched) {
                const rowData = {
                    category_id: matched.id,
                    name: data.name,
                    image: data.image,
                    price: data.price
                }
                results.push(rowData);
            }
        })
        .on('end', async () => {
        try {
            const product = await repository.bulkInsert(results).then(product => product).catch(err => {
                console.log("Product creation error: ", err);
                res.status(500).json({message: "Server Error", status: "error"})
            });

            fs.unlinkSync(filePath);

            res.status(200).json({
                message: 'CSV file processed and data inserted successfully.',
                rowsProcessed: results.length
            });

        } catch (dbError) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            console.error('Database Insertion Error:', dbError);
            res.status(500).json({ message: 'Failed to insert data into database.', status: "error" });
        }
        })
        .on('error', (streamError) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            
            console.error('Stream Parsing Error:', streamError);
            res.status(500).json({ message: 'Failed to parse the CSV file.', status: "error" });
        });
    } catch (error) {
        console.log("Product creation error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

module.exports = router;