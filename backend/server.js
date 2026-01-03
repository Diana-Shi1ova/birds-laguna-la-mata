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

app.listen(port, () => console.log(`Server started on port ${port}`));