// models/index.js
const dotenv = require('dotenv');
dotenv.config();


let User;


    require('../../config/database.js'); // Connect to MongoDB
    User = require('./User.js');


module.exports = { User };