var express = require('express');
var router = express.Router();
const connectionPool = require('../database/connectionPool');
const categoryRepository = require('../repositories/categoryRepository');

const repository = new categoryRepository(connectionPool);

router.post("/", async (req, res) => {
    try {
        const {name} = req.body;
        const category = await repository.save({name}).then(category => category).catch(err => {
            console.log("Category creation error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(201).json({message: "Category created Succesfully.", category: category, status: "success"});
    } catch (error) {
        console.log("Category creation error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.get("/", async (req, res) => {
    try {
        const categories = await repository.getAll().then(categories => categories).catch(err => {
            console.log("Category retrieval error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({categories: categories, status: "success"});
    } catch (error) {
        console.log("Category retrieval error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const category = await repository.get(id).then(category => category).catch(err => {
            console.log("Category retrieval error: ", err); 
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({category: category, status: "success"});
    } catch (error) {
        console.log("Category retrieval error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const category = await repository.update(id, {name}).then(category => category).catch(err => {
            console.log("Category update error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({message: "Category updated Succesfully.", category: category, status: "success"});
    } catch (error) {
        console.log("Category update error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const category = await repository.delete(id).then(category => category).catch(err => {
            console.log("Category deletion error: ", err);
            res.status(500).json({message: "Server Error", status: "error" })
        });
        res.status(200).json({message: "Category deleted Succesfully.", category: category, status: "success"});
    } catch (error) {
        console.log("Category deletion error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

module.exports = router;