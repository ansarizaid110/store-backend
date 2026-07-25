# Store Backend

This is a project for a store that sells products.

This project is built with **Node.js**, **Express**, and **MySQL**.

## Features

- User registration and login
- Create categories and products
- Create products individually or in bulk
- Export products to CSV

## Author

Developed by **Zaid Ahmed Ansari**.

## Prerequisites

- Node.js
npm = 11.13.0
node = 24.16.0

- MySQL

## Setup

1. Change the database credentials in `database/dbConfig.js`.

2. Upload the database schema to your MySQL database from `resources/shop.sql`.

3. Install the dependencies:
npm install

4. Run the project:
npm run dev

This starts the project on port 3000.

## API
If the project is running on localhost, the API is available at:

http://localhost:3000/api

The API Postman collection is in:

resources/Store-API.postman_collection.json

## Data

Sample products data is available at `resources/product-catalog-10000.csv`