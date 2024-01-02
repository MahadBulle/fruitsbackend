const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const itemsRoute = require('./Routers/itemsRouter')

const usersRoute = require('./Routers/usersRoutes')
const loginRoute = require('./Routers/Login-Route')



const app = express()
app.use(express.json())
app.use(cors());
const PORT = 6161;

app.get('/', (req, res) => {
  res.send("is working successfully !")
})

app.use('/items', itemsRoute)
app.use('/users', usersRoute)
app.use('/login', loginRoute)




connectDB();

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
module.exports = app
