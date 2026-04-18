const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT;
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/eBird', require('./routes/eBird'));
app.use('/api/user', require('./routes/user'));
app.use('/api/bird', require('./routes/bird'));
app.use('/api/raspBird', require('./routes/raspberryBird'));
app.use('/api/raspberry', require('./routes/raspberry'));
app.use('/api/park', require('./routes/park'));

app.listen(port, () => console.log(`Server started on port ${port}`));