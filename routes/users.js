var express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();
const connectionPool = require('../database/connectionPool');
const userRepository = require('../repositories/userRepository');

const repository = new userRepository(connectionPool);

// router.post("/register", async (req, res) => {
//     try {
//         const {email, password} = req.body;
//         const existingUser = await repository.getByEmail(email);

//         if(existingUser) {
//             return res.status(400).json({message: "User already exists."})
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await repository.save({email, password: hashedPassword}).then(user => user).catch(err => {
//             console.log("Register error: ", err);
//             res.status(500).json({message: "Server Error"}) 
//         });
//         res.status(201).json({message: "user created Succesfully.", user: user, status: "success"});
//     } catch (error) {
//         console.log("Register error: ", error)
//         res.status(500).json({message: "Server Error", status: "error"})
//     }
// });

// router.post("/login", async (req, res) => {
//     try {
//         const {email, password} = req.body;
//         const user = await repository.getByEmail(email);

//         if(!user) {
//             return res.status(400).json({message: "Invalid email."})
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if(!isPasswordMatch) {
//             return res.status(400).json({message: "Invalid password."})
//         }
//         const token = jwt.sign({userId: user.id}, "b2df9426acb4bb8b88a66d983b", {
//             expiresIn: "1h"
//         });
//         res.status(200).json({message: "Login Successful.", token: token, status: "success"})
//     } catch (error) {
//         console.log("Error logging in: ", error);
//         res.status(500).json({message: "Server Error", status: "error"})
//     }
// })

router.get("/", async (req, res) => {
    try {
        const id = req.user.userId;
        const user = await repository.get(id).then(user => user).catch(err => {
            console.log("User retrieval error: ", err); 
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({user: user, status: "success"});
    } catch (error) {
        console.log("User retrieval error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

router.put("/", async (req, res) => {
    try {
        const id = req.user.userId;
        const {email, password} = req.body;
        const updateUser = {
            email: email
        }
        if(password) {
            updateUser.password = await bcrypt.hash(password, 10);
        }
        const user = await repository.update(id, updateUser).then(user => user).catch(err => {
            console.log("User update error: ", err);
            res.status(500).json({message: "Server Error", status: "error"})
        });
        res.status(200).json({message: "User updated Succesfully.", user: user, status: "success"});  
    } catch (error) {
        console.log("User update error: ", error);
        res.status(500).json({message: "Server Error", status: "error"})
    }
});

module.exports = router;