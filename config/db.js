const mongoose = require('mongoose');
const { dbURL } = require('./config.js');


const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
     
            console.log(`Connected to the database: ${dbURL}`);
       
    } catch (error) {
        console.log(`Error connecting to the database ${error}`);
        process.exit(1);
    }
};

module.exports = connectDB;
